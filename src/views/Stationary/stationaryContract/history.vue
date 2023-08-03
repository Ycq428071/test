<template>
  <div class="app-container">
    <div class="gl-body">
      <div style="height: 40px;">
        合同续签历史表
      </div>
      <el-table
        ref="table"
        size="mini"
        height="286px"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="contractList"
        show-summary
        :summary-method="getSummaries"
        highlight-current-row
        @current-change="listLogFn"
        @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }"
      >
        <el-table-column label="合同名称" align="center" prop="contractName" width="200" fixed show-overflow-tooltip />
        <el-table-column label="合同编号" align="center" prop="contractNumber" width="150" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="100" show-overflow-tooltip />
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
        <el-table-column label="保安人数" prop="staffNumber" align="center" show-overflow-tooltip />
        <el-table-column label="保安费用" prop="staffCosts" align="center" show-overflow-tooltip />
        <el-table-column label="消控人数" prop="fireControlNum" align="center" show-overflow-tooltip />
        <el-table-column label="消控单价" prop="fireControlCosts" align="center" show-overflow-tooltip />
        <el-table-column label="餐费补贴" prop="mealAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="小队长补贴" prop="leaderAllowance" align="center" width="90" show-overflow-tooltip />
        <el-table-column label="超时补贴" prop="overTimeAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="其他费" prop="otherCost" align="center" show-overflow-tooltip />
        <el-table-column label="月费用" prop="mouthCost" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="年人费用" prop="annualPeopleCost" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="年总费用" prop="annualTotalCost" align="center" width="120" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['affairs:payment:list']"
              size="mini"
              type="text"
              @click="$router.push(
                '/Stationary/paymentstationarycontract/Entry/index/'
                  + scope.row.renewalId + '?contractId=' + scope.row.contractId
              )"
            >收款信息</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" /> -->

      <div style="height: 40px; margin-top: 20px">
        合同费用记录表
      </div>
      <el-table
        ref="logTable"
        size="mini"
        height="calc(100vh - 294px - 286px)"
        border
        @header-dragend="$nextTick(() => { $refs.logTable.doLayout() })"
        v-loading="logLoading"
        :data="logTable"
      >
        <el-table-column label="所属驻点" prop="groupName" align="center" width="200" show-overflow-tooltip />
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
        <el-table-column label="月费用" prop="mouthCost" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="年人费用" prop="annualPeopleCost" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="年总费用" prop="annualTotalCost" align="center" width="120" show-overflow-tooltip />
      </el-table>
    </div>

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
  listHistory,
  listLog,
  contConfig
} from "@/api/Stationary/stationaryContract/ContractQuery.js";
import DetailDialog from '@/views/components/detailDialog.vue'

export default {
  name: "ContractQuery",
  dicts: [
    'un',
    'sys',
    'contractstate',
    'contractsubmission',
    'paymentcycle',
    'paymentmethod',
  ],
  components: { DetailDialog },
  data() {
    return {
      // 合同费用记录列表
      contractId: null,
      logLoading: false,
      logTable: [],
      // 遮罩层
      loading: true,
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
        renewalId: this.$route.params.renewalId,
      },
      // 详情
      contConfig,
      detail: {},
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安单位驻点合同列表 */
    getList() {
      this.loading = true;
      listHistory(this.queryParams).then(res => {
        this.contractList = res.rows
        this.total = res.total
        this.loading = false

        this.$nextTick(() => {
          this.$refs.table.doLayout()
          // 选中驻点合同，请求合同费用记录
          const contractId = this.contractId || res.rows[0]?.contractId
          const currentRow = this.contractList.find(item => item.contractId === contractId)
          if(currentRow) this.$refs.table.setCurrentRow(currentRow)
        })
      })
    },
    // 查询合同费用记录列表
    listLogFn(row) {
      if(row?.contractId) {
        this.contractId = row.contractId
        this.logLoading = true
        listLog({ contractId: row.contractId }).then(res => {
          this.logTable = res.rows
          this.logLoading = false
        })
      }
    },

    // 自定义合计栏方法
    getSummaries({ columns, data }) {
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
        } else if (index === 13 || index === 21 || index === 22 || index === 23) {
          const values = data.map(item => Number(item[column.property]))

          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
  },
};
</script>
