<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" class="gl-search_form" @submit.native.prevent>
      <!-- <el-form-item label="保安姓名" prop="securityId">
        <search-select
          v-model="queryParams.securityId"
          :listFn="listHeadFn"
          label="securityName"
          option="securityId"
          placeholder="请选择保安"
          filterable
        />
      </el-form-item> -->
      <el-form-item label="保安姓名" prop="securityName">
        <el-input
          v-model="queryParams['securityName']"
          placeholder="请输入保安姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select
          v-model="queryParams.deptId"
          :listFn="listDeptFn"
          label="deptName"
          option="deptId"
          placeholder="请选择所属大队"
          clearable
        />
      </el-form-item>
      <el-form-item label="所属岗位" prop="positionId">
        <search-select
          v-model="queryParams.positionId"
          :listFn="listPostFn"
          label="positionName"
          option="groupPositionId"
          placeholder="请选择岗位"
          filterable
          remote
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams['status']">
          <el-option
            v-for="item in dict.type['query_guard_state'].filter(item => item.value !== '2')"
            :key="item.value"
            :label="item.label"
            :value="+item.value">
          </el-option>
        </el-select>
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
            v-hasPermi="['affairs:insure:add']"
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
            v-hasPermi="['affairs:insure:importData']"
          >导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['affairs:insure:export']"
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
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
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column label="保险号" align="center" prop="insuranceNumber" show-overflow-tooltip />
        <el-table-column label="单位名称" align="center" prop="unitName" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_unit_name']" :value="scope.row['unitName']" />
          </template>
        </el-table-column>
        <el-table-column label="社会保障号" align="center" prop="socialSecurityNumber" show-overflow-tooltip />
        <el-table-column label="参保起始年月" align="center" prop="insureStartTime" show-overflow-tooltip />
        <el-table-column label="缴费基数" align="center" prop="monthlyBase" show-overflow-tooltip />
        <el-table-column label="医保起始年月" align="center" prop="medicalInsuranceStartDate" show-overflow-tooltip />
        <el-table-column label="操作员" align="center" prop="createBy" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />

        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['affairs:insure:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['affairs:insure:remove']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="保安名称" prop="securityId">
          <search-select
            v-model="form.securityId"
            :listFn="listHeadFn"
            :backArr="backObj.head"
            :disabled="form.insureId !== null"
            @change="changeFn"
            label="securityName"
            option="securityId"
            placeholder="请选择保安"
            filterable
          />
        </el-form-item>
        <el-form-item label="保险号" prop="insuranceNumber">
          <el-input v-model="form['insuranceNumber']" placeholder="请输入保险号" />
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-select v-model="form['unitName']" placeholder="请选择单位名称" style="width: 100%">
            <el-option
              v-for="item in dict.type['query_unit_name']"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="社会保障号" prop="socialSecurityNumber">
          <el-input v-model="form['socialSecurityNumber']" placeholder="请输入社会保障号" />
        </el-form-item>
        <el-form-item label="参保起始年月" prop="insureStartTime">
          <el-date-picker
            v-model="form['insureStartTime']"
            :clearable="false"
            type="month"
            placeholder="请选择月份"
            value-format="yyyy-MM"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="医保起始年月" prop="medicalInsuranceStartDate">
          <el-date-picker
            v-model="form['medicalInsuranceStartDate']"
            :clearable="false"
            type="month"
            placeholder="请选择月份"
            value-format="yyyy-MM"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="缴费基数" prop="monthlyBase">
          <el-input-number
            class="ipt-number"
            placeholder="请输入缴费基数"
            v-model="form['monthlyBase']"
            :controls="false"
            :precision="0"
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

    <!-- 保险导入对话框 -->
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
import { listDept, listHead } from '@/api/wage_manage/query'
import { listPost } from "@/api/wage_manage/guard_manage"
import { listInsure, addInsure, updateInsure, delInsure, getInsureInfo, changeHistory } from '@/api/SecurityManagement/insure'
import { getToken } from "@/utils/auth"
import searchSelect from '@/views/components/searchSelect.vue';
import dayjs from 'dayjs';

export default {
  name: 'Insure',
  components: { searchSelect },
  dicts: [
    'endowmentinsurance',
    'query_unit_name',
    'query_guard_state',
  ],
  data() {
    return {
      // 遮罩层
      loading: true,
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
        'securityName': null,
        'deptId': null,
        'positionId': null,
        'status': 0
      },
      // 表单参数
      form: {},
      // 选择器回显数据
      backObj: {
        head: [],
      },
      // 表单校验
      rules: {
        'securityId': [
          { required: true, message: '保安名称不能为空', trigger: 'blur' },
        ],
      },

      // 保险导入参数
      upload: {
        // 是否显示弹出层（保险导入）
        open: false,
        // 弹出层标题（保险导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/insure/importData"
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询保安方法
    async listHeadFn(queryParams) {
      const { rows, total } = await listHead({
        ...queryParams,
        status: 0,
        endowmentInsurance: 1
      })

      return { rows, total }
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      listInsure(this.queryParams).then(response => {
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
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询岗位方法
    async listPostFn(queryParams) {
      const { rows, total } = await listPost({
        ...queryParams,
        positionStatus: 0
      })

      return { rows, total }
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    async reset() {
      this.form = {
        'insureId': null,
        'securityId': null,
        'unitName': '0',
        'socialSecurityNumber': null,
        'insureStartTime': null,
        'medicalInsuranceStartDate': null,
        'insuranceNumber': null,
        'monthlyBase': null,
        'remark': null,
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    async handleAdd() {
      this.reset()
      const { monthlyBase } = await getInsureInfo()
      this.form.monthlyBase = monthlyBase
      this.title = '添加保安保险'
      this.open = true
    },
    async changeFn(row) {
      this.form.socialSecurityNumber = row.certificateNumber
      this.form.insureStartTime = dayjs(row.trialEndDate).add(1, 'month').format('YYYY-MM')
      this.form.medicalInsuranceStartDate = dayjs(row.trialEndDate).add(1, 'month').format('YYYY-MM')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.backObj.head = [{ securityName: row.securityName, securityId: row.securityId }]
      this.form = { ...row }
      this.title = '修改保安保险'
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form['insureId'] != null) {
            updateInsure(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addInsure(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除该保安保险？').then(function() {
        return delInsure(row.insureId)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/insure/export', {
        ...exportParams
      }, `保安保险表_${new Date().getTime()}.xlsx`)
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "保险导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/insure/exportTemplate', {
      }, `保险导入模板_${new Date().getTime()}.xlsx`)
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
