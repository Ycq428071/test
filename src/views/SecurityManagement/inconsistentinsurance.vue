<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="保安姓名" prop="securityName">
        <el-input v-model="queryParams.securityName" placeholder="请输入保安姓名"></el-input>
      </el-form-item>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <!-- <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <router-link to="/SecurityManagement/insure-add/index/0">
            <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd"
              v-hasPermi="['affairs:insure:add']">新增</el-button>
          </router-link>
        </el-col>
        <el-col :span="1.5">
          <el-button plain icon="el-icon-s-operation" @click="contractBase"
            v-hasPermi="['affairs:insure:export']">保险基数调整</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" @click="suspensionOfCoveragehandleExport"
            v-hasPermi="['affairs:insure:export']">保险停保导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:insure:export']">导出</el-button>
        </el-col>
      </el-row> -->
    <div class="gl-body">
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" v-loading="loading" :data="insureList" @selection-change="handleSelectionChange" height="calc(100vh - 244px - 106px)">
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="证件类型" align="center" prop="certificateType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_certificate_type']" :value="scope.row['certificateType']" />
          </template>
        </el-table-column>
        <el-table-column label="证件号码" align="center" prop="certificateNumber" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_guard_state']" :value="scope.row['status']" />
          </template>
        </el-table-column>
        <el-table-column label="文化程度" align="center" prop="education" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.education" :value="scope.row.education" />
          </template>
        </el-table-column>
        <el-table-column label="政治面貌" align="center" prop="politicalOutlook" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['politicaloutlook']" :value="scope.row['politicalOutlook']" />
          </template>
        </el-table-column>
        <el-table-column label="退伍" align="center" prop="discharge" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['discharge']" :value="scope.row['discharge']" />
          </template>
        </el-table-column>
        <el-table-column label="健康状况" align="center" prop="health" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['health']" :value="scope.row['health']" />
          </template>
        </el-table-column>
        <el-table-column label="保安级别" align="center" prop="securityLevel" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['securitylevel']" :value="scope.row['securityLevel']" />
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
  </div>
</template>

<script>
import { inconsistentInsuranceTypes } from '@/api/SecurityManagement/insure.js'
export default {
  name: 'Inconsistentinsurance',
  dicts: [
    'education', 'query_certificate_type', 'politicaloutlook', 'discharge', 'health', 'securitylevel',
    'query_guard_state'
  ],
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityName: ''
      },
      // 总条数
      total: 0,
      // 保安保险管理表格数据
      insureList: [],
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
      inconsistentInsuranceTypes(this.queryParams).then(response => {
        this.insureList = response.rows;
        this.total = response.total;
        this.loading = false;

      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.insureId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
  }
}
</script>

<style></style>