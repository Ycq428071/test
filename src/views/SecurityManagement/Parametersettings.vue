<template>
  <div class="app-container">
    <div class="gl-body">
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" v-loading="loading" :data="sysParamList" height="calc(100vh - 244px)">
        <el-table-column label="参数名称" align="center" prop="paramName" show-overflow-tooltip />
        <el-table-column label="参数值" align="center" prop="paramValue" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作时间" align="center" prop="updateTime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="createBy" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:sysParam:edit']">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改保安参数设置管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="form.paramName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数值" prop="paramValue">
          <el-input-number
            class="ipt-number"
            placeholder="请输入参数值"
            v-model="form.paramValue"
            :controls="false"
          />
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
import { listSysParam, getSysParam, updateSysParam } from "@/api/SecurityManagement/Parametersettings.js";

export default {
  name: "Parametersettings",
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
      // 保安参数设置管理表格数据
      sysParamList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        paramName: [
          { required: true, message: "参数名称不能为空", trigger: "blur" }
        ],
        paramValue: [
          { required: true, message: "参数值不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安参数设置管理列表 */
    getList() {
      this.loading = true;
      listSysParam(this.queryParams).then(response => {
        this.sysParamList = response.rows;
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
        paramId: null,
        paramName: null,
        paramValue: null,
        remark: null
      };
      this.resetForm("form");
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const paramId = row.paramId || this.ids
      getSysParam(paramId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改保安参数设置管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.paramId != null) {
            updateSysParam(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {

          }
        }
      });
    },
  }
};
</script>
