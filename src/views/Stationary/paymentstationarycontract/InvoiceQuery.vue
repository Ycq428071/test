<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" size="small" :inline="true"
      label-width="108px">
      <el-form-item label="驻点收款信息" prop="groupPaymentId">
        <el-input v-model="queryParams.groupPaymentId" placeholder="请输入驻点收款信息" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-popover placement="bottom" trigger="click">
        <el-form-item label="发票号" prop="invoiceNumber">
          <el-input v-model="queryParams.invoiceNumber" placeholder="请输入发票号" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="发票金额" prop="invoiceValue">
          <el-input v-model="queryParams.invoiceValue" placeholder="请输入发票金额" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="开票人" prop="drawer">
          <el-input v-model="queryParams.drawer" placeholder="请输入开票人" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="收费期间起" prop="chargeStartTime">
          <el-date-picker clearable v-model="queryParams.chargeStartTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择收费期间起">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收费期间止" prop="chargeEndTime">
          <el-date-picker clearable v-model="queryParams.chargeEndTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择收费期间止">
          </el-date-picker>
        </el-form-item>
        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>
      </el-popover>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['affairs:invoice:add']">新增</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="发票主键id" align="center" prop="invoiceId" />
        <el-table-column label="驻点收款信息主键id" align="center" prop="groupPaymentId" />
        <el-table-column label="发票号" align="center" prop="invoiceNumber" />
        <el-table-column label="发票金额" align="center" prop="invoiceValue" />
        <el-table-column label="开票人" align="center" prop="drawer" />
        <el-table-column label="收费期间起" align="center" prop="chargeStartTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.chargeStartTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费期间止" align="center" prop="chargeEndTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.chargeEndTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:invoice:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:invoice:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改收款发票信息对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="驻点收款信息主键id" prop="groupPaymentId">
          <el-input v-model="form.groupPaymentId" placeholder="请输入驻点收款信息主键id" />
        </el-form-item>
        <el-form-item label="发票号" prop="invoiceNumber">
          <el-input v-model="form.invoiceNumber" placeholder="请输入发票号" />
        </el-form-item>
        <el-form-item label="发票金额" prop="invoiceValue">
          <el-input v-model="form.invoiceValue" placeholder="请输入发票金额" />
        </el-form-item>
        <el-form-item label="开票人" prop="drawer">
          <el-input v-model="form.drawer" placeholder="请输入开票人" />
        </el-form-item>
        <el-form-item label="收费期间起" prop="chargeStartTime">
          <el-date-picker clearable v-model="form.chargeStartTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择收费期间起">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收费期间止" prop="chargeEndTime">
          <el-date-picker clearable v-model="form.chargeEndTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择收费期间止">
          </el-date-picker>
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
  </div>
</template>

<script>
import { listInvoice, getInvoice, delInvoice, addInvoice, updateInvoice } from "@/api/Stationary/InvoiceQuery.js";

export default {
  name: "Invoice",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 收款发票信息表格数据
      invoiceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupPaymentId: null,
        invoiceNumber: null,
        invoiceValue: null,
        drawer: null,
        chargeStartTime: null,
        chargeEndTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        groupPaymentId: [
          { required: true, message: "驻点收款信息主键id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询收款发票信息列表 */
    getList() {
      this.loading = true;
      listInvoice(this.queryParams).then(response => {
        this.invoiceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    invoicereset() {
      this.form = {
        invoiceId: null,
        groupPaymentId: null,
        invoiceNumber: null,
        invoiceValue: null,
        drawer: null,
        chargeStartTime: null,
        chargeEndTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.invoiceId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加收款发票信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const invoiceId = row.invoiceId || this.ids
      getInvoice(invoiceId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改收款发票信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.invoiceId != null) {
            updateInvoice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInvoice(this.form).then(response => {
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
      const invoiceIds = row.invoiceId || this.ids;
      this.$modal.confirm('是否确认删除收款发票信息编号为"' + invoiceIds + '"的数据项？').then(function () {
        return delInvoice(invoiceIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('affairs/invoice/export', {
        ...this.queryParams
      }, `invoice_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style less="scss" scoped>
.el-input {
  width: 200px;
}
</style>