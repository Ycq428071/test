<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label-width="80px" label="中队名称" prop="squadronName">
        <el-input v-model="queryParams.squadronName" placeholder="请输入中队名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="负责人" prop="head">
        <el-input v-model="queryParams.head" placeholder="请输入负责人" clearable @keyup.enter.native="handleQuery" />
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
            v-hasPermi="['affairs:squadron:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:squadron:export']">导出</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="squadronList" height="calc(100vh - 244px - 106px - 56px)">
        <el-table-column label="中队名称" align="center" prop="squadronName" />
        <el-table-column label="所属部门" align="center" prop="deptName" />
        <el-table-column label="联系电话" align="center" prop="telephone" />
        <el-table-column label="地址" align="center" prop="address" />
        <el-table-column label="负责人" align="center" prop="head" />
        <el-table-column label="备注" align="center" prop="remark" />
        <!-- <el-table-column label="状态：0正常" align="center" prop="status" /> -->
        <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:squadron:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:squadron:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>


    <!-- 添加或修改保安中队管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="600px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="中队名称" prop="squadronName">
          <el-input v-model="form.squadronName" placeholder="请输入中队名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <search-select
            v-model="form.deptId"
            :listFn="listDeptFn"
            :backArr="backObj.dept"
            label="deptName"
            option="deptId"
            placeholder="请选择部门"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入中队联系电话" />
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
import { listSquadron, getSquadron, delSquadron, addSquadron, updateSquadron, Department } from "@/api/SecurityManagement/Squadron.js";
import searchSelect from '@/views/components/searchSelect.vue'

export default {
  name: "Squadron",
  components: { searchSelect },

  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 保安中队管理表格数据
      squadronList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        squadronName: null,
        deptId: null,
        telephone: null,
        address: null,
        head: null,
        status: null,
        sort: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        squadronName: [
          { required: true, message: "中队名称不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所属部门ID不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态：0正常不能为空", trigger: "change" }
        ],
      },
      options: [],
      // 选择器回显数据
      backObj: {
        dept: [],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安中队管理列表 */
    getList() {
      this.loading = true;
      listSquadron(this.queryParams).then(response => {
        this.squadronList = response.rows;
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
    reset() {
      this.form = {
        squadronId: null,
        squadronName: null,
        deptId: null,
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
    /** 新增按钮操作 */
    async handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加保安中队管理";
      const res = await Department()
      this.options = res.rows
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
        this.title = "修改保安中队管理"
        this.backObj.dept = [{ deptName: row.deptName, deptId: row.deptId }]
        this.form = { ...row }
        this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.squadronId != null) {
            updateSquadron(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSquadron(this.form).then(response => {
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
      const squadronIds = row.squadronId || this.ids;
      this.$modal.confirm('是否确认删除该中队？').then(function () {
        return delSquadron(squadronIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('affairs/squadron/export', {
        ...this.queryParams
      }, `保安中队表_${new Date().getTime()}.xlsx`)
    },
    async contractorbtn(v) {
      const res = await Department({ deptName: v })
      this.options = res.rows
    },
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await Department(queryParams)

      return { rows, total }
    },
  }
};
</script>
