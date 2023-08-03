<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" size="mini" :inline="true">
      <el-form-item label="续签历史" prop="startDate">
        <el-select v-model="queryParams['contractId']" @change="handleQuery" style="width: 300px">
          <el-option
            v-for="item in contList"
            :key="item.value"
            :label="item.effectiveDate + '~' + item.endDate + ' ' + item.contractName"
            :value="item.contractId"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="gl-search_button">
        <el-button @click="$refs.detail.openFn()">合同详情</el-button>
      </el-form-item>
    </el-form>

    <div class="gl-body">
      <div style="height: 48px;">
        收款信息表
        <el-row :gutter="10" class="mb8" v-if="contObj.isFile !== 1">
          <el-col :span="1.5">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="handleAdd"
              v-hasPermi="['affairs:payment:add']"
            >新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        ref="gatheringTable"
        size="mini"
        height="323px"
        border
        @header-dragend="$nextTick(() => { $refs.gatheringTable.doLayout() })"
        v-loading="loading"
        :data="paymentList"
        show-summary
        :summary-method="$event => getSummaries($event, [2, 4, 5], '收款合计')"
        highlight-current-row
        @current-change="listInvoiceFn"
      >
        <el-table-column label="应收日期" align="center" prop="paymentDueDate" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.paymentDueDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务区间" align="center" prop="paymentDueInterval" width="170" show-overflow-tooltip />
        <el-table-column label="应收款" align="center" prop="paymentDueMoney" show-overflow-tooltip />
        <el-table-column label="实收日期" align="center" prop="paymentActualDate" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.paymentActualDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实收款" align="center" prop="paymentActualMoney" show-overflow-tooltip />
        <el-table-column label="未开票金额" align="center" prop="uninvoicedMoney" show-overflow-tooltip />
        <el-table-column label="结账状态" align="center" prop="closeAccounts" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.ischange" :value="scope.row.closeAccounts" />
          </template>
        </el-table-column>
        <el-table-column label="缴费方式" align="center" prop="paymentMethod" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.paymentmethod" :value="scope.row.paymentMethod" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="120" v-if="contObj.isFile !== 1">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:payment:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:payment:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="height: 48px; margin-top: 20px">
        发票信息表
        <el-row :gutter="10" class="mb8" v-if="contObj.isFile !== 1 && groupPaymentId !== null">
          <el-col :span="1.5">
            <el-button
              v-if="groupPaymentObj.uninvoicedMoney !== 0"
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="invoicehandleAdd"
              v-hasPermi="['affairs:invoice:add']"
            >新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        ref="table"
        size="mini"
        height="calc(100vh - 732px)"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="invoiceLoading"
        :data="invoiceList"
      >
        <el-table-column label="开票日期" align="center" prop="createTime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票号" align="center" prop="invoiceNumber" show-overflow-tooltip />
        <el-table-column label="发票金额" align="center" prop="invoiceValue" show-overflow-tooltip />
        <el-table-column label="开票人" align="center" prop="drawer" />
        <el-table-column label="收费期间起" align="center" prop="chargeStartTime" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.chargeStartTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费期间止" align="center" prop="chargeEndTime" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.chargeEndTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="120" v-if="contObj.isFile !== 1">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="invoicehandleUpdate(scope.row)"
              v-hasPermi="['affairs:invoice:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="invoicehandleDelete(scope.row)"
              v-hasPermi="['affairs:invoice:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加或修改收款信息对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="服务区间" prop="paymentDueInterval">
          <el-date-picker
            v-model="form.paymentDueInterval"
            unlink-panels
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="应收日期" prop="paymentDueDate">
          <el-date-picker clearable v-model="form.paymentDueDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择日期" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="应收款" prop="paymentDueMoney">
          <!-- <el-input v-model="form.paymentDueMoney" placeholder="请输入应收款" /> -->
          <el-input-number
            class="ipt-number"
            placeholder="请输入应收款"
            v-model="form['paymentDueMoney']"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="实收日期" prop="paymentActualDate" v-if="form.groupPaymentId != null">
          <el-date-picker clearable v-model="form.paymentActualDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择日期" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实收款" prop="paymentActualMoney" v-if="form.groupPaymentId != null">
          <el-input v-model="form.paymentActualMoney" placeholder="请输入实收款" />
        </el-form-item>
        <el-form-item label="缴费方式" prop="paymentMethod">
          <el-select v-model="form.paymentMethod" placeholder="请选择缴费方式" :style="{ width: '100%' }">
            <el-option v-for="dict in dict.type.paymentmethod" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结账状态" prop="closeAccounts" v-if="form.groupPaymentId">
          <el-select v-model="form.closeAccounts" placeholder="请选择缴费方式" :style="{ width: '100%' }">
            <el-option v-for="dict in dict.type.ischange" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改发票信息对话框 -->
    <el-dialog v-dialogDrag :title="invoicetitle" :visible.sync="invoiceopen" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="invoiceform" :model="invoiceform" :rules="invoicerules" label-width="90px">
        <el-form-item label="开票日期" prop="createTime">
          <el-date-picker clearable v-model="invoiceform.createTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择收费期间起" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收费期间起" prop="chargeStartTime">
          <el-date-picker clearable v-model="invoiceform.chargeStartTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择收费期间起" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收费期间止" prop="chargeEndTime">
          <el-date-picker clearable v-model="invoiceform.chargeEndTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择收费期间止" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发票号" prop="invoiceNumber">
          <el-input v-model="invoiceform.invoiceNumber" placeholder="请输入发票号" />
        </el-form-item>
        <el-form-item label="发票金额" prop="invoiceValue">
          <el-input v-model="invoiceform.invoiceValue" placeholder="请输入发票金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="invoiceform.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="invoicesubmitForm">确 定</el-button>
        <el-button @click="invoicecancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="合同详情"
      width="900px"
      label-width="90px"
      span="4.5"
      :config="detailConfig"
      :detail="contObj"
      :dict="dict"
    />
  </div>
</template>

<script>
import { listPayment, getPayment, delPayment, addPayment, updatePayment, detailConfig } from "@/api/Stationary/Entry.js";
import { listInvoice, getInvoice, delInvoice, addInvoice, updateInvoice } from "@/api/Stationary/InvoiceQuery.js";
import { listHistory } from "@/api/Stationary/stationaryContract/ContractQuery.js";
import { getSummaries } from '@/utils/table'
import DetailDialog from '@/views/components/detailDialog.vue'
import dayjs from 'dayjs'

export default {
  dicts: ['ischange', 'paymentmethod', 'paymentcycle', 'contractsubmission', 'un', 'contractstate'],
  name: "SpEntry",
  components: { DetailDialog },
  data() {
    return {
      // 合同
      contList: [],
      detailConfig,
      // 收款信息
      groupPaymentId: null,
      groupPaymentObj: {},
      // 收款发票信息表格数据
      invoiceList: [],
      // 遮罩层
      loading: true,
      invoiceLoading: false,
      // 总条数
      total: 0,
      // 驻点合同收款信息表格数据
      paymentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        contractId: null,
        // startDate: null,
        // endDate: null,
      },
      invoicerules: {
        invoiceNumber: [
          { required: true, message: "发票号不能为空", trigger: "blur" }
        ],
        invoiceValue: [
          { required: true, message: "发票金额不能为空", trigger: "blur" }
        ],
      },
      invoicetitle: '',
      invoiceopen: false,
      invoiceform: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        'paymentDueInterval': [
          { required: true, message: '服务区间不能为空', trigger: 'blur' },
        ],
      }
    };
  },
  created() {
    this.getContList()
  },
  computed: {
    // 选中的续签合同
    contObj() {
      return this.contList.find(item => item.contractId === this.queryParams.contractId) || { isFile: 0 }
    }
  },
  // watch: {
  //   $route(route) {
  //     if(route.name === 'SpEntry') this.getContList()
  //   },
  // },
  methods: {
    getSummaries,
    // 获取合同列表
    async getContList() {
      const res = await listHistory({ renewalId: this.$route.params.renewalId })
      this.contList = res.rows
      this.queryParams.contractId = +this.$route.query.contractId || res.rows[0].contractId
      this.getList()
    },
    /** 查询驻点合同收款信息列表 */
    getList() {
      this.loading = true;
      listPayment(this.queryParams).then(res => {
        this.paymentList = res.rows
        this.total = res.total
        this.loading = false

        this.$nextTick(() => {
          this.$refs.gatheringTable.doLayout()
          // 选中收款信息列表中数据，请求发票信息表
          const groupPaymentId = this.groupPaymentId || res.rows[0]?.groupPaymentId
          const currentRow = this.paymentList.find(item => item.groupPaymentId === groupPaymentId)
          if(currentRow) this.$refs.gatheringTable.setCurrentRow(currentRow)
        })
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        groupPaymentId: null,
        paymentDueDate: null,
        paymentDueMoney: null,
        paymentMethod: 0,
        contractId: null,
        closeAccounts: 0,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.handleClear()
      this.getList();
    },
    // 清除子列表查询条件
    handleClear() {
      this.groupPaymentId = null
      this.invoiceList = []
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.groupId = this.queryParams.groupId - 0
      this.form.contractId = this.queryParams.contractId - 0
      this.open = true;
      this.title = "添加收款信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const groupPaymentId = row.groupPaymentId
      getPayment(groupPaymentId).then(response => {
        this.form = response.data;
        this.form.paymentDueInterval = response.data.paymentDueInterval.split('~')
        this.open = true;
        this.title = "修改收款信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const form = { ...this.form, paymentDueInterval: this.form.paymentDueInterval.join('~') }
          if (this.form.groupPaymentId != null) {
            updatePayment(form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPayment(form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const groupPaymentIds = row.groupPaymentId
      this.$modal.confirm('是否确认删除该收款信息？').then(function () {
        return delPayment(groupPaymentIds);
      }).then(() => {
        this.handleClear()
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('affairs/payment/export', {
        ...this.queryParams
      }, `payment_${new Date().getTime()}.xlsx`)
    },
    // 获取发票信息列表
    listInvoiceFn(row) {
      if(row?.groupPaymentId) {
        this.invoiceLoading = true
        this.groupPaymentId = row.groupPaymentId
        this.groupPaymentObj = row
        listInvoice({ groupPaymentId: row.groupPaymentId }).then(response => {
          this.invoiceList = response.rows
          this.total = response.total
          this.invoiceLoading = false
        })
      }
    },
    // 表单重置
    invoicereset() {
      this.invoiceform = {
        invoiceId: null,
        createTime: dayjs().format('YYYY-MM-DD'),
        invoiceNumber: null,
        invoiceValue: null,
        chargeStartTime: null,
        chargeEndTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    invoicehandleUpdate(row) {
      this.invoicereset();
      this.invoiceform.groupPaymentId = this.groupPaymentId
      const invoiceId = row.invoiceId
      getInvoice(invoiceId).then(response => {
        this.invoiceform = response.data;
        this.invoiceopen = true;
        this.invoicetitle = "修改收款发票信息";
      });
    },
    invoicehandleDelete(row) {
      const invoiceIds = row.invoiceId;
      this.$modal.confirm('是否确认删除该发票信息？').then(function () {
        return delInvoice(invoiceIds);
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    invoicehandleAdd() {
      this.invoicereset();
      this.invoiceform.groupPaymentId = this.groupPaymentObj.groupPaymentId
      this.invoiceform.invoiceValue = this.groupPaymentObj.uninvoicedMoney

      // 收费期间同步服务区间
      const timeArr = this.groupPaymentObj.paymentDueInterval.split('~')
      this.invoiceform.chargeStartTime = timeArr[0]
      this.invoiceform.chargeEndTime = timeArr[1]

      this.invoiceopen = true;
      this.invoicetitle = "添加收款发票信息";
    },
    /** 提交按钮 */
    invoicesubmitForm() {
      this.$refs["invoiceform"].validate(valid => {
        if (valid) {
          if (this.invoiceform.invoiceId != null) {
            updateInvoice(this.invoiceform).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.invoiceopen = false;
              this.getList()
            });
          } else {
            addInvoice(this.invoiceform).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.invoiceopen = false;
              this.getList()
            });
          }
        }
      });
    },
    // 取消按钮
    invoicecancel() {
      this.invoiceopen = false;
      this.invoicereset();
    },
  }
};
</script>
