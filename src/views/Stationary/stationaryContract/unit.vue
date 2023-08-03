<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true" size="mini" @submit.native.prevent>
      <el-form-item label="驻点名称" prop="groupName">
        <el-input v-model="queryParams.groupName" placeholder="请输入驻点名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="签订合同" prop="contractId">
        <search-select
          v-model="queryParams.contractId"
          :listFn="listContFn"
          :backArr="backObj.queryCont"
          label="contractName"
          option="contractId"
          placeholder="请选择合同"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select v-model="queryParams.deptId" :listFn="listDeptFn"
          label="deptName" option="deptId" placeholder="请选择大队" filterable />
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
      驻点单位表
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            size="mini"
            v-hasPermi="['affairs:unit:add']"
            icon="el-icon-plus"
            type="primary"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-download"
            v-hasPermi="['affairs:unit:export']"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        size="mini"
        height="287px"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="tableList"
        highlight-current-row
        @current-change="listLogFn"
        show-summary
        :summary-method="$event => getSummaries($event, [6, 14, 15, 16], '合计')"
        @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }"
      >
        <el-table-column prop="groupName" label="驻点单位" width="250" fixed align="center" show-overflow-tooltip />
        <el-table-column prop="contractName" label="签订合同" width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="deptName" label="所属大队" align="center" width="110" show-overflow-tooltip />
        <el-table-column prop="headName" label="负责人" align="center" show-overflow-tooltip />
        <el-table-column prop="unitCategory" label="单位类别" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.un" :value="scope.row.unitCategory" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="保安人数" prop="staffNumber" align="center" show-overflow-tooltip />
        <el-table-column label="保安费用" prop="staffCosts" align="center" show-overflow-tooltip />
        <el-table-column label="消控人数" prop="fireControlNum" align="center"  show-overflow-tooltip/>
        <el-table-column label="消控单价" prop="fireControlCosts" align="center" show-overflow-tooltip />
        <el-table-column label="餐费补贴" prop="mealAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="小队长补贴" prop="leaderAllowance" align="center" width="90" show-overflow-tooltip />
        <el-table-column label="超时补贴" prop="overTimeAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="其他费" prop="otherCost" align="center" show-overflow-tooltip />
        <el-table-column label="月费用" prop="mouthCost" align="center" show-overflow-tooltip />
        <el-table-column label="年人费用" prop="annualPeopleCost" align="center" show-overflow-tooltip />
        <el-table-column label="年总费用" prop="annualTotalCost" align="center" width="100" show-overflow-tooltip />

        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />

        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['affairs:unit:edit']"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:unit:edit']"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              @click="changeHistory(scope.row)"
              v-hasPermi="['affairs:gorupLog:list']"
            >变更记录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 40px" />

      <div style="height: 48px; margin-top: 20px">
        费用记录表
        <el-row :gutter="10" class="mb8" v-if="groupId !== null">
          <el-col :span="1.5">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleAddLog"
              v-hasPermi="['contractCostLog:contractCostLog:add']"
            >新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        ref="logTable"
        size="mini"
        height="calc(100vh - 736px)"
        border
        @header-dragend="$nextTick(() => { $refs.logTable.doLayout() })"
        v-loading="logLoading"
        :data="logTable"
      >
        <el-table-column label="生效日期" prop="effectiveDate" align="center" show-overflow-tooltip />
        <el-table-column label="终止日期" prop="endDate" align="center" show-overflow-tooltip />
        <el-table-column label="保安人数" prop="staffNumber" align="center" show-overflow-tooltip />
        <el-table-column label="保安费用" prop="staffCosts" align="center" show-overflow-tooltip />
        <el-table-column label="消控人数" prop="fireControlNum" align="center" show-overflow-tooltip />
        <el-table-column label="消控单价" prop="fireControlCosts" align="center" show-overflow-tooltip />
        <el-table-column label="餐费补贴" prop="mealAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="小队长补贴" prop="leaderAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="超时补贴" prop="overTimeAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="其他费" prop="otherCost" align="center" show-overflow-tooltip />
        <el-table-column label="月费用" prop="mouthCost" align="center" show-overflow-tooltip />
        <el-table-column label="年人费用" prop="annualPeopleCost" align="center" show-overflow-tooltip />
        <el-table-column label="年总费用" prop="annualTotalCost" align="center" show-overflow-tooltip />

        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['contractCostLog:contractCostLog:edit']"
              size="mini"
              type="text"
              @click="handleUpdateLog(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['contractCostLog:contractCostLog:remove']"
              size="mini"
              type="text"
              @click="handleDeleteLog(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增或修改驻点对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="600px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="驻点名称" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入驻点名称" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
        <el-form-item label="签订合同" prop="contractId">
          <search-select
            v-model="form.contractId"
            :listFn="listContFn"
            :backArr="backObj.cont"
            filterable
            label="contractName"
            option="contractId"
            placeholder="请选择合同"
          />
        </el-form-item>
        <el-form-item label="所属大队" prop="deptId">
          <search-select
            v-model="form.deptId"
            :listFn="listDeptFn"
            :backArr="backObj.dept"
            label="deptName"
            option="deptId"
            placeholder="请选择大队"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="headId">
          <search-select
            v-model="form.headId"
            :listFn="listHeadFn"
            :backArr="backObj.head"
            label="headName"
            option="staffHeadId"
            placeholder="请选择负责人"
            filterable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="form.groupId !== null">
          <el-select v-model="form['status']" style="width: 100%">
            <el-option
              v-for="item in dict.type['status']"
              :key="item.value"
              :label="item.label"
              :value="+item.value"
            />
          </el-select>
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

    <!-- 新增或修改费用对话框 -->
    <el-dialog v-dialogDrag :title="logTitle" :visible.sync="logOpen" width="800px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="logForm" :model="logForm" :rules="logRules" label-width="90px">
          <el-col :span="12">
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker clearable v-model="logForm.effectiveDate" type="date" value-format="yyyy-MM-dd"
                placeholder="请选择生效日期" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终止日期" prop="endDate">
              <el-date-picker clearable v-model="logForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择终止日期" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保安人数" prop="staffNumber">
              <el-input-number
                class="ipt-number"
                placeholder="请输入保安人数"
                v-model="logForm.staffNumber"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保安费用" prop="staffCosts">
              <el-input-number
                class="ipt-number"
                placeholder="请输入保安费用"
                v-model="logForm.staffCosts"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消控人数" prop="fireControlNum">
              <el-input-number
                class="ipt-number"
                placeholder="请输入消控人数"
                v-model="logForm['fireControlNum']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消控单价" prop="fireControlCosts">
              <el-input-number
                class="ipt-number"
                placeholder="请输入消控单价"
                v-model="logForm.fireControlCosts"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="餐费补贴" prop="mealAllowance">
              <el-input-number
                class="ipt-number"
                placeholder="请输入餐费补贴"
                v-model="logForm.mealAllowance"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小队长补贴" prop="leaderAllowance">
              <el-input-number
                class="ipt-number"
                placeholder="请输入小队长补贴"
                v-model="logForm.leaderAllowance"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超时补贴" prop="overTimeAllowance">
              <el-input-number
                class="ipt-number"
                placeholder="请输入超时补贴"
                v-model="logForm.overTimeAllowance"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他费" prop="otherCost">
              <el-input-number
                class="ipt-number"
                v-model="logForm.otherCost"
                placeholder="请输入其他费"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月费用" prop="mouthCost">
              <el-input-number
                class="ipt-number"
                placeholder="请输入月费用"
                v-model="logForm.mouthCost"
                :controls="false"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年人费用" prop="annualPeopleCost">
              <el-input-number
                class="ipt-number"
                placeholder="请输入年人费用"
                v-model="logForm.annualPeopleCost"
                :controls="false"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年总费用" prop="annualTotalCost">
              <el-input-number
                class="ipt-number"
                placeholder="请输入年总费用"
                v-model="logForm.annualTotalCost"
                :controls="false"
                :precision="2"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="calcFn">计 算</el-button>
        <el-button type="primary" @click="submitFormLog">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog v-dialogDrag title="变更记录" :visible.sync="dialogTableVisible" width="800px" :modal-append-to-body="false">
      <el-table
        ref="changeTable"
        border
        @header-dragend="$nextTick(() => { $refs.changeTable.doLayout() })"
        :data="gridData"
      >
        <el-table-column prop="groupName" label="驻点单位" width="250" show-overflow-tooltip />
        <!-- <el-table-column prop="contractName" label="签订合同" width="250" show-overflow-tooltip /> -->
        <el-table-column prop="deptName" label="所属大队" show-overflow-tooltip />
        <el-table-column prop="headName" label="负责人" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      </el-table>
      <pagination v-show="pagtotal > 0" :total="pagtotal" :page.sync="pagqueryParams.pageNum"
        :limit.sync="pagqueryParams.pageSize" @pagination="gridData" />
    </el-dialog>

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="驻点详情"
      width="900px"
      label-width="90px"
      span="4.5"
      :config="unitConfig"
      :detail="detail"
      :dict="dict"
    />
  </div>
</template>

<script>
import { listContract, listLog, addLog, updateLog, delLog } from "@/api/Stationary/stationaryContract/ContractQuery.js";
import { listDept } from "@/api/wage_manage/query"
import { listOfResidentUnits, changeInformation, ModifyDepartment, Addstationaryunit, unitConfig } from '@/api/Stationary/stationaryContract/unit.js'
import { listLeader } from "@/api/Stationary/head"
import { getSummaries } from '@/utils/table'
import searchSelect from '@/views/components/searchSelect.vue';
import DetailDialog from '@/views/components/detailDialog.vue'
import dayjs from 'dayjs'

export default {
  name: 'Unit',
  components: { searchSelect, DetailDialog },
  dicts: [
    'un',
    'ischange',
    'status',
  ],
  data() {
    return {
      // 详情
      unitConfig,
      detail: {},
      
      // 选择器回显数据
      backObj: {
        dept: [],
        cont: [],
        queryCont: [],
        head: [],
      },
      // 驻点列表
      tableList: [],
      total: 0,
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupName: null,
        contractId: null,
        deptId: null,
        status: 0,
      },
      // 费用记录列表
      logTable: [],
      contractId: null,
      groupId: null,
      logLoading: false,
      logForm: {},
      logRules: {},
      logOpen: false,
      logTitle: '',

      // 变更记录
      dialogTableVisible: false,
      gridData: [],
      pagtotal: 0,
      pagqueryParams: {
        pageNum: 1,
        pageSize: 10,
      },

      // 表单
      open: false,
      title: '',
      form: {},
      rules: {
        groupName:  [
          { required: true, message: "请输入驻点名称", trigger: "blur" }
        ],
        contractId: [
          { required: true, message: "请选择合同", trigger: "change" }
        ],
        deptId: [
          { required: true, message: "请选择大队", trigger: "change" }
        ],
      },
    }
  },
  // watch: {
  //   $route: {
  //     immediate: true,
  //     handler({ name, query }) {
  //       if(name === 'Unit') {
  //         // 如果是从驻点合同中跳转过来，要展示指定合同签订的驻点
  //         if(query.contractId) {
  //           this.backObj.queryCont = [{
  //             contractName: query.contractName === 'null' ? +query.contractId : query.contractName,
  //             contractId: +query.contractId
  //           }]
  //           this.queryParams.contractId = +query.contractId
  //           this.getList()
  //         }
  //       }
  //     }
  //   }
  // },
  watch: {
    $route(route) {
      if(route.name === 'Unit') this.getList()
    },
  },
  created() {
    this.getList()
  },
  computed: {
    // 月数 多出天数大于等于 15 天则算一个月
    monthCount() {
      const startDate = dayjs(this.logForm.effectiveDate)
      const endDate = dayjs(this.logForm.endDate)
      const months = endDate.diff(startDate, 'month')
      const remainingDays = endDate.diff(startDate.add(months, 'month'), 'day')
      return remainingDays >= 14 ? months + 1 : months
    },
    // 月费用 = 保安人数 * (保安费用 + 餐费补贴) + 消控人数 * 消控单价 + 小队长补贴 + 超时补贴 + 其他费
    mouthCost() {
      const {
        staffNumber,
        staffCosts,
        fireControlCosts,
        fireControlNum,
        mealAllowance,
        leaderAllowance,
        overTimeAllowance,
        otherCost
      } = this.logForm
      const signal = staffNumber < 0 ? -1 : 1
      return (Math.abs(staffNumber) * (staffCosts + mealAllowance) +
        fireControlNum * fireControlCosts +
        leaderAllowance + overTimeAllowance + otherCost) * signal
        || 0
    },
    // 年人费用 = 年总费用 / 保安人数
    annualPeopleCost() {
      return this.annualTotalCost / Math.abs(this.logForm.staffNumber) || 0
    },
    // 年总费用 = 月费用 * 月数
    annualTotalCost() {
      return this.mouthCost * this.monthCount || 0
    },
  },
  methods: {
    // 合计栏自定义方法
    getSummaries,

    getList() {
      this.loading = true;
      listOfResidentUnits(this.queryParams).then(res => {
        this.tableList = res.rows
        this.total = res.total
        this.loading = false

        this.$nextTick(() => {
          this.$refs.table.doLayout()
          // 选中驻点合同，请求合同费用记录
          const groupId = this.groupId || res.rows[0]?.groupId
          const currentRow = this.tableList.find(item => item.groupId === groupId)
          if(currentRow) this.$refs.table.setCurrentRow(currentRow)
        })
      })
    },
    // 查询合同费用记录列表
    listLogFn(row) {
      if(row?.groupId) {
        this.contractId = row.contractId
        this.groupId = row.groupId
        this.logLoading = true
        listLog({ contractId: row.contractId, groupId: row.groupId }).then(res => {
          this.logTable = res.rows
          this.logLoading = false
        })
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.handleClear()
      this.getList();
    },
    // 清除子列表查询条件
    handleClear() {
      this.contractId = null
      this.groupId = null
      this.logTable = []
    },
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询合同方法
    async listContFn(queryParams) {
      const { rows, total } = await listContract({
        ...queryParams,
      })

      return { rows, total }
    },
    // 查询负责人方法
    async listHeadFn(queryParams) {
      const { rows, total } = await listLeader({
        ...queryParams,
      })

      return { rows, total }
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.logOpen = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        groupId: null,
        groupName: null,
        contractId: null,
        deptId: null,
        status: null,
        headId: null,
        remark: null,
      }
      this.logForm = {
        'contractCostLogId': null,
        'effectiveDate': dayjs().format('YYYY-MM-DD'),
        'endDate': dayjs().add(1, 'year').format('YYYY-MM-DD'),
        'staffNumber': null,
        'staffCosts': null,
        'fireControlNum': null,
        'fireControlCosts': null,
        'mealAllowance': null,
        'leaderAllowance': null,
        'overTimeAllowance': null,
        'otherCost': null,
        'mouthCost': null,
        'annualPeopleCost': null,
        'annualTotalCost': null,
      }
      this.resetForm("form")
      this.resetForm("logForm")
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加驻点单位'
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      this.backObj.cont = [{ contractName: row.contractName, contractId: row.contractId }]
      this.backObj.dept = [{ deptName: row.deptName, deptId: row.deptId }]
      this.backObj.head = [{ headName: row.headName, staffHeadId: row.headId }]
      this.form = { ...row }
      this.open = true
      this.title = '修改驻点单位'
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const form = {}
          for(const k in this.form) {
            form[k] = this.form[k]
          }

          if (this.form['groupId'] != null) {
            // 修改时取消签订合同，要传 0
            if(form.contractId === '') form.contractId = 0
            ModifyDepartment(form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            Addstationaryunit(form).then(response => {
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
      this.$modal.confirm('是否确认删除该驻点单位？').then(function () {
        // return DeleteStationaryUnits(dictIds);
        return ModifyDepartment({ groupId: row.groupId, status: 3 })
      }).then(() => {
        this.handleClear()
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    // 变更记录
    async changeHistory(row) {
      this.pagqueryParams.groupId = row.groupId
      const res = await changeInformation(this.pagqueryParams)
      this.gridData = res.rows
      this.pagtotal = res.total
      this.dialogTableVisible = true
    },

    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/unit/export', {
        ...exportParams
      }, `驻点单位表_${new Date().getTime()}.xlsx`)
    },


    /** 删除费用记录 */
    handleDeleteLog(row) {
      this.$modal.confirm('是否确认删除该合同费用记录？').then(function () {
        return delLog(row.contractCostLogId)
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 新增费用记录
    handleAddLog() {
      this.reset()
      this.logTitle = '新增费用记录'
      this.logOpen = true
    },
    // 修改费用记录
    handleUpdateLog(row) {
      this.reset()
      for(const k in this.logForm) {
        this.logForm[k] = row[k]
      }
      this.logTitle = '修改费用记录'
      this.logOpen = true
    },
    // 将计算值赋值给表单
    calcFn() {
      this.logForm.mouthCost = this.mouthCost
      this.logForm.annualPeopleCost = this.annualPeopleCost
      this.logForm.annualTotalCost = this.annualTotalCost
    },
    /** 费用记录弹框提交按钮 */
    submitFormLog() {
      this.$refs['logForm'].validate(valid => {
        if (valid) {
          if (this.logForm['contractCostLogId'] != null) {
            updateLog(this.logForm).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.logOpen = false
              this.getList()
            })
          } else {
            addLog({ 
              ...this.logForm,
              contractId: this.contractId,
              groupId: this.groupId
            }).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.logOpen = false
              this.getList()
            })
          }
        }
      })
    },
  }
}
</script>

<style></style>