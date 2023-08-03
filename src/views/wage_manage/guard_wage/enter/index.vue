<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini" class="gl-search_form">
      <el-form-item label="保安姓名" prop="securityName">
        <el-input
          v-model="queryParams.securityName"
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
      <div style="height: 40px">
        保安表
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="info"
              icon="el-icon-upload2"
              @click="handleImport"
              v-hasPermi="['salary:employee:importData']"
            >导入工资</el-button>
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
        :data="staffList"
        highlight-current-row
        @current-change="listSalaryFn"
      >
        <!-- @cell-dblclick="(row) => { $refs.logDialog.openFn({ securityId: row.securityId }) }" -->
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="400" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" show-overflow-tooltip />
        <el-table-column label="银行账号" align="center" prop="account" show-overflow-tooltip />
        <el-table-column label="试用开始日期" align="center" prop="trialStartDate" show-overflow-tooltip />
        <el-table-column label="登记日期" align="center" prop="reportDate" show-overflow-tooltip />
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div v-show="total<=0" style="height: 50px"></div>
      <div style="height: 40px; margin-top: 20px">
        保安工资表
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              v-hasPermi="['salary:employee:add']"
              @click="$router.push('/wage_manage/guard_wage/wg_enter-add/index/' + queryParamsSecu.securityId + '/0')"
            >
              新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-download"
              @click="handleExport"
              v-hasPermi="['salary:employee:exportSalaryDetailByEmpId']"
            >
              导出
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        ref="salaryTable"
        border
        @header-dragend="$nextTick(() => { $refs.salaryTable.doLayout() })"
        size="mini"
        height="calc(100vh - 244px - 467px)"
        v-loading="salaryLoading"
        :data="salaryList"
        :row-class-name="({ row }) =>
          tableRowClassName([{ flag: row.checkBy === 0, className: 'uncheck_row' }])"
      >
        <!-- @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }" -->
        <el-table-column label="工资年月" align="center" prop="payday" show-overflow-tooltip />
        <el-table-column label="姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="银行账号" align="center" prop="account" width="150" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" width="150" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="400" show-overflow-tooltip />
        <el-table-column label="基本工资" align="center" prop="baseSalary" show-overflow-tooltip />
        <el-table-column label="出勤费用" align="center" prop="" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.attendanceDays * scope.row.attendanceStandard }}
          </template>
        </el-table-column>
        <el-table-column label="超时补贴" align="center" prop="overtimeAllowance" show-overflow-tooltip />
        <el-table-column label="餐费" align="center" prop="mealAllowance" show-overflow-tooltip />
        <el-table-column label="考核工资" align="center" prop="probationSalary" show-overflow-tooltip />
        <el-table-column label="岗位补贴" align="center" prop="situationAllowance" show-overflow-tooltip />
        <el-table-column label="补足工资" align="center" prop="repaySalary" show-overflow-tooltip />
        <el-table-column label="缺员加班" align="center" prop="shorthandedOvertime" show-overflow-tooltip />
        <el-table-column label="工龄工资" align="center" prop="seniorityPay" show-overflow-tooltip />
        <el-table-column label="职务工资" align="center" prop="jobSalary" show-overflow-tooltip />
        <el-table-column label="服装津贴" align="center" prop="clothesAllowance" show-overflow-tooltip />
        <el-table-column label="加班费用" align="center" prop="overtimePay" show-overflow-tooltip />
        <el-table-column label="节日费用" align="center" prop="holidayFee" show-overflow-tooltip />
        <el-table-column label="低保补贴" align="center" prop="subsistenceAllowance" show-overflow-tooltip />
        <el-table-column label="其他1" align="center" prop="otherAllowance1" show-overflow-tooltip />
        <el-table-column label="其他2" align="center" prop="otherAllowance2" show-overflow-tooltip />
        <el-table-column label="应发工资" align="center" prop="shouldSalary" show-overflow-tooltip />
        <el-table-column label="请假扣划" align="center" prop="offWorkDeduct" show-overflow-tooltip />
        <el-table-column label="养老金" align="center" prop="pension" show-overflow-tooltip />
        <el-table-column label="医保" align="center" prop="medicalInsurance" show-overflow-tooltip />
        <el-table-column label="失业" align="center" prop="unemploymentInsurance" show-overflow-tooltip />
        <el-table-column label="公积金（原大病）" align="center" prop="seriousIllness" width="130" show-overflow-tooltip />
        <el-table-column label="意外险" align="center" prop="accidentInsurance1" show-overflow-tooltip />
        <el-table-column label="意外险2" align="center" prop="accidentInsurance2" show-overflow-tooltip />
        <el-table-column label="违纪工资" align="center" prop="breachPrinciple" show-overflow-tooltip />
        <el-table-column label="不上班扣款" align="center" prop="absenteeism" width="90" show-overflow-tooltip />
        <el-table-column label="其他扣款1" width="90" align="center" prop="otherDeduct1" show-overflow-tooltip />
        <el-table-column label="其他扣款2" width="90" align="center" prop="otherDeduct2" show-overflow-tooltip />
        <el-table-column label="保险补扣" align="center" prop="insuranceDeduct" show-overflow-tooltip />
        <el-table-column label="个税" align="center" prop="incomeTax" show-overflow-tooltip />
        <el-table-column label="实发工资" align="center" prop="actualSalary" show-overflow-tooltip />
        <el-table-column label="卡工资" align="center" prop="cardSalary" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="制表日期" align="center" prop="createDate" width="90" show-overflow-tooltip />
        <el-table-column label="制表人" align="center" prop="createUserName" show-overflow-tooltip />
        <el-table-column label="复核日期" align="center" prop="checkDate" width="90" show-overflow-tooltip />
        <el-table-column label="复核人" align="center" prop="checkUserName" show-overflow-tooltip />

        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['salary:employee:edit']"
              @click="$router.push('/wage_manage/guard_wage/wg_enter-add/index/' + queryParamsSecu.securityId + '/' + scope.row.id + '?row=' + JSON.stringify(scope.row))"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['salary:employee:remove']"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['salary:employee:add']"
              @click="$router.push('/wage_manage/guard_wage/wg_enter-add/index/' + queryParamsSecu.securityId + '/0' + '?row=' + JSON.stringify(scope.row))"
            >
              工资复制
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="salaryTotal>0"
        :total="salaryTotal"
        :page.sync="queryParamsSecu.pageNum"
        :limit.sync="queryParamsSecu.pageSize"
        @pagination="listSalaryFn"
      />
      <div v-show="salaryTotal<=0" style="height: 50px"></div>
    </div>

    <!-- 变更记录弹窗 -->
    <!-- <log-dialog
      ref="logDialog"
      title="保安变更浏览"
      height="calc(100vh - 370px)"
      :columns="staffLogColumns"
      :listFn="logFn"
    /> -->

    <!-- 详情弹窗 -->
    <!-- <detail-dialog
      ref="detail"
      title="保安工资详情"
      width="1560px"
      label-width="106px"
      span="4.5"
      :config="enterConfig"
      :detail="detail"
    /> -->

    <!-- 保安工资导入对话框 -->
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
import { staffLog, staffLogColumns } from "@/api/wage_manage/log"
import { listPost } from "@/api/wage_manage/guard_manage"
import { listDept, listHead } from "@/api/wage_manage/query"
import { listStream, delSalary, enterConfig } from "@/api/wage_manage/guard_wage";
import { tableRowClassName } from '@/utils/table'
import { getToken } from "@/utils/auth"
import searchSelect from '@/views/components/searchSelect.vue'
import DetailDialog from '@/views/components/detailDialog.vue'
import logDialog from '@/views/components/logDialog.vue'

export default {
  name: "Wg_enter",
  dicts: [
    'query_guard_state',
  ],
  components: { searchSelect, logDialog, DetailDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 保安人员管理表格数据
      staffList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        'securityName': null,
        'deptId': null,
        'positionId': null,
        'status': 0,
      },
      // 变更记录
      staffLogColumns,
      // 工资
      salaryList: [],
      salaryTotal: 0,
      salaryLoading: false,
      detail: {},
      enterConfig,
      // 查询参数
      queryParamsSecu: {
        pageNum: 1,
        pageSize: 10,
        'securityId': null,
      },

      // 保安工资导入参数
      upload: {
        // 是否显示弹出层（保安工资导入）
        open: false,
        // 弹出层标题（保安工资导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/salary/employee/importData"
      },
    };
  },
  watch: {
    $route(route) {
      if(route.name === 'Wg_enter') {
        this.getList()
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 表格单行 className 设置方法
    tableRowClassName,
    /** 查询保安人员管理列表 */
    getList() {
      this.loading = true;
      listHead(this.queryParams).then(response => {
        this.staffList = response.rows;
        this.total = response.total;
        this.loading = false;

        this.$nextTick(() => {
          this.$refs.table.doLayout()
          // 选中驻点合同，请求合同费用记录
          const securityId = this.queryParamsSecu.securityId || response.rows[0]?.securityId
          const currentRow = this.staffList.find(item => item.securityId === securityId)
          if(currentRow) this.$refs.table.setCurrentRow(currentRow)
        })
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParamsSecu.securityId = null
      this.salaryList = []
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
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

    // 查看保安变更记录
    async logFn(queryParams) {
      const { rows, total } = await staffLog(queryParams)

      return { rows, total }
    },

    // 查询工资列表
    listSalaryFn(row) {
      if(!row) return
      this.queryParamsSecu.securityId = row.securityId
      this.salaryLoading = true;
      listStream(row.securityId, this.queryParamsSecu).then(response => {
        this.salaryList = response.rows;
        this.salaryTotal = response.total;
        this.salaryLoading = false;
      });
    },
    /** 删除工资按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该保安工资？').then(function() {
        return delSalary(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出工资按钮操作 */
    handleExport() {
      this.download('/salary/employee/exportSalaryDetailByEmpId?empId=' + this.queryParamsSecu.securityId, {
      }, `保安工资表_${new Date().getTime()}.xlsx`)
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "保安工资导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/salary/employee/exportTemplate', {
      }, `保安工资导入模板_${new Date().getTime()}.xlsx`)
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
