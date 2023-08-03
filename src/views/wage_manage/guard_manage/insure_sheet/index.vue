<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="查询月份" prop="">
        <el-date-picker
          v-model="queryParams['']"
          type="month"
          value-format="yyyy-MM"
        >
        </el-date-picker>
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
            v-hasPermi="['']"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="loading"
        :data="tableList"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column label="本地农基" align="center" prop="" />
        <el-table-column label="本地农双" align="center" prop="" />
        <el-table-column label="本地农单" align="center" prop="" />
        <el-table-column label="本地农自" align="center" prop="" />
        <el-table-column label="本地非基" align="center" prop="" />
        <el-table-column label="本地非双" align="center" prop="" />
        <el-table-column label="本地非单" align="center" prop="" />
        <el-table-column label="本地非自" align="center" prop="" />
        <el-table-column label="外地农基" align="center" prop="" />
        <el-table-column label="外地农双" align="center" prop="" />
        <el-table-column label="外地农单" align="center" prop="" />
        <el-table-column label="外地农自" align="center" prop="" />
        <el-table-column label="外地非基" align="center" prop="" />
        <el-table-column label="外地非双" align="center" prop="" />
        <el-table-column label="外地非单" align="center" prop="" />
        <el-table-column label="外地非自" align="center" prop="" />
        <el-table-column label="试用本地一月农" align="center" prop="" width="111" />
        <el-table-column label="试用本地一月非" align="center" prop="" width="111" />
        <el-table-column label="试用本地二月农" align="center" prop="" width="111" />
        <el-table-column label="试用本地二月非" align="center" prop="" width="111" />
        <el-table-column label="试用本地三月农" align="center" prop="" width="111" />
        <el-table-column label="试用本地三月非" align="center" prop="" width="111" />
        <el-table-column label="试用外地一月农" align="center" prop="" width="111" />
        <el-table-column label="试用外地一月非" align="center" prop="" width="111" />
        <el-table-column label="试用外地二月农" align="center" prop="" width="111" />
        <el-table-column label="试用外地二月非" align="center" prop="" width="111" />
        <el-table-column label="试用外地三月农" align="center" prop="" width="111" />
        <el-table-column label="试用外地三月非" align="center" prop="" width="111" />
        <el-table-column label="其他" align="center" prop="" />
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
// import { listStaff, getStaff, delStaff, addStaff, updateStaff } from "@/api//"
import dayjs from 'dayjs'

export default {
  name: 'Insure_sheet',
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        '': null,
        '': dayjs().subtract(1, 'month').format('YYYY-MM'),
      },
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
      this.handleQuery()
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('', {
        ...this.queryParams
      }, `_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
