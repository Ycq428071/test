<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="驻点名称" prop="groupName">
        <el-input
          v-model="queryParams['groupName']"
          placeholder="请输入驻点名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="复核标记" prop="reviewedStatus">
        <el-select v-model="queryParams['reviewedStatus']">
          <el-option label="全部" :value="null"></el-option>
          <el-option
            v-for="item in dict.type['query_review_sign']"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-popover
        popper-class="gl-search_popover"
        placement="bottom"
        trigger="click"
      >
        <el-form :model="queryParams" ref="queryFormMore" :inline="true" class="gl-search_form">
          <el-form-item label="客户类型" prop="customerType">
            <el-select v-model="queryParams['customerType']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['query_client_type']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提供住宿" prop="accommodate">
            <el-select v-model="queryParams['accommodate']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['query_offer_house']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作性质" prop="jobNature">
            <el-select v-model="queryParams['jobNature']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['query_work_nature']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="管理性质" prop="managementNature">
            <el-select v-model="queryParams['managementNature']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['query_manage_nature']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>
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
            type="success"
            icon="el-icon-edit"
            :disabled="allChecked"
            @click="handleReview(1)"
            v-hasPermi="['']"
          >复核</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="allUnchecked"
            @click="handleReview(0)"
            v-hasPermi="['']"
          >消复核</el-button>
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
        @selection-change="handleSelectionChange"
        height="calc(100vh - 244px - 106px - 56px)"
        @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="驻点名称" align="center" prop="groupName" width="250" />
        <el-table-column label="超时补贴" align="center" prop="overtimeAllowance" />
        <el-table-column label="餐费" align="center" prop="mealExpenses" />
        <el-table-column label="考核工资" align="center" prop="assessmentSalary" />
        <el-table-column label="岗位补贴" align="center" prop="jobSubsidies" />
        <el-table-column label="合同超时补贴" align="center" prop="contractOverTimeAllowance" width="100" />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" />
        <!-- <el-table-column label="驻点电话" align="center" prop="phone" />
        <el-table-column label="地址" align="center" prop="address" show-overflow-tooltip /> -->
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type['status']" :value="scope.row['status']" />
          </template>
        </el-table-column>
        <el-table-column label="缺员加班" align="center" prop="shorthandedOvertime" />
        <el-table-column label="编制人数" align="center" prop="headcount" />
        <el-table-column label="负责人" align="center" prop="headName" />
        <el-table-column label="客户联系电话" align="center" prop="customerTelephone" width="100" />
        <el-table-column label="客户联系人" align="center" prop="customer" width="90" />
        <el-table-column label="客户类型" align="center" prop="customerType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_client_type']" :value="scope.row['customerType']" />
          </template>
        </el-table-column>
        <el-table-column label="提供住宿" align="center" prop="accommodate">
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_offer_house']" :value="scope.row['accommodate']" />
          </template>
        </el-table-column>
        <el-table-column label="工作性质" align="center" prop="jobNature">
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_work_nature']" :value="scope.row['jobNature']" />
          </template>
        </el-table-column>
        <el-table-column label="管理性质" align="center" prop="managementNature">
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_manage_nature']" :value="scope.row['managementNature']" />
          </template>
        </el-table-column>
        <el-table-column label="复核人" align="center" prop="reviewedBy" />
        <el-table-column label="复核日期" align="center" prop="reviewedTime" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['createTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="updateTime" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['updateTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" width="110">
          <template slot-scope="scope">
            <el-button
              v-if="+scope.row.reviewedStatus === 0"
              size="mini"
              type="text"
              @click="handleReview(1, scope.row)"
              v-hasPermi="['']"
            >复核</el-button>
            <el-button
              v-else
              size="mini"
              type="text"
              @click="handleReview(0, scope.row)"
              v-hasPermi="['']"
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
      <div v-show="total<=0" style="height: 50px"></div>
    </div>

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="驻点信息详情"
      width="940px"
      label-width="106px"
      span="4.5"
      :config="allowanceConfig"
      :detail="detail"
    />
  </div>
</template>

<script>
import { allowanceConfig, listGroupSubsidy, reviewGroup } from "@/api/wage_manage/guard_manage"
import { listElem } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'
import DetailDialog from '@/views/components/detailDialog.vue'

export default {
  name: 'Allowance_review',
  dicts: [
    'status',
    'query_client_type',
    'query_offer_house',
    'query_work_nature',
    'query_manage_nature',
    'query_review_sign',
  ],
  components: { searchSelect, DetailDialog },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
        'groupName': null,
        'unitId': null,
        'reviewedStatus': '0',
        'status': '0',
        'customerType': null,
        'accommodate': null,
        'jobNature': null,
        'managementNature': null,
      },
      // 详情数据
      allowanceConfig,
      detail: {},
    }
  },
  computed: {
    // 选中的全是复核的
    allChecked() {
      if(this.ids.length === 0) {
        return true
      } else {
        return !this.tableList
          .filter(item => this.ids.includes(item.groupId))
          .every(item => item.reviewedStatus === 0)
      }
    },
    // 选中的全是未复核的
    allUnchecked() {
      if(this.ids.length === 0) {
        return true
      } else {
        return !this.tableList
        .filter(item => this.ids.includes(item.groupId))
        .every(item => item.reviewedStatus === 1)
      }
    },
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listGroupSubsidy(this.queryParams).then(response => {
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
    // 查询分队方法
    async listElemFn(queryParams) {
      const { rows, total } = await listElem({
        ...queryParams,
        squadronId: this.queryParams.squadronId,
      })

      return { rows, total }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item['groupId'])
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 复核按钮操作 */
    handleReview(reviewedStatus, row) {
      const ids = row && [row.groupId] || this.ids
      const operate = reviewedStatus === 1 ? '复核' : '消复核'
      this.$modal.confirm('是否确认' + operate + '该驻点？').then(function() {
        return reviewGroup({ groupIds: ids, reviewedStatus })
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
      this.download('/affairs/unit/exportGroupSubsidySettings', {
        ...exportParams
      }, `驻点补贴表_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
