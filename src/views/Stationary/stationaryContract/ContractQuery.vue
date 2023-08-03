<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true" @submit.native.prevent>
      <el-form-item label="合同名称" prop="contractName">
        <el-input v-model="queryParams.contractName" placeholder="请输入合同名称"></el-input>
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select v-model="queryParams.deptId" :listFn="listDeptFn"
          label="deptName" option="deptId" placeholder="请选择大队" />
      </el-form-item>
      <el-form-item label="合同状态" prop="contractState">
        <el-select v-model="queryParams.contractState" placeholder="请选择合同状态" :style="{ width: '100%' }">
          <el-option label="全部" :value="null" />
          <el-option v-for="dict in dict.type.contractstate" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
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
            type="primary"
            icon="el-icon-plus"
            @click="$router.push('/stationaryContract/ContractQuery-add/index/0/0')"
            v-hasPermi="['affairs:contract:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            :disabled="multiple"
            @click="reviewbtn"
            v-hasPermi="['affairs:contract:checkContracts']"
          >复核</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            @click="handleImport"
            v-hasPermi="['affairs:contract:import']"
          >导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['affairs:contract:export']"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        height="calc(100vh - 244px - 106px - 56px)"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="contractList"
        @selection-change="handleSelectionChange"
        show-summary
        :summary-method="$event => getSummaries($event, [14, 22, 23, 24],'合计' ,1)"
        @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }"
      >
        <el-table-column type="selection" width="55" align="center" :selectable="row => row.contractState === 2" />
        <el-table-column label="合同名称" align="center" prop="contractName" width="250" fixed show-overflow-tooltip />
        <el-table-column label="合同编号" align="center" prop="contractNumber" width="175" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="签约人" align="center" prop="signatory" show-overflow-tooltip />
        <el-table-column label="负责人" align="center" prop="headName" show-overflow-tooltip />
        <el-table-column label="合同状态" align="center" prop="contractState" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['contractstate']" :value="scope.row['contractState']" />
          </template>
        </el-table-column>
        <el-table-column label="单位类别" align="center" prop="unitCategory" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['un']" :value="scope.row['unitCategory']" />
          </template>
        </el-table-column>
        <el-table-column label="合同上交" align="center" prop="contractSubmission" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['contractsubmission']" :value="scope.row['contractSubmission']" />
          </template>
        </el-table-column>
        <el-table-column label="缴费方式" align="center" prop="paymentMethod" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['paymentmethod']" :value="scope.row['paymentMethod']" />
          </template>
        </el-table-column>
        <el-table-column label="缴费周期" align="center" prop="paymentCycle" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['paymentcycle']" :value="scope.row['paymentCycle']" />
          </template>
        </el-table-column>
        <el-table-column label="签约日期" align="center" prop="signingDate" width="100" show-overflow-tooltip />
        <el-table-column label="生效日期" prop="effectiveDate" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="终止日期" prop="endDate" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="保安人数" prop="staffNumber" align="center" show-overflow-tooltip />
        <el-table-column label="保安费用" prop="staffCosts" align="center" show-overflow-tooltip />
        <el-table-column label="消控人数" prop="fireControlNum" align="center" show-overflow-tooltip />
        <el-table-column label="消控单价" prop="fireControlCosts" align="center" show-overflow-tooltip />
        <el-table-column label="餐费补贴" prop="mealAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="小队长补贴" prop="leaderAllowance" align="center" width="90" show-overflow-tooltip />
        <el-table-column label="超时补贴" prop="overTimeAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="其他费" prop="otherCost" align="center" show-overflow-tooltip />
        <el-table-column label="月费用" prop="mouthCost" align="center" width="110" show-overflow-tooltip />
        <el-table-column label="年人费用" prop="annualPeopleCost" align="center" width="110" show-overflow-tooltip />
        <el-table-column label="年总费用" prop="annualTotalCost" align="center" width="120" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="$router.push(
                '/stationaryContract/ContractQuery-add/index/1/' + scope.row.contractId
              )"
              v-hasPermi="['affairs:contract:add']"
            >续签</el-button>
            <el-button
              size="mini"
              type="text"
              @click="$router.push(
                '/stationaryContract/ContractQuery-add/index/2/' + scope.row.contractId
              )"
              v-hasPermi="['affairs:contract:edit']"
            >修改</el-button>
            <el-dropdown
              size="mini"
              v-hasPermi="[
                'affairs:contract:checkContracts',
                'affairs:contract:terminationContract',
                'affairs:contract:edit',
                'affairs:payment:list',
                'affairs:contract:noPagingList',
                'affairs:contractLog:list',
              ]"
            >
              <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="scope.row.contractState == 2"
                  v-hasPermi="['affairs:contract:checkContracts']"
                  @click.native="reviewbtn(scope.row)"
                >复核</el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['affairs:contract:terminationContract']"
                  @click.native="handleEnd(scope.row)"
                >终止</el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['affairs:contract:edit']"
                  @click.native="handleDelete(scope.row)"
                >删除</el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['affairs:payment:list']"
                  @click.native="$router.push(
                    '/Stationary/paymentstationarycontract/Entry/index/' + scope.row.renewalId
                  )"
                >收款信息</el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['affairs:contract:noPagingList']"
                  @click.native="$router.push(
                    '/Stationary/stationaryContract/ContractQuery-history/index/' + scope.row.renewalId
                  )"
                >续签历史</el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['affairs:contractLog:list']"
                  @click.native="changeHistory(scope.row)"
                >变更记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
                <!-- <el-dropdown-item
                  v-hasPermi="['']"
                  @click.native="$router.push(
                    '/Stationary/stationaryContract/unit?contractId=' + scope.row.contractId + '&contractName=' + scope.row.contractName
                  )"
                >驻点</el-dropdown-item> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />

      <!-- <div style="height: 48px; margin-top: 20px">
        合同费用记录表
        <el-row :gutter="10" class="mb8" v-if="contractId !== null">
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="$router.push(
                '/stationaryContract/ContractQuery-add/index/3/' + contractId
              )"
              v-hasPermi="['']"
            >新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        ref="logTable"
        size="mini"
        v-loading="logLoading"
        :data="logTable"
      >
        <el-table-column label="所属驻点" prop="groupName" align="center" width="250" />
        <el-table-column label="生效日期" prop="effectiveDate" align="center" />
        <el-table-column label="终止日期" prop="endDate" align="center" />
        <el-table-column label="保安人数" prop="staffNumber" align="center" />
        <el-table-column label="保安费用" prop="staffCosts" align="center" />
        <el-table-column label="消控人数" prop="fireControlNum" align="center" />
        <el-table-column label="消控单价" prop="fireControlCosts" align="center" />
        <el-table-column label="餐费补贴" prop="mealAllowance" align="center" />
        <el-table-column label="小队长补贴" prop="leaderAllowance" align="center" />
        <el-table-column label="超时补贴" prop="overTimeAllowance" align="center" />
        <el-table-column label="其他费" prop="otherCost" align="center" />
        <el-table-column label="月费用" prop="mouthCost" align="center" />
        <el-table-column label="年人费用" prop="annualPeopleCost" align="center" />
        <el-table-column label="年总费用" prop="annualTotalCost" align="center" />

        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['']"
              size="mini"
              type="text"
              @click="$router.push(
                '/stationaryContract/ContractQuery-add/index/4/' + scope.row.contractId +
                  '?contractCostLogId=' + scope.row.contractCostLogId
              )"
            >修改</el-button>
            <el-button
              v-hasPermi="['']"
              size="mini"
              type="text"
              @click="handleDeleteLog(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </div>

    <el-dialog v-dialogDrag title="变更记录" :visible.sync="dialogTableVisible" :modal-append-to-body="false" width="1400px">
      <el-table
        ref="changeTable"
        size="mini"
        border
        @header-dragend="$nextTick(() => { $refs.changeTable.doLayout() })"
        :data="gridData"
      >
        <el-table-column label="合同名称" align="center" prop="contractName" width="200" show-overflow-tooltip />
        <el-table-column label="合同编号" align="center" prop="contractNumber" width="150" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="签约人" align="center" prop="signatory" show-overflow-tooltip />
        <el-table-column label="负责人" align="center" prop="headName" show-overflow-tooltip />
        <el-table-column label="合同状态" align="center" prop="contractState" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['contractstate']" :value="scope.row['contractState']" />
          </template>
        </el-table-column>
        <el-table-column label="单位类别" align="center" prop="unitCategory" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['un']" :value="scope.row['unitCategory']" />
          </template>
        </el-table-column>
        <el-table-column label="合同上交" align="center" prop="contractSubmission" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['contractsubmission']" :value="scope.row['contractSubmission']" />
          </template>
        </el-table-column>
        <el-table-column label="缴费方式" align="center" prop="paymentMethod" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['paymentmethod']" :value="scope.row['paymentMethod']" />
          </template>
        </el-table-column>
        <el-table-column label="缴费周期" align="center" prop="paymentCycle" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['paymentcycle']" :value="scope.row['paymentCycle']" />
          </template>
        </el-table-column>
        <el-table-column label="签约日期" align="center" prop="signingDate" width="85" show-overflow-tooltip />
        <el-table-column label="生效日期" prop="effectiveDate" align="center" width="85" show-overflow-tooltip />
        <el-table-column label="终止日期" prop="endDate" align="center" width="85" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      </el-table>
      <pagination v-show="pagtotal > 0" :total="pagtotal" :page.sync="pagqueryParams.pageNum"
        :limit.sync="pagqueryParams.pageSize" @pagination="gridData" />
    </el-dialog>

    <!-- 合同导入对话框 -->
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

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="合同详情"
      width="900px"
      label-width="90px"
      span="4.5"
      :config="contConfig"
      :detail="detail"
      :dict="dict"
    />
  </div>
</template>

<script>
import {
  listContract,
  changeInformation,
  updateContract,
  checkCont,
  endContract,
  listLog,
  delLog,
  contConfig
} from "@/api/Stationary/stationaryContract/ContractQuery.js";
import { listDept } from "@/api/wage_manage/query"
import { getToken } from "@/utils/auth"
import { getSummaries } from "@/utils/table"
import DetailDialog from '@/views/components/detailDialog.vue'
import searchSelect from '@/views/components/searchSelect.vue';

export default {
  name: "ContractQuery",
  components: { searchSelect, DetailDialog },
  dicts: [
    'un',
    'sys',
    'contractstate',
    'contractsubmission',
    'paymentcycle',
    'paymentmethod',
  ],
  data() {
    return {
      // 合同费用记录列表
      logTable: [],
      contractId: null,
      logLoading: false,
      // 驻点列表
      stationList: [],
      stationVisible: false,
      stationqueryParams: {},
      stationtotal: 0,
      reviewdialogVisible: false,
      dialogTableVisible: false,
      gridData: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 保安单位驻点合同表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractName: null,
        contractState: null,
        deptId: null,
      },
      Squadronlist: [],
      DepartmentList: [],
      listOfResident: [],
      listStaffUnitList: [],
      contractor: [],
      backObj: {
        dept: [],
        squa: [],
        elem: [],
        unit: [],
      },
      pagqueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      pagtotal: 0,
      form: {},
      list: [],
      // 详情
      contConfig,
      detail: {},

      // 合同导入参数
      upload: {
        // 是否显示弹出层（合同导入）
        open: false,
        // 弹出层标题（合同导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/contract/importData"
      },
    };
  },
  watch: {
    $route(route) {
      if(route.name === 'ContractQuery') this.getList()
    },
    queryParams:{
      deep: true,
      handler() {
        this.contractId = null
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安单位驻点合同列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(res => {
        this.contractList = res.rows
        this.total = res.total
        this.loading = false
        if(res.total === 0) this.contractId = null

        this.$nextTick(() => {
          this.$refs.table.doLayout()
          // 选中驻点合同，请求合同费用记录
          const contractId = this.contractId || res.rows[0]?.contractId
          const currentRow = this.contractList.find(item => item.contractId === contractId)
          if(currentRow) this.$refs.table.setCurrentRow(currentRow)
        })
      })
    },

    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },

    // 自定义合计栏方法
    getSummaries,

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
      this.ids = selection.map(item => item.contractId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      this.open = true;
      this.title = "添加保安单位驻点合同";
    },
    /** 删除合同 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除该驻点合同？').then(function () {
        // return delContract(contractIds);
        return updateContract({ contractId: row.contractId, contractState: 3 })
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 删除合同费用记录 */
    handleDeleteLog(row) {
      this.$modal.confirm('是否确认删除该合同费用记录？').then(function () {
        return delLog(row.contractCostLogId)
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 合同终止
    handleEnd(row) {
      this.$modal.confirm('是否确认终止该驻点合同？').then(function () {
        return endContract({ contractId: row.contractId })
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("终止成功");
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
      this.download('/affairs/contract/export', {
        ...exportParams
      }, `驻点合同表_${new Date().getTime()}.xlsx`)
    },
    // 变更记录
    async changeHistory(row) {
      this.pagqueryParams.contractId = row.contractId
      this.pagqueryParams.groupId = row.groupId
      this.dialogTableVisible = true
      const res = await changeInformation(this.pagqueryParams)
      this.gridData = res.rows
      this.pagtotal = res.total
    },
    // 复核
    reviewbtn(row) {
      const ids = row.contractId || this.ids
      this.$modal.confirm('是否确认复核该合同？').then(function() {
        return checkCont(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("复核成功");
      }).catch(() => {});
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "合同导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/contract/exportTemplate', {
      }, `合同导入模板_${new Date().getTime()}.xlsx`)
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
  },
};
</script>
