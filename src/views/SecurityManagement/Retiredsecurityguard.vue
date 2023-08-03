<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true" @submit.native.prevent>
      <el-form-item label="保安姓名" prop="securityName">
        <el-input
          v-model="queryParams.securityName"
          placeholder="请输入保安姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="退休日期起" prop="startDate">
        <el-date-picker
          v-model="queryParams['startDate']"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="退休日期止" prop="endDate">
        <el-date-picker
          v-model="queryParams['endDate']"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams['status']">
          <el-option
            v-for="item in dict.type['query_guard_state']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
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
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:supply:export']">导出</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" height="calc(100vh - 84px - 60px - 86px - 70px - 56px - 50px)" v-loading="loading" :data="insureList"
        @selection-change="handleSelectionChange" row-class-name="table-row">
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="退休日期" align="center" prop="retirementDate" width="100" show-overflow-tooltip />
        <el-table-column label="出生日期" align="center" prop="birthday" width="100" show-overflow-tooltip />
        <el-table-column label="性别" align="center" prop="sex" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex" />
          </template>
        </el-table-column>
        <el-table-column label="保险号" align="center" prop="insuranceNumber" width="100" show-overflow-tooltip />
        <el-table-column label="社会保障号" align="center" prop="socialSecurityNumber" width="170" show-overflow-tooltip />
        <el-table-column label="参保起始年月" align="center" prop="insureStartTime" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['insureStartTime'], '{y}-{m}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="特困" align="center" prop="isDestitute" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.isdestitute" :value="scope.row.isDestitute" />
          </template>
        </el-table-column>
        <el-table-column label="保险类型" align="center" prop="endowmentInsurance" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.query_insure_type" :value="scope.row.endowmentInsurance" />
          </template>
        </el-table-column>
        <el-table-column label="银行账号" align="center" prop="account" width="170" show-overflow-tooltip />
        <el-table-column label="报道日期" align="center" prop="reportDate" width="100" show-overflow-tooltip />
        <el-table-column label="试用开始日期" align="center" prop="trialStartDate" width="100" show-overflow-tooltip />
        <el-table-column label="试用截止日期" align="center" prop="trialEndDate" width="100" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="所属驻点" align="center" prop="groupName" width="250" show-overflow-tooltip />
        <el-table-column label="户籍地址" align="center" prop="registeredResidenceAddress" show-overflow-tooltip />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
  </div>
</template>

<script>
import { listStaff, exportAPI } from '@/api/SecurityManagement/Retiredsecurityguard.js'
import dayjs from 'dayjs'

export default {
  name: 'Retiredsecurityguard',
  dicts: [
    'query_guard_state',
    'education',
    'sys_user_sex',
    'marriage',
    'nation',
    'politicaloutlook',
    'discharge',
    'health',
    'qualification',
    'securitylevel',
    'recordproof',
    'domicile',
    'endowmentinsurance',
    'retirementcertificate',
    'accidentinsurance',
    'clothingdeposit',
    'joblevel',
    'query_certificate_type',
    'isdestitute',
    'query_insure_type'
  ],
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityName: null,
        status: 0,
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
      },
      // 总条数
      total: 0,
      // 保安保险管理表格数据
      insureList: [],
      // 选中数组
      ids: [],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安保险管理列表 */
    getList() {
      // console.log(this.$route.params.securityId);
      this.loading = true;
      // this.queryParams.securityId = this.$route.params.securityId
      listStaff(this.queryParams).then(response => {
        this.insureList = response.rows;
        this.total = response.total;
        this.loading = false;

      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.securityId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      console.log(this.ids);
    },
    handleExportprobationPeriod() {
      exportAPI(this.ids)
        .then((res) => {
          const fileName = 'xxx'
          const contentType =
            'application/vnd.ms-excel'
          this.exportFile(res, contentType, fileName)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    exportFile(data, type, fileName) {
      const blob = new Blob([data], {
        // type类型后端返回来的数据中会有，根据自己实际进行修改
        // 表格下载为 application/xlsx，压缩包为 application/zip等，
        type: type
      })
      const filename = fileName
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL.createObjectURL(blob)
        // 创建隐藏<a>标签进行下载
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)// 移除dom元素
        window.URL.revokeObjectURL(blobURL)// 释放bolb内存
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // console.log(this.$refs.searchSelect.row)
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleMouseEnter(row) {
      // 鼠标移入事件处理
      return {
        color: '#000'
      };

    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/staff/exportRetireStaff', {
        ...exportParams
      }, `退休保安表_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .table-row:hover {
  color: #606266 !important;
}
</style>