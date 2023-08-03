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
        <el-table-column label="姓名" align="center" prop="" />
        <el-table-column label="性别" align="center" prop="" />
        <el-table-column label="出生日期" align="center" prop="" />
        <el-table-column label="文化程度" align="center" prop="" />
        <el-table-column label="招收工种" align="center" prop="" />
        <el-table-column label="证件号码" align="center" prop="" />
        <el-table-column label="户籍地址" align="center" prop="" />
        <el-table-column label="证号" align="center" prop="" />
        <el-table-column label="户籍性质" align="center" prop="" />
        <el-table-column label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="" />
        <el-table-column label="操作员" align="center" prop="" />
        <el-table-column label="试始日期" align="center" prop="" />
        <el-table-column label="试止日期" align="center" prop="" />
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

    <!-- 添加或修改保安人员管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="Name">
          <el-input v-model="form['Name']" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="" prop="">
          <el-input v-model="form['']" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form['remark']" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import {  } from "@/api//"
import dayjs from 'dayjs'

export default {
  name: 'Insure_sheet_query',
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
        '': null,
        '': dayjs().subtract(1, 'month').format('YYYY-MM'),
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        '': [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
      }
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
