<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="工资年月" prop="payday">
        <el-date-picker
          v-model="queryParams['payday']"
          type="month"
          placeholder="请选择月份"
          :clearable="false"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="姓名" prop="securityName">
        <el-input
          v-model="queryParams['securityName']"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="证件号码" prop="certificateNumber">
        <el-input
          v-model="queryParams['certificateNumber']"
          placeholder="请输入证件号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="保险类型" prop="insuranceType">
        <el-select v-model="queryParams['insuranceType']">
          <!-- <el-option label="全部" :value="null" /> -->
          <el-option
            v-for="item in dict.type['query_insure_type']"
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
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['salary:employee:exportStaffInsureByInsuranceType']"
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
        <el-table-column label="保安姓名" align="center" prop="staffName" show-overflow-tooltip />
        <el-table-column label="薪水年月" align="center" prop="salaryYear" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="identificationNumber" show-overflow-tooltip />
        <el-table-column label="养老险基数" align="center" prop="pensionInsuranceBase" show-overflow-tooltip />
        <el-table-column label="意外险" align="center" prop="accidentInsurance" show-overflow-tooltip />
        <el-table-column label="公积金基数" align="center" prop="providentFundBase" show-overflow-tooltip />
        <el-table-column label="医疗保险基数" align="center" prop="medicalInsuranceBase" show-overflow-tooltip />
        <el-table-column label="个税" align="center" prop="personalIncomeTax" show-overflow-tooltip />
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
import { listNoInsure } from "@/api/wage_manage/overall_query"
import dayjs from 'dayjs'

export default {
  name: 'No_insure',
  dicts: [
    'query_insure_type',
  ],
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
        'securityName': null,
        'insuranceType': 1,
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
      listNoInsure(this.queryParams).then(response => {
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

    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(let k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/salary/employee/exportStaffInsureByInsuranceType', {
        ...exportParams
      }, `保安当月工资无保险表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
