<template>
  <div class="app-container">
    <el-form size="mini" :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="驻点名称" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="请输入驻点名称"
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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams['status']">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in dict.type['status']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="gl-body">
      <div style="height: 40px;">
        驻点表
        <el-row :gutter="10" class="mb8">
          <!-- <el-col :span="1.5">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-download"
              @click="handleExport"
              v-hasPermi="['']"
            >导出</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="info"
              icon="el-icon-upload2"
              @click="handleImport"
              v-hasPermi="['affairs:position:import']"
            >导入岗位</el-button>
          </el-col>
        </el-row>
      </div>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        size="mini"
        height="220px"
        v-loading="loading"
        :data="tableList"
        highlight-current-row
        @current-change="listPostFn"
      >
        <el-table-column label="驻点名称" align="center" prop="groupName" width="250" show-overflow-tooltip />
        <el-table-column label="签订合同" align="center" prop="contractName" width="250" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="100" show-overflow-tooltip />
        <el-table-column label="驻点人数" align="center" prop="groupNum" show-overflow-tooltip />
        <el-table-column label="合同人数" align="center" prop="contractPeople" show-overflow-tooltip />
        <el-table-column label="不相等人数" align="center" prop="unequalNumber" width="100" show-overflow-tooltip />
        <el-table-column label="负责人" align="center" prop="headName" show-overflow-tooltip />
        <el-table-column label="状态" align="center" prop="status" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['status']" :value="scope.row['status']" />
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

      <div style="height: 40px; margin-top: 20px;">
        <el-form size="mini" :model="queryParamsPost" ref="queryFormMore" :inline="true" style="display: inline-block;">
          <el-form-item>
            <div style="font-size: 16px">
              岗位表
            </div>
          </el-form-item>
          <el-form-item label="状态" prop="positionStatus" style="margin-bottom: 0">
            <el-select v-model="queryParamsPost['positionStatus']" @change="listPostFn(currentRow)">
              <el-option label="全部" :value="null" />
              <el-option
                v-for="item in dict.type['query_post_type']"
                :key="item.value"
                :label="item.label"
                :value="+item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8" style="margin-bottom: unset">
          <el-col :span="1.5">
            <el-button
              v-if="currentRow && (currentRow.unequalNumber !== 0)"
              v-hasPermi="['affairs:position:add']"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
        </el-row>
      </div>

      <el-table
        ref="logTable"
        size="mini"
        height="calc(100vh - 244px - 417px)"
        border
        @header-dragend="$nextTick(() => { $refs.logTable.doLayout() })"
        v-loading="postLoading"
        :data="postTable"
      >
        <el-table-column label="岗位名称" prop="positionName" align="center" width="250" show-overflow-tooltip />
        <el-table-column label="岗位人数" prop="positionNumber" align="center" show-overflow-tooltip />
        <el-table-column label="实际人数" prop="actualPeople" align="center" show-overflow-tooltip />
        <el-table-column label="客户类型" prop="customerType" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_client_type']" :value="scope.row['customerType']" />
          </template>
        </el-table-column>
        <el-table-column label="工作性质" prop="jobNature" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_work_nature']" :value="scope.row['jobNature']" />
          </template>
        </el-table-column>
        <el-table-column label="基本工资" prop="basicSalary" align="center" show-overflow-tooltip />
        <el-table-column label="餐费" prop="mealExpenses" align="center" show-overflow-tooltip />
        <el-table-column label="缺员加班" prop="shorthandedOvertime" align="center" show-overflow-tooltip />
        <el-table-column label="超时补贴" prop="overtimeAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="岗位补贴" prop="jobSubsidies" align="center" show-overflow-tooltip />
        <el-table-column label="考核工资" prop="assessmentSalary" align="center" show-overflow-tooltip />
        <el-table-column label="补足工资" prop="repaySalary" align="center" show-overflow-tooltip />
        <el-table-column label="固定发放" prop="" align="center" show-overflow-tooltip>
          <template slot-scope="{ row: { basicSalary, mealExpenses, shorthandedOvertime,
          overtimeAllowance, jobSubsidies, assessmentSalary, repaySalary } }">
            {{ basicSalary + mealExpenses + shorthandedOvertime +
            overtimeAllowance + jobSubsidies + assessmentSalary + repaySalary }}
          </template>
        </el-table-column>
        <el-table-column label="节假标准" prop="holidayStandards" align="center" show-overflow-tooltip />
        <el-table-column label="加班工资" prop="overtimeWages" align="center" show-overflow-tooltip />
        <el-table-column label="高温费" prop="highTemperatureFee" align="center" show-overflow-tooltip />
        <el-table-column label="工龄标准" prop="seniorityPayStandard" align="center" show-overflow-tooltip />
        <el-table-column label="状态" prop="positionStatus" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_post_type']" :value="scope.row['positionStatus']" />
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip />

        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <!--  && scope.row.reviewedStatus !== 1 -->
            <el-button
              v-if="scope.row.positionStatus !== 1"
              v-hasPermi="['affairs:position:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['affairs:position:remove']"
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              v-if="scope.row.positionStatus !== 1"
              v-hasPermi="['affairs:position:logOffGroupPosition']"
              size="mini"
              type="text"
              @click="handleLogout(scope.row)"
            >注销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增或修改岗位 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="800px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="span">
            <el-form-item label="岗位名称" prop="positionName">
              <el-input v-model="form['positionName']" placeholder="请输入岗位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="岗位人数" prop="positionNumber">
              <el-input-number
                class="ipt-number"
                placeholder="请输入岗位人数"
                v-model="form['positionNumber']"
                :controls="false"
                :precision="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="客户类型" prop="customerType">
              <el-select v-model="form['customerType']" placeholder="请选择客户类型" style="width: 100%">
                <el-option
                  v-for="item in dict.type['query_client_type']"
                  :key="item.value"
                  :label="item.label"
                  :value="+item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="工作性质" prop="jobNature">
              <el-select v-model="form['jobNature']" placeholder="请选择客户类型" style="width: 100%">
                <el-option
                  v-for="item in dict.type['query_work_nature']"
                  :key="item.value"
                  :label="item.label"
                  :value="+item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="基本工资" prop="basicSalary">
              <el-input-number
                class="ipt-number"
                placeholder="请输入基本工资"
                v-model="form['basicSalary']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="节假标准" prop="holidayStandards">
              <el-input-number
                class="ipt-number"
                placeholder="请输入节假标准"
                v-model="form['holidayStandards']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="加班工资" prop="overtimeWages">
              <el-input-number
                class="ipt-number"
                placeholder="请输入加班工资"
                v-model="form['overtimeWages']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="高温费" prop="highTemperatureFee">
              <el-input-number
                class="ipt-number"
                placeholder="请输入高温费"
                v-model="form['highTemperatureFee']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="工龄标准" prop="seniorityPayStandard">
              <el-input-number
                class="ipt-number"
                placeholder="请输入工龄标准"
                v-model="form['seniorityPayStandard']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form['remark']" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 岗位导入对话框 -->
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
import { listDept } from "@/api/wage_manage/query"
import { listUnit, listPost, addPost, updatePost, delPost, logoutPost } from '@/api/wage_manage/guard_manage'
import { getToken } from "@/utils/auth"
import searchSelect from '@/views/components/searchSelect.vue'

export default {
  name: "Guard_point_define",
  dicts: [
    'status',
    'query_client_type',
    'query_offer_house',
    'query_work_nature',
    'query_manage_nature',
    'query_post_type',
  ],
  components: { searchSelect },
  data() {
    return {
      // 列表
      loading: false,
      total: 0,
      tableList: [],
      largeList: [],
      // 查询参数
      queryParams: {
        groupName: null,
        'status': 0,
        'deptId': null,
      },
      // 岗位
      postLoading: false,
      postTable: [],
      currentRow: {},
      queryParamsPost: {
        'groupId': null,
        'positionStatus': 0,
      },
      // 弹出框
      span: 12,
      title: '',
      open: false,
      // 表单
      form: {},
      rules: {
        'positionName': [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' },
        ],
        'positionNumber': [
          { required: true, message: '岗位人数不能为空', trigger: 'blur' },
        ],
      },

      // 岗位导入参数
      upload: {
        // 是否显示弹出层（岗位导入）
        open: false,
        // 弹出层标题（岗位导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/position/importData"
      },
    };
  },
  watch: {
    $route(route) {
      if(route.name === 'Guard_point_define') this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询保安人员管理列表 */
    getList() {
      this.loading = true
      listUnit(this.queryParams).then(response => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false

        this.$nextTick(() => {
          this.$refs.table.doLayout()
          // 重新请求已选中驻点下的岗位，初次选中第一个驻点
          const groupId = this.queryParamsPost.groupId || response.rows[0]?.groupId
          this.currentRow = this.tableList.find(item => item.groupId === groupId)
          if(this.currentRow) this.$refs.table.setCurrentRow(this.currentRow)
        })
      })
    },
    // 获取岗位列表
    listPostFn(row) {
      if(row?.groupId) {
        this.currentRow = row
        this.queryParamsPost.groupId = row.groupId
        this.postLoading = true
        listPost(this.queryParamsPost).then(res => {
          this.postTable = res.rows
          this.postLoading = false
        })
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParamsPost.groupId = null
      this.postTable = []
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.resetForm('queryFormMore')
      this.handleQuery()
    },
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

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
        'groupId': this.queryParamsPost.groupId,
        'groupPositionId': null,
        'positionName': null,
        'positionNumber': null,
        'customerType': 1,
        'jobNature': 1,
        'basicSalary': null,
        'holidayStandards': null,
        'overtimeWages': null,
        'seniorityPayStandard': 15,
        'highTemperatureFee': 150,
        'remark': null,
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.form.positionName = this.currentRow.groupName + '（）'
      this.form.positionNumber = this.currentRow.unequalNumber
      this.title = '添加岗位'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = { ...row }
      this.title = '修改岗位'
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form['groupPositionId'] != null) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPost(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除该驻点？').then(function() {
        return delPost(row.groupPositionId)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    // 注销按钮操作
    handleLogout(row) {
      this.$modal.confirm('是否确认注销该岗位？').then(function() {
        return logoutPost({ groupPositionId: row.groupPositionId })
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("注销成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/affairs/unit/exportQueryGroupList', {
        ...this.queryParams
      }, `保安驻点表_${new Date().getTime()}.xlsx`)
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "岗位导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/position/exportTemplate', {
      }, `岗位导入模板_${new Date().getTime()}.xlsx`)
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
};
</script>
