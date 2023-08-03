<template>
  <div class="app-container">
    <!-- <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="保安姓名" prop="securityName">
        <el-input v-model="queryParams.securityName" placeholder=""></el-input>
      </el-form-item>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->
    <div class="gl-body">
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" v-loading="loading" :data="insureList" @selection-change="handleSelectionChange" height="calc(100vh - 244px)">
        <el-table-column label="过期天数" align="center" prop="expirationDays" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="提醒内容" align="center" prop="remindContent" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="应收金额" align="center" prop="paymentDueMoney" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="应收备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="合同人数" align="center" prop="groupNumber" show-overflow-tooltip />
        <el-table-column label="过期日期" align="center" prop="expireDate" show-overflow-tooltip />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
  </div>
</template>

<script>
import { reminderOfPaymentDue } from '@/api/Stationary/Reminder/duereminder.js'
export default {
  dicts: ['education'],
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
      reminderOfPaymentDue(this.queryParams).then(response => {
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
  }
}
</script>

<style></style>