<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="保安姓名" prop="securityName">
        <el-input v-model="queryParams.securityName" placeholder=""></el-input>
      </el-form-item>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExportprobationPeriod"
            v-hasPermi="['affairs:staff:export']">导出</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" v-loading="loading" :data="insureList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <!-- <el-table-column label="证件类型" align="center" prop="certificateType">
        </el-table-column> -->
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
        <el-table-column label="政治面貌" align="center" prop="politicalOutlook" show-overflow-tooltip />
        <el-table-column label="退伍" align="center" prop="discharge" show-overflow-tooltip />
        <el-table-column label="健康状况" align="center" prop="health" show-overflow-tooltip />
        <el-table-column label="保安级别" align="center" prop="securityLevel" show-overflow-tooltip />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />

    </div>
  </div>
</template>

<script>
import { exportprobationPeriodAPI } from "@/api/SecurityManagement/Security.js";

import { theCurrentMonthsTrialExpires } from '@/api/SecurityManagement/insure.js'
export default {
  name: 'Probationperiod',
  dicts: ['education', 'query_guard_state'],
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
      theCurrentMonthsTrialExpires(this.queryParams).then(response => {
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
      exportprobationPeriodAPI(this.ids)
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
  }
}
</script>

<style></style>