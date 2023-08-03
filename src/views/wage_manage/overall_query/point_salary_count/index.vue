<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
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
      <el-form-item label="所属驻点" prop="stagnationPointId">
        <search-select
          v-model="queryParams.stagnationPointId"
          :listFn="listUnitFn"
          label="groupName"
          option="groupId"
          placeholder="请选择驻点"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="驻点名称" prop="stagnationPointName">
        <el-input
          v-model="queryParams['stagnationPointName']"
          placeholder="请输入驻点名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-popover
        popper-class="gl-search_popover"
        placement="bottom"
        trigger="click"
      >
        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>

        <el-form :model="queryParams" ref="queryFormMore" :inline="true" class="gl-search_form">
          <el-form-item label="薪水年月" prop="">
            <el-date-picker
              v-model="queryParams['']"
              type="month"
              placeholder="请选择月份"
              :clearable="false"
              value-format="yyyy-MM"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="考核奖超标" prop="">
            <el-select v-model="queryParams['']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['query_assess_award_over']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
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
            v-hasPermi="['']"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="loading"
        :data="tableList"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column label="序号" align="center" prop="" />
        <el-table-column label="所属大队" align="center" prop="" width="110" />
        <el-table-column label="合同编号" align="center" prop="" />
        <el-table-column label="合同名称" align="center" prop="" />
        <el-table-column label="驻点名称" align="center" prop="groupName" width="250" />
        <el-table-column label="收费金额" align="center" prop="" />
        <el-table-column label="实际收费人数" align="center" prop="" width="100" />
        <el-table-column label="发放人数" align="center" prop="" />
        <el-table-column label="扣养老保险人数" align="center" prop="" width="120"/>
        <el-table-column label="扣意外险人数" align="center" prop="" width="100"/>
        <el-table-column label="扣意外险人数2" align="center" prop="" width="110" />
        <el-table-column label="工资年月" align="center" prop="payday" />
        <el-table-column label="工龄工资" align="center" prop="" />
        <el-table-column label="基本工资" align="center" prop="baseSalary" />
        <el-table-column label="超时补贴" align="center" prop="overtimeAllowance" />
        <el-table-column label="餐费" align="center" prop="mealAllowance" />
        <el-table-column label="考核工资" align="center" prop="probationSalary" />
        <el-table-column label="岗位补贴" align="center" prop="situationAllowance" />
        <el-table-column label="补足工资" align="center" prop="repaySalary" />
        <el-table-column label="职务补贴" align="center" prop="" />
        <el-table-column label="缺员加班" align="center" prop="shorthandedOvertime" />
        <el-table-column label="服装补贴" align="center" prop="" />
        <el-table-column label="节日加班" align="center" prop="" />
        <el-table-column label="加班" align="center" prop="" />
        <el-table-column label="其他1" align="center" prop="otherAllowance1" />
        <el-table-column label="其他2" align="center" prop="otherAllowance2" />
        <el-table-column label="应发工资" align="center" prop="shouldSalary" />
        <el-table-column label="扣养老保险" align="center" prop="" width="90" />
        <el-table-column label="扣意外险" align="center" prop="accidentInsurance1" />
        <el-table-column label="扣意外险2" align="center" prop="accidentInsurance2" />
        <el-table-column label="违纪工资" align="center" prop="breachPrinciple" />
        <el-table-column label="其他扣款1" align="center" prop="otherDeduct1" />
        <el-table-column label="其他扣款2" align="center" prop="otherDeduct2" />
        <el-table-column label="保险补扣" align="center" prop="insuranceDeduct" />
        <el-table-column label="请假扣划" align="center" prop="offWorkDeduct" />
        <el-table-column label="不上班工资" align="center" prop="" width="90" />
        <el-table-column label="公积金" align="center" prop="seriousIllness" width="130" />
        <el-table-column label="个税" align="center" prop="incomeTax" />
        <el-table-column label="实发工资" align="center" prop="actualSalary" />
        <el-table-column label="考核奖超标" align="center" prop="" width="90" />
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
import {  } from "@/api/wage_manage/overall_query"
import { listDept, listSqua, listElem, listUnit } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Point_salary_count',
  dicts: [
    'query_assess_award_over',
  ],
  components: { searchSelect },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [{}],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        '': null,
        '': dayjs().subtract(1, 'month').format('YYYY-MM'),
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
    // this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listStaff(this.queryParams).then(response => {
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
    // 查询中队方法
    async listSquaFn(queryParams) {
      const { rows, total } = await listSqua({
        ...queryParams,
        deptId: this.queryParams.deptId,
      })

      return { rows, total }
    },
    // 查询分队方法
    async listElemFn(queryParams) {
      const { rows, total } = await listElem({
        ...queryParams,
        squadronId: this.queryParams.squadronId,
      })

      return { rows, total }
    },
    // 查询驻点方法
    async listUnitFn(queryParams) {
      const { rows, total } = await listUnit({
        ...queryParams,
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
      this.download('', {
        ...exportParams
      }, `_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
