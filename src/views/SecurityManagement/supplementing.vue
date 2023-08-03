<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <!-- <el-form-item label="保安姓名" prop="securityName">
        <el-input v-model="queryParams.securityName" placeholder="请输入保安姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="保安姓名" prop="securityId">
        <search-select
          v-model="queryParams.securityId"
          :listFn="listHeadFn"
          label="securityName"
          option="securityId"
          placeholder="请选择保安"
          filterable
        />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select v-model="queryParams.deptId" :listFn="listDeptFn" label="deptName"
          option="deptId" placeholder="请选择大队" />
      </el-form-item>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
            v-hasPermi="['affairs:supply:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['affairs:supply:export']"
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" v-loading="loading" :data="supplyList" height="calc(100vh - 244px - 106px - 56px)">
        <el-table-column label="保安人员" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="所属部门" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="银行账号" align="center" prop="account" width="170" show-overflow-tooltip />
        <el-table-column label="自补类型" align="center" prop="supplyType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['supplytype']" :value="scope.row['supplyType']" />
          </template>
        </el-table-column>
        <el-table-column label="自补状态" align="center" prop="supplyStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['supplystatus']" :value="scope.row['supplyStatus']" />
          </template>
        </el-table-column>
        <el-table-column label="复核人" align="center" prop="reviewedBy" show-overflow-tooltip />
        <el-table-column label="复核日期" align="center" prop="checkDate" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.checkDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="自补起始日期" align="center" prop="supplyStartDate" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.supplyStartDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="停补状态" align="center" prop="offSupplyStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['offsupplystatus']" :value="scope.row['offSupplyStatus']" />
          </template>
        </el-table-column>
        <el-table-column label="停补日期" align="center" prop="offSupplyDate" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.offSupplyDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:supply:edit']">修改</el-button>
            <el-button v-if="scope.row.supplyStatus == 0" size="mini" type="text"
              @click="handleDelete(scope.row)" v-hasPermi="['affairs:supply:edit']">复核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改保安自补管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="保安名称" prop="securityId">
          <search-select
            v-model="form.securityId"
            :listFn="listHeadFn"
            :backArr="backObj.head"
            :disabled="form.supplyId !== null"
            label="securityName"
            option="securityId"
            placeholder="请选择保安"
            filterable
          />
        </el-form-item>
        <el-form-item label="自补类型" prop="supplyType">
          <el-select v-model="form.supplyType" placeholder="请选择自补类型" :style="{ width: '100%' }">
            <el-option v-for="dict in dict.type.supplytype" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="复核日期" prop="checkDate">
          <el-date-picker clearable v-model="form.checkDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择复核日期" :style="{ width: '100%' }">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="自补状态" prop="supplyStatus">
          <el-select v-model="form.supplyStatus" placeholder="请选择自补状态" :style="{ width: '100%' }">
            <el-option v-for="dict in dict.type.supplystatus" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="自补起始日期" prop="supplyStartDate">
          <el-date-picker clearable v-model="form.supplyStartDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择自补起始日期" :style="{ width: '100%' }">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="停补状态" prop="offSupplyStatus">
          <el-select v-model="form.offSupplyStatus" placeholder="请选择停补状态" :style="{ width: '100%' }">
            <el-option v-for="dict in dict.type.offsupplystatus" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="停补日期" prop="offSupplyDate">
          <el-date-picker clearable v-model="form.offSupplyDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择停补日期" :style="{ width: '100%' }">
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
import { listSupply, addSupply, updateSupply } from "@/api/SecurityManagement/supplementing.js";
import { listDept, listHead } from '@/api/wage_manage/query'
import searchSelect from '@/views/components/searchSelect.vue';
import store from '../../store/index'
import dayjs from 'dayjs';
export default {
  dicts: ['supplytype', 'supplystatus', 'offsupplystatus'],
  name: "supplementing",
  components: { searchSelect },
  data() {
    return {
      aa: '',
      staffList: [],
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
      // 保安自补管理表格数据
      supplyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        securityId: null,
        offSupplyStatus: 1,
      },
      // 表单参数
      form: {},
      // 选择器回显数据
      backObj: {
        head: [],
      },
      // 表单校验
      rules: {
      },
      reviewedBy: null
    };
  },
  async created() {
    this.getList();
  },
  methods: {
    /** 查询保安自补管理列表 */
    getList() {
      this.reviewedBy = store.getters.name
      this.loading = true
      listSupply(this.queryParams).then(response => {
        this.supplyList = response.rows
        this.total = response.total
        this.loading = false
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        supplyId: null,
        supplyType: 0,
        // supplyStatus: null,
        checkDate: null,
        supplyStartDate: null,
        // offSupplyStatus: null,
        offSupplyDate: null,
        remark: null,
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 查询大队方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询保安方法
    async listHeadFn(queryParams) {
      const { rows, total } = await listHead({
        ...queryParams,
        status: 0,
        endowmentInsurance: 2
      })

      return { rows, total }
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.title = "添加保安自补管理"
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.backObj.head = [{ securityName: row.securityName, securityId: row.securityId }]
      this.form = { ...row }
      this.open = true
      this.title = "修改保安自补管理"
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.supplyId != null) {
            updateSupply(this.form).then(response => {

              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.supplyStatus = 0
            addSupply(this.form).then(response => {
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
      this.form.reviewedBy = this.reviewedBy
      let now = dayjs();
      let time = now.format('YYYY-MM-DD HH:mm:ss');
      this.form.checkDate = time
      this.form.supplyId = row.supplyId,
        this.form.supplyStatus = 1
      updateSupply(this.form).then(response => {
        this.$modal.msgSuccess("成功");
        this.open = false;
        this.getList();
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/supply/export', {
        ...exportParams
      }, `自补保安表_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
