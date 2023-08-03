<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="工资年月" prop="">
        <el-date-picker
          v-model="queryParams['']"
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
      <el-form-item label="所属驻点" prop="stagnationPointId">
        <search-select
          v-model="queryParams.stagnationPointId"
          :listFn="listUnitFn"
          label="groupName"
          option="groupId"
          placeholder="请选择驻点"
          filterable
          clearable
        />
      </el-form-item>

      <el-popover
        popper-class="gl-search_popover"
        placement="bottom"
        trigger="click"
      >
        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>

        <el-form :model="queryParams" ref="queryFormMore" :inline="true" class="gl-search_form">
          <el-form-item label="保安姓名" prop="securityName">
            <el-input
              v-model="queryParams['securityName']"
              placeholder="请输入保安姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="证件号码" prop="certificateNumber">
            <el-input
              v-model="queryParams['certificateNumber']"
              placeholder="请输入证件号码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-form>
      </el-popover>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            v-hasPermi="['']"
          >生成保安参保没工资信息</el-button>
        </el-col>
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
        <el-table-column label="编号" align="center" prop="" />
        <el-table-column label="保安姓名" align="center" prop="" />
        <el-table-column label="证件号码" align="center" prop="" />
        <el-table-column label="户籍性质" align="center" prop="" />
        <el-table-column label="参保类型" align="center" prop="" />
        <el-table-column label="离职日期" align="center" prop="" />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" />
        <el-table-column label="所属驻点" align="center" prop="groupName" width="250" />
        <el-table-column label="备注" align="center" prop="remark" />
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
import {  } from "@/api/wage_manage/overall_query"
import { listDept, listSqua, listElem, listUnit } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Wo_no_salary',
  components: { searchSelect },
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
      this.resetForm("queryFormMore")
      this.handleQuery()
    },
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询中队方法
    async listSquaFn(queryParams) {
      const { rows, total } = await listSqua({
        ...queryParams,
        deptId: this.queryParams.deptId,
      })

      return { rows, total }
    },
    // 查询分队方法
    async listElemFn(queryParams) {
      const { rows, total } = await listElem({
        ...queryParams,
        squadronId: this.queryParams.squadronId,
      })

      return { rows, total }
    },
    // 查询驻点方法
    async listUnitFn(queryParams) {
      const { rows, total } = await listUnit({
        ...queryParams,
      })

      return { rows, total }
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        'Id': null,
        'Name': null,
      }
      this.resetForm("form")
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加"
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addStaff(this.form).then(response => {
            this.$modal.msgSuccess("新增成功")
            this.open = false
            this.getList()
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(let k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('', {
        ...exportParams
      }, `_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
