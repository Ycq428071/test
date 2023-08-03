<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="薪水年月" prop="salaryYear">
        <el-date-picker
          v-model="queryParams['salaryYear']"
          type="month"
          placeholder="请选择月份"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="姓名" prop="staffName">
        <el-input
          v-model="queryParams['staffName']"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="证件号码" prop="identificationNumber">
        <el-input
          v-model="queryParams['identificationNumber']"
          placeholder="请输入证件号码"
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
            type="danger"
            icon="el-icon-delete"
            @click="open = true"
            v-hasPermi="['affairs:insureExport:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            @click="handleImport"
            v-hasPermi="['affairs:insureExport:import']"
          >导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['affairs:insureExport:export']"
          >导出</el-button>
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
        <el-table-column label="薪水年月" align="center" prop="salaryYear" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="identificationNumber" show-overflow-tooltip />
        <el-table-column label="姓名" align="center" prop="staffName" show-overflow-tooltip />
        <el-table-column label="公积金基数" align="center" prop="providentFundBase" show-overflow-tooltip />
        <el-table-column label="养老保险基数" align="center" prop="pensionInsuranceBase" show-overflow-tooltip />
        <el-table-column label="意外保险" align="center" prop="accidentInsurance" show-overflow-tooltip />
        <el-table-column label="医疗保险基数" align="center" prop="medicalInsuranceBase" show-overflow-tooltip />
        <el-table-column label="个税" align="center" prop="personalIncomeTax" show-overflow-tooltip />
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

    <!-- 保安保险导入对话框 -->
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

    <!-- 删除保安保险对话框 -->
    <el-dialog v-dialogDrag title="删除保安保险" :visible.sync="open" width="500px" :modal-append-to-body="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="薪水年月" prop="salaryYear">
          <el-date-picker
            v-model="form['salaryYear']"
            type="month"
            placeholder="请选择月份"
            value-format="yyyy-MM"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDelete">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGuardInsure, delGuardInsure } from "@/api/wage_manage/params_setting"
import { getToken } from "@/utils/auth"
import dayjs from 'dayjs'

export default {
  name: 'Guard_insure_import',
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
      form: {
        salaryYear: null,
      },
      // 表单校验
      rules: {
        'salaryYear': [
          { required: true, message: '请选择薪水年月', trigger: 'change' }
        ],
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        'salaryYear': dayjs().subtract(1, 'month').format('YYYY-MM'),
        'staffName': null,
        'identificationNumber': null,
      },

      // 保安保险导入参数
      upload: {
        // 是否显示弹出层（保安保险导入）
        open: false,
        // 弹出层标题（保安保险导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/insureExport/importData"
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
      listGuardInsure(this.queryParams).then(response => {
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
      this.resetForm("queryForm")
      this.handleQuery()
    },

    /** 删除按钮操作 */
    handleDelete() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$modal.confirm('是否确认删除薪水年月为"' + this.form.salaryYear + '"的保安保险？')
          .then(() => {
            return delGuardInsure(this.form.salaryYear)
          }).then(() => {
              this.getList()
              this.$modal.msgSuccess("删除成功")
              this.open = false
              this.form.salaryYear = null
              this.resetForm('form')
          }).catch(() => {})
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(let k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/insureExport/export', {
        ...exportParams
      }, `保安保险表__${new Date().getTime()}.xlsx`)
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "保安保险导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/insureExport/export', {
        isTemplate: true
      }, `保安保险导入模板_${new Date().getTime()}.xlsx`)
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
    }
  }
}
</script>
