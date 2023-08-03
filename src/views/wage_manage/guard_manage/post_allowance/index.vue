<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" class="gl-search_form" @submit.native.prevent>
      <el-form-item label="岗位名称" prop="positionName">
        <el-input
          v-model="queryParams['positionName']"
          placeholder="请输入岗位名称"
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
      <el-form-item label="复核标记" prop="reviewedStatus">
        <el-select v-model="queryParams['reviewedStatus']">
          <el-option label="全部" :value="null"></el-option>
          <el-option
            v-for="item in dict.type['query_review_sign']"
            :key="item.value"
            :label="item.label"
            :value="+item.value">
          </el-option>
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
          <el-button
            type="success"
            icon="el-icon-edit"
            :disabled="allChecked"
            @click="handleReview(1)"
            v-hasPermi="['affairs:unit:groupReviewed']"
          >复核</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="allUnchecked"
            @click="handleReview(0)"
            v-hasPermi="['affairs:unit:groupReviewed']"
          >消复核</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            v-hasPermi="['']"
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
          >导出</el-button>
        </el-col> -->
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column type="selection" width="55" align="center" fixed />
        <el-table-column label="岗位名称" prop="positionName" align="center" width="250" fixed show-overflow-tooltip />
        <el-table-column label="超时补贴" prop="overtimeAllowance" align="center" show-overflow-tooltip />
        <el-table-column label="餐费" prop="mealExpenses" align="center" show-overflow-tooltip />
        <el-table-column label="考核工资" prop="assessmentSalary" align="center" show-overflow-tooltip />
        <el-table-column label="岗位补贴" prop="jobSubsidies" align="center" show-overflow-tooltip />
        <el-table-column label="合同超时补贴" prop="contractOvertimeAllowance" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="状态" prop="positionStatus" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_post_type']" :value="scope.row['positionStatus']" />
          </template>
        </el-table-column>
        <el-table-column label="缺员加班" prop="shorthandedOvertime" align="center" show-overflow-tooltip />
        <el-table-column label="岗位人数" prop="positionNumber" align="center" show-overflow-tooltip />
        <el-table-column label="客户类型" prop="customerType" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_client_type']" :value="scope.row['customerType']" />
          </template>
        </el-table-column>
        <el-table-column label="工作性质" prop="jobNature" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_work_nature']" :value="scope.row['jobNature']" />
          </template>
        </el-table-column>
        <el-table-column label="基本工资" prop="basicSalary" align="center" show-overflow-tooltip />
        <el-table-column label="补足工资" prop="repaySalary" align="center" show-overflow-tooltip />
        <el-table-column label="节假标准" prop="holidayStandards" align="center" show-overflow-tooltip />
        <el-table-column label="加班工资" prop="overtimeWages" align="center" show-overflow-tooltip />
        <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip />
        <el-table-column label="复核人" prop="reviewedBy" align="center" show-overflow-tooltip />
        <el-table-column label="复核时间" prop="reviewedTime" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['reviewedTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['createTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" prop="updateTime" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['updateTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['affairs:position:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-if="+scope.row.reviewedStatus === 0"
              size="mini"
              type="text"
              @click="handleReview(1, scope.row)"
              v-hasPermi="['affairs:unit:groupReviewed']"
            >复核</el-button>
            <el-button
              v-else
              size="mini"
              type="text"
              @click="handleReview(0, scope.row)"
              v-hasPermi="['affairs:unit:groupReviewed']"
            >消复核</el-button>
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
      <div v-show="total<=0" style="height: 50px" />
    </div>

    <!-- 新增或修改对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="span">
            <el-form-item label="岗位名称" prop="positionName">
              <el-input v-model="form['positionName']" placeholder="请输入岗位名称" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="餐费" prop="mealExpenses">
              <el-input-number
                class="ipt-number"
                placeholder="请输入餐费"
                v-model="form['mealExpenses']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="超时补贴" prop="overtimeAllowance">
              <el-input-number
                class="ipt-number"
                placeholder="请输入超时补贴"
                v-model="form['overtimeAllowance']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="岗位补贴" prop="jobSubsidies">
              <el-input-number
                class="ipt-number"
                placeholder="请输入岗位补贴"
                v-model="form['jobSubsidies']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="考核工资" prop="assessmentSalary">
              <el-input-number
                class="ipt-number"
                placeholder="请输入考核工资"
                v-model="form['assessmentSalary']"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form['remark']" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPostAllowance, updatePost, reviewGroup } from '@/api/wage_manage/guard_manage'
import { listDept } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'

export default {
  name: 'Post_allowance',
  components: { searchSelect },
  dicts: [
    'query_review_sign',
    'query_post_type',
    'query_client_type',
    'query_work_nature',
  ],
  data() {
    return {
      // 查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        'positionName': null,
        'deptId': null,
        'reviewedStatus': 0,
        'positionStatus': 0,
      },
      // 列表
      loading: false,
      tableList: [],
      total: 0,
      // 多选
      ids: [],
      single: true,
      multiple: true,
      // 弹出层
      title: '',
      open: false,
      span: 24,
      // 表单参数
      form: {},
      rules: {
        '': [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
      }
    }
  },
  computed: {
    // 选中的全是复核的
    allChecked() {
      if(this.ids.length === 0) {
        return true
      } else {
        return !this.tableList
          .filter(item => this.ids.includes(item.groupPositionId))
          .every(item => item.reviewedStatus === 0)
      }
    },
    // 选中的全是未复核的
    allUnchecked() {
      if(this.ids.length === 0) {
        return true
      } else {
        return !this.tableList
        .filter(item => this.ids.includes(item.groupPositionId))
        .every(item => item.reviewedStatus === 1)
      }
    },
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询大队方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      listPostAllowance(this.queryParams).then(response => {
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
      this.resetForm('queryForm')
      this.resetForm('queryFormMore')
      this.handleQuery()
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        'groupPositionId': null,
        'positionName': null,
        'mealExpenses': null,
        'overtimeAllowance': null,
        'jobSubsidies': null,
        'assessmentSalary': null,
        'remark': null,
      }
      this.resetForm('form')
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item['groupPositionId'])
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = { ...row }
      this.title = '修改岗位补贴'
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form['groupPositionId'] != null) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 复核按钮操作 */
    handleReview(reviewedStatus, row) {
      const ids = row && [row.groupPositionId] || this.ids
      const operate = reviewedStatus === 1 ? '复核' : '消复核'
      this.$modal.confirm('是否确认' + operate + '已选中岗位补贴？').then(function() {
        return reviewGroup({ positionIds: ids, reviewedStatus })
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess(operate + "成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('', {
        ...exportParams
      }, `_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>
