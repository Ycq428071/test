<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="薪水年月" prop="payday">
        <el-date-picker
          v-model="queryParams['payday']"
          type="month"
          placeholder="请选择月份"
          :clearable="false"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select
          v-model="queryParams.deptId"
          :listFn="listDeptFn"
          :backArr="backObj.dept"
          label="deptName"
          option="deptId"
          placeholder="请选择大队"
          clearable
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
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['salary:employee:exportDeptSalaryDetail']"
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
        <el-table-column label="大队名称" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="实际收费人数" align="center" prop="actualChargePeople" width="100" show-overflow-tooltip />
        <el-table-column label="发放人数" align="center" prop="providePeople" show-overflow-tooltip />
        <el-table-column label="扣保险人数" align="center" prop="insurancePeople" width="90" show-overflow-tooltip />
        <el-table-column label="工资年月" align="center" prop="payday" show-overflow-tooltip />
        <el-table-column label="基本工资" align="center" prop="baseSalary" show-overflow-tooltip />
        <el-table-column label="超时补贴" align="center" prop="overtimeAllowance" show-overflow-tooltip />
        <el-table-column label="餐费" align="center" prop="mealAllowance" show-overflow-tooltip />
        <el-table-column label="考核工资" align="center" prop="probationSalary" show-overflow-tooltip />
        <el-table-column label="岗位补贴" align="center" prop="situationAllowance" show-overflow-tooltip />
        <el-table-column label="补足工资" align="center" prop="repaySalary" show-overflow-tooltip />
        <el-table-column label="缺员加班" align="center" prop="shorthandedOvertime" show-overflow-tooltip />
        <el-table-column label="服装补贴" align="center" prop="clothesAllowance" show-overflow-tooltip />
        <el-table-column label="节日费用" align="center" prop="holidayFee" show-overflow-tooltip />
        <el-table-column label="其他1" align="center" prop="otherAllowance1" show-overflow-tooltip />
        <el-table-column label="其他2" align="center" prop="otherAllowance2" show-overflow-tooltip />
        <el-table-column label="应发工资" align="center" prop="shouldSalary" show-overflow-tooltip />
        <el-table-column label="请假扣划" align="center" prop="offWorkDeduct" show-overflow-tooltip />
        <el-table-column label="扣回养老金" align="center" prop="pension" width="90" show-overflow-tooltip />
        <el-table-column label="扣意外险" align="center" prop="accidentInsurance1" show-overflow-tooltip />
        <el-table-column label="扣意外险2" align="center" prop="accidentInsurance2" width="90" show-overflow-tooltip />
        <el-table-column label="不上班工资" align="center" prop="absenteeism" width="90" show-overflow-tooltip />
        <el-table-column label="违纪工资" align="center" prop="breachPrinciple" show-overflow-tooltip />
        <el-table-column label="其他扣款1" align="center" prop="otherDeduct1" width="90" show-overflow-tooltip />
        <el-table-column label="其他扣款2" align="center" prop="otherDeduct2" width="90" show-overflow-tooltip />
        <el-table-column label="保险补扣" align="center" prop="insuranceDeduct" show-overflow-tooltip />
        <el-table-column label="扣公积金" align="center" prop="seriousIllness" show-overflow-tooltip />
        <el-table-column label="个税" align="center" prop="incomeTax" show-overflow-tooltip />
        <el-table-column label="实发工资" align="center" prop="actualSalary" show-overflow-tooltip />
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
import { listDeptWage } from "@/api/wage_manage/overall_query"
import { listDept } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Lochus_wage',
  components: { searchSelect },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        'payday': dayjs().subtract(1, 'month').format('YYYY-MM'),
        'deptId': 101,
      },
      backObj: {
        dept: [{ deptName: '保安部', deptId: 101 }],
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
      listDeptWage(this.queryParams).then(response => {
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
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },

    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(let k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/salary/employee/exportDeptSalaryDetail', {
        ...exportParams
      }, `大队工资支出统计表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
