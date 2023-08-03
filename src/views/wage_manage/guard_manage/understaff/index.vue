<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
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
      <!-- <el-form-item label="所属岗位" prop="positionId">
        <search-select
          v-model="queryParams.positionId"
          :listFn="listPostFn"
          label="positionName"
          option="groupPositionId"
          placeholder="请选择岗位"
          filterable
          remote
        />
      </el-form-item> -->

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
            v-hasPermi="['salary:employee:exportGroupShorthanded']"
          >导出</el-button>
        </el-col>
      </el-row>

        <!-- v-loadmore="pushFn" -->
      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="tableList" 
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <!-- @cell-dblclick="(row) => { if(!row.groupId) return; detail = row; $refs.detail.openFn() }" -->
        <el-table-column label="岗位名称" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column label="缺员加班" align="center" prop="shorthandedOvertime" show-overflow-tooltip />
        <el-table-column label="岗位人数" align="center" prop="positionNumber" show-overflow-tooltip />
        <el-table-column label="实际人数" align="center" prop="actualPeople" show-overflow-tooltip />
        <el-table-column label="缺员人数" align="center" prop="shortHandedCount" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="状态" prop="positionStatus" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_post_type']" :value="scope.row['positionStatus']" />
          </template>
        </el-table-column>
        <!-- 注销、变更、正常、空 空和注销时无法修改 -->
        <el-table-column label="客户类型" align="center" prop="customerType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.query_client_type" :value="scope.row.customerType" />
          </template>
        </el-table-column>
        <el-table-column label="工作性质" align="center" prop="jobNature" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.query_work_nature" :value="scope.row.jobNature" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" prop="createTime" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['createTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="updateTime" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['updateTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope" v-if="scope.row.groupId">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:position:edit']"
            >修改</el-button>
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

    <!-- 修改对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="缺员加班" prop="shorthandedOvertime">
          <el-input-number
            class="ipt-number"
            placeholder="请输入缺员加班"
            v-model="form['shorthandedOvertime']"
            :controls="false"
          />
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

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="驻点详情"
      width="940px"
      label-width="106px"
      span="4.5"
      :config="understaffConfig"
      :detail="detail"
      :dict="dict"
    />
  </div>
</template>

<script>
import { listDept, listUser } from "@/api/wage_manage/query"
import { listPost } from '@/api/wage_manage/guard_manage'
import { listUnderstaff, updatePost, understaffConfig } from "@/api/wage_manage/guard_manage"
import searchSelect from '@/views/components/searchSelect.vue'
import DetailDialog from '@/views/components/detailDialog.vue'

export default {
  name: "Understaff",
  dicts: [
    'status',
    'query_client_type',
    'query_offer_house',
    'query_work_nature',
    'query_manage_nature',
    'query_timeout_subsidy',
    'query_post_type',
  ],
  components: { searchSelect, DetailDialog },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      largeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        'positionName': null,
        // 'positionId': null,
        'deptId': null,
        'positionStatus': 0,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // '': [
        //   { required: true, message: "缺员加班不能为空", trigger: "blur" }
        // ],
      },
      // 详情
      understaffConfig,
      detail: {}
    }
  },

  created() {
    this.getList()
  },

  // directives: {
  //   /*** 滚动加载的自定义指令*/
  //   loadmore: {
  //     bind(el, binding) {
  //       const selectWrap = el.querySelector('.el-table__body-wrapper')
  //       selectWrap.addEventListener('scroll', function () {
  //         if (this.scrollHeight - this.scrollTop <= this.clientHeight + 5) {
  //           binding.value()
  //         }
  //       })
  //     },
  //   },
  // },

  methods: {
    /** 查询保安人员管理列表 */
    getList() {
      this.largeList = []
      this.tableList = []
      this.loading = true;
      listUnderstaff(this.queryParams).then(response => {
        // this.largeList = response.data
        // this.total = response.data.length
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
        // this.pushFn()
      })
    },
    // // 滚动加载函数
    // pushFn() {
    //   if(this.tableList.length >= this.total) return
    //   const i = this.tableList.length
    //   this.tableList.push(...this.largeList.slice(i, i + 10))
    // },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询岗位方法
    async listPostFn(queryParams) {
      const { rows, total } = await listPost({
        ...queryParams,
        positionStatus: 0
      })

      return { rows, total }
    },
    // 查询驻点负责人方法
    async listUserFn(queryParams) {
      const { rows, total } = await listUser({
        ...queryParams,
        deptId: this.queryParams.deptId,
      })

      return { rows, total }
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        groupPositionId: null,
        shorthandedOvertime: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = { ...row }
      this.open = true
      this.title = "修改缺员加班"
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.groupPositionId != null) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('/salary/manage/exportGroupShorthanded', {
        ...this.queryParams
      }, `驻点缺员加班表_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
