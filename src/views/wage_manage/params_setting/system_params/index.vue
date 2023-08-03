<template>
  <div class="app-container">
    <div class="gl-body">
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="tableList"
        height="calc(100vh - 244px)"
      >
        <el-table-column label="参数名称" align="center" prop="paramName" show-overflow-tooltip />
        <el-table-column label="参数值" align="center" prop="paramValue" show-overflow-tooltip />
        <el-table-column label="操作日期" align="center" prop="updateTime" show-overflow-tooltip />
        <el-table-column label="操作人" align="center" prop="createBy" show-overflow-tooltip />

        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:sysParam:edit']"
            >修改</el-button>
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
      <div v-show="total<=0" style="height: 50px"></div>
    </div>

    <!-- 添加或修改保安人员管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="form['paramName']" readonly />
        </el-form-item>
        <el-form-item label="参数值" prop="paramValue">
          <el-input-number
            class="ipt-number"
            placeholder="请输入参数值"
            v-model="form['paramValue']"
            :controls="false"
          />
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
import { listSysParams, updateSysParams } from "@/api/wage_manage/params_setting"

export default {
  name: 'System_params',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        paramType: 1,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        'paramValue': [
          { required: true, message: "参数值不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listSysParams(this.queryParams).then(response => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        'paramId': null,
        'paramName': null,
        'paramValue': null,
      }
      this.resetForm("form")
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      for(let k in this.form) {
        this.form[k] = row[k]
      }
      this.open = true
      this.title = "修改参数"
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form['paramId'] != null) {
            const { paramId, paramValue } = this.form
            updateSysParams({ paramId, paramValue }).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
  }
}
</script>
