<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="截止日期" prop="endDate">
        <el-date-picker
          v-model="queryParams['endDate']"
          type="date"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="保安姓名" prop="securityName">
        <el-input
          v-model="queryParams.securityName"
          placeholder="请输入保安姓名"
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
          filterable
          remote
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
            v-hasPermi="['affairs:staff:exportTrialPeriod']"
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
        <!-- @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }" -->
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" width="170" show-overflow-tooltip />
        <el-table-column label="报道日期" align="center" prop="reportDate" show-overflow-tooltip />
        <el-table-column label="试用开始日期" align="center" prop="trialStartDate" show-overflow-tooltip />
        <el-table-column label="试用结束日期" align="center" prop="trialEndDate" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column label="银行账号" align="center" prop="account" width="170" show-overflow-tooltip />
        <el-table-column label="保险类型" align="center" prop="endowmentInsurance" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['endowmentinsurance']" :value="scope.row.endowmentInsurance"/>
          </template>
        </el-table-column>
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
      title="驻点信息详情"
      width="1255px"
      label-width="106px"
      span="4.5"
      :config="currentConfig"
      :detail="detail"
    />
  </div>
</template>

<script>
import { listTrialPeriod, currentConfig } from "@/api/wage_manage/guard_manage"
import { listDept } from "@/api/wage_manage/query"
import { listPost } from '@/api/wage_manage/guard_manage'
import searchSelect from '@/views/components/searchSelect.vue'
import DetailDialog from '@/views/components/detailDialog.vue'
import dayjs from 'dayjs'

export default {
  name: 'Trial_expire',
  dicts: [
    'securitylevel',
    'query_certificate_type',
    'query_guard_state',
    'sys_user_sex',
    'marriage',
    'nation',
    'education',
    'politicaloutlook',
    'discharge',
    'qualification',
    'query_guard_photo',
    'recordproof',
    'domicile',
    'endowmentinsurance',
    'retirementcertificate',
    'bank_type',
    'health',
  ],
  components: { searchSelect, DetailDialog },
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
        'endDate': dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        'securityName': null,
        'deptId': null,
        'positionId': null,
      },
      // 详情数据
      currentConfig,
      detail: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listTrialPeriod(this.queryParams).then(response => {
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
    // 查询大队方法
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
      this.download('/affairs/staff/exportTrialPeriod', {
        ...exportParams
      }, `保安当月试用到期表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
