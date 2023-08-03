<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="所属驻点" prop="groupId">
        <search-select
          v-model="queryParams.groupId"
          :listFn="listGroupFn"
          label="groupName"
          option="groupId"
          placeholder="请选择驻点"
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
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['affairs:costProfit:export']"
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
        <el-table-column label="驻点名称" align="center" prop="groupName" fixed width="250" show-overflow-tooltip />
        <el-table-column label="签约合同" align="center" prop="contractName" width="250" show-overflow-tooltip />
        <el-table-column label="计算年月" align="center" prop="countYear" show-overflow-tooltip />
        <el-table-column label="客户类型" align="center" prop="customerType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.query_customer_type" :value="scope.row.customerType" />
          </template>
        </el-table-column>
        <el-table-column label="合同总价" align="center" prop="totalContractPrice" width="110" show-overflow-tooltip />
        <el-table-column label="合同期限" align="center" prop="contractPeriod" width="160" show-overflow-tooltip />
        <el-table-column label="驻点人数" align="center" prop="groupNumber" show-overflow-tooltip />
        <el-table-column label="驻点收入" align="center" prop="groupIncome" show-overflow-tooltip />
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
        <el-table-column label="合同收款" align="center" prop="groupCollection" show-overflow-tooltip />
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
  </div>
</template>

<script>
import searchSelect from '@/views/components/searchSelect.vue'
import request from '@/utils/request'
// 查询驻点成本利润列表
function listPart(params) {
  return request({
    url: '/affairs/costProfit/list',
    method: 'get',
    params
  })
}
// 查询合同下的驻点单位
function listGroup(params) {
  return request({
    url: '/affairs/unit/groupList',
    method: 'get',
    params
  })
}

export default {
  name: 'Cost_profit-point',
  components: { searchSelect },
  dicts: ['query_customer_type'],
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
        'groupId': null,
        'contractId': null,
        'countStartYear': null,
        'countEndYear': null,
      },
    }
  },
  created() {
    this.queryParams.contractId = this.$route.params.contractId
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listPart(this.queryParams).then(response => {
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
    // 查询合同方法
    async listGroupFn(queryParams) {
      const { rows, total } = await listGroup({
        ...queryParams,
        contractId: this.$route.params.contractId
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
      this.download('/affairs/costProfit/export', {
        ...exportParams
      }, `驻点成本利润表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
