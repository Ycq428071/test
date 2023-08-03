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
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:staff:exportOver60Staff']">导出</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="insureList"
        height="calc(100vh - 244px - 106px - 56px)"
      >
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
import { listStaff } from '@/api/SecurityManagement/reminder60.js'
export default {
  name: 'Reminder60',
  dicts: ['education', 'query_certificate_type', 'politicaloutlook', 'discharge', 'health', 'securitylevel', 'query_guard_state'],
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityName: '',
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
      this.loading = true;
      listStaff(this.queryParams).then(response => {
        this.insureList = response.rows;
        this.total = response.total;
        this.loading = false;

      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/staff/exportOver60Staff', {
        ...exportParams
      }, `保安60岁提醒表_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>

<style></style>