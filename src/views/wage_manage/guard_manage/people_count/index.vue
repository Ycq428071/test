<template>
  <div class="app-container">
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
        height="calc(100vh - 244px - 56px)"
      >
        <el-table-column label="所属分队" align="center" prop="unitName" width="110" />
        <el-table-column label="负责人" align="center" prop="head" />
        <el-table-column label="管理人数" align="center" prop="headCount" />
        <el-table-column label="工资年月" align="center" prop="payday" />
        <el-table-column label="有工资人数" align="center" prop="hadSalaryHeadCount" />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" />
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
import { listPeopleCount } from "@/api/wage_manage/guard_manage"
import dayjs from 'dayjs'

export default {
  name: 'People_count',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        payday: dayjs().subtract(1, 'month').format('YYYY-MM'),
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询保安人员管理列表 */
    getList() {
      this.loading = true
      listPeopleCount(this.queryParams).then(response => {
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
      this.download('/salary/manage/exportUnitHeadCount', {
        ...this.queryParams
      }, `分队管理人数统计表_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
