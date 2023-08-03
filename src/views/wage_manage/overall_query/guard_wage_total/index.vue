<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="工资年月起" prop="startDate">
        <el-date-picker
          v-model="queryParams['startDate']"
          type="month"
          placeholder="请选择月份"
          :clearable="false"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="工资年月止" prop="endDate">
        <el-date-picker
          v-model="queryParams['endDate']"
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
          label="deptName"
          option="deptId"
          placeholder="请选择所属大队"
          clearable
        />
      </el-form-item>

      <el-popover
        popper-class="gl-search_popover"
        placement="bottom"
        trigger="click"
      >
        <el-form :model="queryParams" ref="queryFormMore" :inline="true" class="gl-search_form">
          <el-form-item label="所属驻点" prop="groupId">
            <search-select
              v-model="queryParams.groupId"
              :listFn="listUnitFn"
              label="groupName"
              option="groupId"
              placeholder="请选择驻点"
              filterable
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
          <el-form-item label="保安姓名" prop="securityName">
            <el-input
              v-model="queryParams['securityName']"
              placeholder="请输入保安姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="isDepart">
            <el-select v-model="queryParams['isDepart']">
              <el-option label="全部" :value="null" />
              <el-option
                v-for="item in dict.type['query_quit_state']"
                :key="item.value"
                :label="item.label"
                :value="+item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>
      </el-popover>

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
            v-hasPermi="['salary:employee:exportStaffSalary2']"
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
        <el-table-column label="保安姓名" align="center" prop="securityName" fixed show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column label="身份证号" align="center" prop="certificateNumber" width="170" show-overflow-tooltip />
        <el-table-column label="工龄工资" align="center" prop="seniorityPay" show-overflow-tooltip />
        <el-table-column label="基本工资" align="center" prop="baseSalary" show-overflow-tooltip />
        <el-table-column label="超时补贴" align="center" prop="overtimeAllowance" show-overflow-tooltip />
        <el-table-column label="餐费" align="center" prop="mealAllowance" show-overflow-tooltip />
        <el-table-column label="考核工资" align="center" prop="probationSalary" show-overflow-tooltip />
        <el-table-column label="岗位补贴" align="center" prop="situationAllowance" show-overflow-tooltip />
        <el-table-column label="补足工资" align="center" prop="repaySalary" show-overflow-tooltip />
        <el-table-column label="职务补贴" align="center" prop="jobSalary" show-overflow-tooltip />
        <el-table-column label="缺员加班" align="center" prop="shorthandedOvertime" show-overflow-tooltip />
        <el-table-column label="服装补贴" align="center" prop="clothesAllowance" show-overflow-tooltip />
        <el-table-column label="低保补贴" align="center" prop="subsistenceAllowance" show-overflow-tooltip />
        <el-table-column label="节日加班" align="center" prop="holidayFee" show-overflow-tooltip />
        <el-table-column label="加班" align="center" prop="overtimePay" show-overflow-tooltip />
        <!-- <el-table-column label="其他驻点工资" align="center" prop="" width="100" show-overflow-tooltip /> -->
        <el-table-column label="其他加班工资" align="center" prop="otherOvertimeWages" width="100" show-overflow-tooltip />
        <el-table-column label="其他1" align="center" prop="otherAllowance1" show-overflow-tooltip />
        <el-table-column label="其他2" align="center" prop="otherAllowance2" show-overflow-tooltip />
        <el-table-column label="应发工资" align="center" prop="shouldSalary" show-overflow-tooltip />
        <el-table-column label="养老保险" align="center" prop="pension" show-overflow-tooltip />
        <el-table-column label="意外险" align="center" prop="accidentInsurance1" show-overflow-tooltip />
        <el-table-column label="意外险2" align="center" prop="accidentInsurance2" show-overflow-tooltip />
        <el-table-column label="违纪工资" align="center" prop="breachPrinciple" show-overflow-tooltip />
        <el-table-column label="请假扣划" align="center" prop="offWorkDeduct" show-overflow-tooltip />
        <el-table-column label="不上班工资" align="center" prop="absenteeism" width="90" show-overflow-tooltip />
        <el-table-column label="其他扣款1" align="center" prop="otherDeduct1" width="90" show-overflow-tooltip />
        <el-table-column label="其他扣款2" align="center" prop="otherDeduct2" width="90" show-overflow-tooltip />
        <el-table-column label="保险补扣" align="center" prop="insuranceDeduct" show-overflow-tooltip />
        <el-table-column label="医保" align="center" prop="medicalInsurance" show-overflow-tooltip />
        <el-table-column label="失业" align="center" prop="unemploymentInsurance" show-overflow-tooltip />
        <el-table-column label="公积金（原大病）" align="center" prop="seriousIllness" width="130" show-overflow-tooltip />
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
import { listWageTotal } from "@/api/wage_manage/overall_query"
import { listDept, listUnit } from "@/api/wage_manage/query"
import { listPost } from '@/api/wage_manage/guard_manage'
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Guard_wage_total',
  dicts: [
    'query_quit_state',
  ],
  components: { searchSelect },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
        'startDate': dayjs().subtract(1, 'month').format('YYYY-MM'),
        'endDate': dayjs().subtract(1, 'month').format('YYYY-MM'),
        'deptId': null,
        'groupId': null,
        'positionId': null,
        'securityName': null,
        'isDepart': null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        '': [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listWageTotal(this.queryParams).then(response => {
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
      this.resetForm("queryFormMore")
      this.handleQuery()
    },
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询驻点方法
    async listUnitFn(queryParams) {
      const { rows, total } = await listUnit({
        ...queryParams,
      })

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

    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(let k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/salary/employee/exportStaffSalary2', {
        ...exportParams
      }, `保安工资合计表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
