<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" class="gl-search_form" @submit.native.prevent>
      <el-form-item label="所属大队" prop="deptId">
        <search-select v-model="queryParams.deptId" :listFn="listDeptFn"
          label="deptName" option="deptId" placeholder="请选择大队" />
      </el-form-item>
      <el-form-item label="单位负责人" prop="headName">
        <el-input
          v-model="queryParams.headName"
          placeholder="请输入单位负责人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            v-hasPermi="['affairs:leader:add']"
          >新增</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        v-loading="loading"
        :data="leaderList"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column label="单位负责人" align="center" prop="headName" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:leader:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:leader:edit']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改单位负责人对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属大队" prop="deptId">
          <search-select v-model="form.deptId" :listFn="listDeptFn" :backArr="backObj.dept"
            label="deptName" option="deptId" placeholder="请选择大队" />
        </el-form-item>
        <el-form-item label="单位负责人" prop="headName">
          <el-input v-model="form.headName" placeholder="请输入单位负责人" />
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
import { listLeader, addLeader, updateLeader } from "@/api/Stationary/head"
import { listDept } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'

export default {
  name: "Leader",
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
      // 单位负责人表格数据
      leaderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        headName: null,
      },
      // 表单参数
      form: {},
      // 选择器回显数据
      backObj: {
        dept: [],
      },
      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "所属大队不能为空", trigger: "blur" }
        ],
        headName: [
          { required: true, message: "单位负责人不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单位负责人列表 */
    getList() {
      this.loading = true;
      listLeader(this.queryParams).then(response => {
        this.leaderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 查询大队方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        staffHeadId: null,
        deptId: null,
        headName: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加单位负责人";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.backObj.dept = [{ deptName: row.deptName, deptId: row.deptId }]
      this.form = { ...row }
      this.title = "修改单位负责人";
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.staffHeadId != null) {
            updateLeader(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeader(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除该单位负责人？').then(function() {
        return updateLeader({ staffHeadId: row.staffHeadId, isFile: 1 });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
  }
};
</script>
