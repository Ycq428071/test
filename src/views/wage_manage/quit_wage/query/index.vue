<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="薪水年月" prop="payday">
        <el-date-picker
          v-model="queryParams.payday"
          type="month"
          placeholder="请选择月份"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="保安姓名" prop="securityName">
        <el-input
          v-model="queryParams['securityName']"
          placeholder="请输入保安姓名"
          clearable
          @keyup.enter.native="handleQuery"
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
      <el-form-item label="复核标记" prop="recheckFlag">
        <el-select v-model="queryParams['recheckFlag']">
          <el-option label="全部" :value="null"></el-option>
          <el-option
            v-for="item in dict.type['query_review_sign']"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-popover
        popper-class="gl-search_popover"
        placement="bottom"
        trigger="click"
      >
        <el-form :model="queryParams" ref="queryFormMore" :inline="true" class="gl-search_form">
          <el-form-item label="证件号码" prop="certificateNumber">
            <el-input
              v-model="queryParams['certificateNumber']"
              placeholder="请输入证件号码"
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
              placeholder="请选择大队"
              clearable
            />
          </el-form-item>
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
          <el-form-item label="驻点名称" prop="groupName">
            <el-input
              v-model="queryParams['groupName']"
              placeholder="请输入驻点名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="复核标记" prop="recheckFlag">
            <el-select v-model="queryParams['recheckFlag']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['query_review_sign']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>
      </el-popover> -->

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
            v-hasPermi="['salary:employee:export']"
          >导出</el-button>
        </el-col>
      </el-row>

        <!-- show-summary
        sum-text="小计" -->
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="salaryList"
        height="calc(100vh - 194px - 106px - 56px - 50px)"
        @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }"
      >
        <el-table-column label="工资年月" align="center" prop="payday" show-overflow-tooltip />
        <el-table-column label="姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="离职日期" align="center" prop="resignationTime" width="100" show-overflow-tooltip />
        <el-table-column label="银行账号" align="center" prop="account" width="170" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" width="170" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
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
        <el-table-column label="违纪工资" align="center" prop="breachPrinciple" show-overflow-tooltip />
        <el-table-column label="不上班扣款" align="center" prop="absenteeism" width="90" show-overflow-tooltip />
        <el-table-column label="其他扣款1" align="center" prop="otherDeduct1" width="90" show-overflow-tooltip />
        <el-table-column label="其他扣款2" align="center" prop="otherDeduct2" width="90" show-overflow-tooltip />
        <el-table-column label="保险补扣" align="center" prop="insuranceDeduct" show-overflow-tooltip />
        <el-table-column label="个税" align="center" prop="incomeTax" show-overflow-tooltip />
        <el-table-column label="实发工资" align="center" prop="actualSalary" show-overflow-tooltip />
        <el-table-column label="卡工资" align="center" prop="cardSalary" show-overflow-tooltip />
        <el-table-column label="制表日期" align="center" prop="createDate" width="100" show-overflow-tooltip />
        <el-table-column label="制表人" align="center" prop="createUserName" show-overflow-tooltip />
        <el-table-column label="复核日期" align="center" prop="checkDate" width="100" show-overflow-tooltip />
        <el-table-column label="复核人" align="center" prop="checkUserName" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
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

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="工资详情"
      width="1550px"
      label-width="106px"
      span="4.5"
      :config="queryConfig"
      :detail="detail"
    />
  </div>
</template>

<script>
import { listSalary } from "@/api/wage_manage/guard_wage"
import { queryConfig } from "@/api/wage_manage/quit_wage"
import { listDept } from "@/api/wage_manage/query"
import { listPost } from "@/api/wage_manage/guard_manage"
import searchSelect from '@/views/components/searchSelect.vue'
import DetailDialog from '@/views/components/detailDialog.vue'
import dayjs from 'dayjs'

export default {
  name: 'Wq_query',
  dicts: ['query_review_sign'],
  components: { searchSelect, DetailDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 10,
      // 保安工资表格数据
      salaryList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sceneFlag: 0,
        isDepart: 1,
        'payday': dayjs().subtract(1, 'month').format('YYYY-MM'),
        'securityName': null,
        'positionId': null,
        'recheckFlag': null,
      },
      // 详情数据
      queryConfig,
      detail: {},
    }
  },

  created() {
    this.getList()
  },

  watch: {
    $route(route) {
      if(route.name === 'Wq_query') this.getList()
    },
  },

  methods: {
    /** 查询保安工资列表 */
    getList() {
      this.loading = true
      listSalary(this.queryParams).then(response => {
        this.salaryList = response.rows
        this.total = response.total
        this.loading = false
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.resetForm("queryFormMore")
      this.handleQuery();
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

    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(let k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/salary/employee/export', {
        ...exportParams
      }, `保安工资表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
