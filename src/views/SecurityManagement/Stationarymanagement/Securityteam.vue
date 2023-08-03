<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="分队名称" prop="unitName">
        <el-input v-model="queryParams.unitName" placeholder="请输入分队名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <search-select v-model="queryParams.deptId" :listFn="listDeptFn" label="deptName"
          option="deptId" placeholder="请选择部门" />
      </el-form-item>
      <el-form-item label="所属中队" prop="squadronId">
        <el-tooltip :disabled="!!queryParams.deptId" content="请先选择部门" effect="dark" placement="top-start">
          <search-select v-model="queryParams.squadronId" :listFn="listSquaFn" :disabled="!queryParams.deptId"
            :watchVal="queryParams.deptId" label="squadronName" option="squadronId"
            placeholder="请选择中队" filterable remote />
        </el-tooltip>
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
            v-hasPermi="['affairs:staffUnit:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:staffUnit:export']">导出</el-button>
        </el-col>
      </el-row>

      <el-table height="calc(100vh - 84px - 60px - 86px - 70px - 56px - 50px)" v-loading="loading" :data="staffUnitList"
        @selection-change="handleSelectionChange">
        <el-table-column label="分队名称" align="center" prop="unitName" />
        <el-table-column label="所属部门" align="center" prop="deptName" />
        <el-table-column label="所属中队" align="center" prop="squadronName" />
        <el-table-column label="联系电话" align="center" prop="telephone" />
        <el-table-column label="地址" align="center" prop="address" />
        <el-table-column label="负责人" align="center" prop="head" />
        <!-- <el-table-column label="状态：0正常" align="center" prop="status" /> -->
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row)"
              size="mini" v-hasPermi="['affairs:staffUnit:edit']">修改</el-button>
            <el-button type="text" @click="handleDelete(scope.row)"
              size="mini" v-hasPermi="['affairs:staffUnit:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改保安分队管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="600px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分队名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入分队名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <search-select v-model="form.deptId" :listFn="listDeptFn" :backArr="backObj.dept"
            label="deptName" option="deptId" placeholder="请选择部门" />
        </el-form-item>
        <el-form-item label="所属中队" prop="squadronId">
          <el-tooltip :disabled="!!form.deptId" content="请先选择部门" effect="dark" placement="top-start">
            <search-select v-model="form.squadronId" :listFn="formSquaFn" :disabled="!form.deptId"
              :watchVal="form.deptId" :backArr="backObj.squa" label="squadronName" option="squadronId" placeholder="请选择中队"
              filterable />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="负责人" prop="head">
          <el-input v-model="form.head" placeholder="请输入负责人" />
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
import { listDept, listSqua } from "@/api/wage_manage/query";
import { listStaffUnit, getStaffUnit, delStaffUnit, addStaffUnit, updateStaffUnit, Department } from "@/api/SecurityManagement/staffUnit.js";
import { listSquadron } from "@/api/SecurityManagement/Squadron.js";
import searchSelect from '@/views/components/searchSelect.vue';
export default {
  name: "Securityteam",
  components: { searchSelect },
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
      // 保安分队管理表格数据
      staffUnitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        unitName: null,
        squadronId: null,
        deptId: null,
        telephone: null,
        address: null,
        head: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        unitName: [
          { required: true, message: "分队名称不能为空", trigger: "blur" }
        ],
        squadronId: [
          { required: true, message: "所属中队ID不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所属部门id不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态：0正常不能为空", trigger: "change" }
        ],
      },
      // 中队列表
      Squadronlist: [],
      // 部门列表
      DepartmentList: [],

      backObj: {
        dept: [],
        squa: [],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安分队管理列表 */
    async getList() {
      this.loading = true;
      listStaffUnit(this.queryParams).then(response => {
        this.staffUnitList = response.rows;
        this.total = response.total;
        this.loading = false;
      });


    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询中队方法
    async listSquaFn(queryParams) {
      const { rows, total } = await listSqua({
        ...queryParams,
        deptId: this.queryParams.deptId,
      })

      return { rows, total }
    },
    // 查询中队方法
    async formSquaFn(queryParams) {
      const { rows, total } = await listSqua({
        ...queryParams,
        deptId: this.form.deptId,
      })

      return { rows, total }
    },
    // 表单重置
    reset() {
      this.form = {
        unitId: null,
        unitName: null,
        deptId: null,
        squadronId: null,
        telephone: null,
        address: null,
        head: null,
        remark: null,
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
      this.ids = selection.map(item => item.unitId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    async handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加保安分队管理"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = "修改保安分队管理"
      this.reset();
      this.backObj.dept = [{ deptName: row.deptName, deptId: row.deptId }]
      this.backObj.squa = [{ squadronName: row.squadronName, squadronId: row.squadronId }]
      this.form = { ...row }
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.unitId != null) {
            updateStaffUnit(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStaffUnit(this.form).then(response => {
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
      const unitIds = row.unitId || this.ids;
      this.$modal.confirm('是否确认删除该分队？').then(function () {
        return delStaffUnit(unitIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('affairs/staffUnit/export', {
        ...exportParams
      }, `保安分队表_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
