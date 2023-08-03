<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" class="gl-search_form">
      <el-form-item label="保安姓名" prop="securityId">
        <search-select v-model="queryParams.securityId" :listFn="listStaffFn"
          label="securityName" option="securityId" placeholder="请选择保安"
          filterable clearable />
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
            v-hasPermi="['affairs:clothingFee:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            @click="handleImport"
            v-hasPermi="['affairs:clothingFee:import']"
          >导入</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="tableList"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="服装日期" align="center" prop="feeDate" show-overflow-tooltip />
        <el-table-column label="服装费用" align="center" prop="clothingCost" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />

        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['affairs:clothingFee:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['affairs:clothingFee:remove']"
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
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

    <!-- 新增或修改对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="保安姓名" prop="securityId">
          <search-select v-model="form.securityId" :listFn="listStaffFn"
            :backArr="backObj.staf" label="securityName" option="securityId" placeholder="请选择保安"
            filterable />
        </el-form-item>
        <el-form-item label="费用日期" prop="feeDate">
          <el-date-picker :clearable="false" v-model="form.feeDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择日期" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="服装费用" prop="clothingCost">
          <el-input-number
            class="ipt-number"
            placeholder="请输入服装费用"
            v-model="form['clothingCost']"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form['remark']" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 服装费用信息导入对话框 -->
    <el-dialog v-dialogDrag :title="upload.title" :visible.sync="upload.open" width="400px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listClothingFee, delClothingFee, addClothingFee, updateClothingFee } from "@/api/SecurityManagement/Securityclothing.js";
import { listStaff } from "@/api/SecurityManagement/Security.js";
import { getToken } from "@/utils/auth"
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Cloth_cost_info',
  components: { searchSelect },
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
        'securityId': null,
      },
      // 表单参数
      form: {},
      // 回显
      backObj: {
        staf: []
      },
      // 表单校验
      rules: {
        'securityId': [
          { required: true, message: '保安姓名不能为空', trigger: 'change' }
        ],
        'clothingCost': [
          { required: true, message: '服装费用不能为空', trigger: 'blur' }
        ],
      },

      // 服装费用信息导入参数
      upload: {
        // 是否显示弹出层（服装费用信息导入）
        open: false,
        // 弹出层标题（服装费用信息导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/clothingFee/importData"
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listClothingFee(this.queryParams).then(response => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 查询人员方法
    async listStaffFn(queryParams) {
      const { rows, total } = await listStaff({
        ...queryParams,
      })

      return { rows, total }
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        'feeId': null,
        'securityId': null,
        'feeDate': dayjs().format('YYYY-MM-DD'),
        'clothingCost': null,
        'remark': null,
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增服装费用信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.backObj.staf = [{ securityName: row.securityName, securityId: row.securityId }]
      this.form = { ...row }
      this.open = true
      this.title = '修改服装费用信息'
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form['feeId'] != null) {
            updateClothingFee(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addClothingFee(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除该服装费用信息？').then(function() {
        return delClothingFee(row.feeId)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "服装费用信息导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/clothingFee/export', {
      }, `服装费用信息导入模板_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
  }
}
</script>
