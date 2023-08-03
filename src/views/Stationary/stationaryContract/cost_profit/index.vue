<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" class="gl-search_form">
      <el-form-item label="驻点合同" prop="contractId">
        <search-select
          v-model="queryParams.contractId"
          :listFn="listContFn"
          label="contractName"
          option="contractId"
          placeholder="请选择合同"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="计算年月起" prop="countStartYear">
        <el-date-picker
          v-model="queryParams.countStartYear"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计算年月止" prop="countEndYear">
        <el-date-picker
          v-model="queryParams.countEndYear"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="gl-body">
      <!-- <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['']"
          >导出</el-button>
        </el-col>
      </el-row> -->

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="tableList"
        height="calc(100vh - 194px - 106px)"
      >
        <el-table-column label="合同名称" align="center" prop="contractName" fixed width="250" show-overflow-tooltip />
        <el-table-column label="客户类型" align="center" prop="customerType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.query_customer_type" :value="scope.row.customerType" />
          </template>
        </el-table-column>
        <el-table-column label="合同总价" align="center" prop="totalContractPrice" width="100" show-overflow-tooltip />
        <el-table-column label="合同期限" align="center" prop="contractPeriod" width="160" show-overflow-tooltip />
        <el-table-column label="合同人数" align="center" prop="contractNumber" show-overflow-tooltip />
        <el-table-column label="实际人数" align="center" prop="groupNumber" show-overflow-tooltip />
        <el-table-column label="合同收入" align="center" prop="contractIncome" show-overflow-tooltip />
        <el-table-column label="员工工资" align="center" prop="staffWages" show-overflow-tooltip />
        <el-table-column label="社保" align="center" prop="socialSecurity" show-overflow-tooltip />
        <el-table-column label="公积金" align="center" prop="accumulationFund" show-overflow-tooltip />
        <el-table-column label="服装费" align="center" prop="clothingCost" show-overflow-tooltip />
        <el-table-column label="餐费" align="center" prop="mealsCost" show-overflow-tooltip />
        <el-table-column label="其他费" align="center" prop="otherCost" show-overflow-tooltip />
        <el-table-column label="公司管理费" align="center" prop="overhead" width="90" show-overflow-tooltip />
        <el-table-column label="支出小计" align="center" prop="expenditure" show-overflow-tooltip />
        <el-table-column label="利润" align="center" prop="profit" width="110" show-overflow-tooltip />
        <el-table-column label="利润率" align="center" prop="profitMargin" show-overflow-tooltip />
        <el-table-column label="合同收款" align="center" prop="contractCollection" show-overflow-tooltip />

        <el-table-column label="操作" align="center" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['affairs:costProfit:list']"
              @click="$router.push('/Stationary/stationaryContract/cost_profit-point/index/' + scope.row.contractId)"
            >
              驻点成本利润
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div v-show="total<=0" style="height: 50px" /> -->
    </div>
  </div>
</template>

<script>
import searchSelect from '@/views/components/searchSelect.vue'
import request from '@/utils/request'
// 查询总合同成本利润列表
function listTotal(params) {
  return request({
    url: '/affairs/costProfit/contractProfitList',
    method: 'get',
    params
  })
}
// 查询保安单位驻点合同列表
function listCont(params) {
  return request({
    url: '/affairs/contract/list',
    method: 'get',
    params
  })
}

export default {
  name: 'Cost_profit',
  components: { searchSelect },
  dicts: ['query_customer_type'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        'contractId': null || 1,
        'countStartYear': null || '2023-01-01',
        'countEndYear': null || '2023-07-01',
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
      listTotal(this.queryParams).then(response => {
        this.tableList = response.data
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
    // 查询合同方法
    async listContFn(queryParams) {
      const { rows, total } = await listCont({
        ...queryParams,
      })
      return { rows, total }
    },

    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      // this.download('/affairs/costProfit/export', {
      //   ...exportParams
      // }, `驻点成本利润表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
