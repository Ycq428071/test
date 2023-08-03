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
          label="deptName"
          option="deptId"
          placeholder="请选择大队"
          clearable
        />
      </el-form-item>
      <el-form-item label="银行类型" prop="bankType">
        <el-select v-model="queryParams['bankType']">
          <el-option label="全部" :value="null"></el-option>
          <el-option
            v-for="item in dict.type['bank_type']"
            :key="item.value"
            :label="item.label"
            :value="+item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否合并" prop="isMerge">
        <el-select v-model="queryParams['isMerge']">
          <el-option
            v-for="item in dict.type['query_no_yes']"
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
        <!-- <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-download"
            @click="''"
            v-hasPermi="['']"
          >导出工资明细</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['salary:employee:exportStaffSalary3']"
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
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="薪水年月" align="center" prop="payday" show-overflow-tooltip />
        <el-table-column label="实发工资" align="center" prop="actualSalary" show-overflow-tooltip />
        <el-table-column label="证件类型" align="center" prop="certificateType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_certificate_type']" :value="scope.row['certificateType']" />
          </template>
        </el-table-column>
        <el-table-column label="身份证号码" align="center" prop="certificateNumber" width="170" show-overflow-tooltip />
        <el-table-column label="银行类型" align="center" prop="bankType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['bank_type']" :value="scope.row['bankType']" />
          </template>
        </el-table-column>
        <el-table-column label="银行账号" align="center" prop="account" width="170" show-overflow-tooltip />
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
import { listCreditCount } from "@/api/wage_manage/overall_query"
import { listDept } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Credit_count',
  components: { searchSelect },
  dicts: [
    'bank_type',
    'query_no_yes',
    'query_certificate_type',
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
        'deptId': null,
        'bankType': null,
        'isMerge': 0,
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
      listCreditCount(this.queryParams).then(response => {
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
      this.download('/salary/employee/exportStaffSalary3', {
        ...exportParams
      }, `信用社统计表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
