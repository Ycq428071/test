<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="保安姓名" prop="securityName">
        <el-input
          v-model="queryParams.securityName"
          placeholder="请输入保安姓名"
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
          clearable
        />
      </el-form-item>
      <el-form-item label="所属岗位" prop="positionId">
        <search-select
          v-model="queryParams.positionId"
          :listFn="listPostFn"
          label="positionName"
          option="groupPositionId"
          placeholder="请选择岗位"
          filterable
          remote
          clearable
        />
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
            v-hasPermi="['affairs:staff:exportNoAccount']"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="staffList"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <!-- @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }" -->
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" width="170" show-overflow-tooltip />
        <!-- <el-table-column label="银行账号" align="center" prop="account" width="170" /> -->
        <el-table-column label="报到日期" align="center" prop="reportDate" width="100" show-overflow-tooltip />
        <el-table-column label="试始日期" align="center" prop="trialStartDate" width="100" show-overflow-tooltip />
        <el-table-column label="试止日期" align="center" prop="trialEndDate" width="100" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column label="户籍地址" align="center" prop="registeredResidenceAddress" show-overflow-tooltip />
        <el-table-column label="修改时间" align="center" prop="updateTime" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['updateTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />

        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:staff:edit']"
            >修改</el-button>
            <!-- <el-button
              size="mini"
              type="text"
              v-hasPermi="['']"
              @click="$refs.logDialog.openFn({ securityId: scope.row.securityId })"
            >
              变更记录
            </el-button> -->
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


    <!-- 添加或修改保安人员管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="试始日期" prop="trialStartDate">
          <el-date-picker
            v-model="form.trialStartDate"
            type="date"
            placeholder="请选择试始日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="试止日期" prop="trialEndDate">
          <el-date-picker
            v-model="form.trialEndDate"
            type="date"
            placeholder="请选择试止日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 变更记录弹窗 -->
    <log-dialog
      ref="logDialog"
      title="保安变更浏览"
      height="calc(100vh - 370px)"
      :columns="staffLogColumns"
      :listFn="logFn"
    />

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="保安信息详情"
      width="1250px"
      label-width="106px"
      span="4.5"
      :config="trialDateConfig"
      :detail="detail"
    />
  </div>
</template>

<script>
import { listNoAccount, trialDateConfig  } from "@/api/wage_manage/guard_manage"
import { updateStaff } from "@/api/wage_manage/staff"
import { staffLog, staffLogColumns } from "@/api/wage_manage/log"
import { listDept } from "@/api/wage_manage/query"
import { listPost } from '@/api/wage_manage/guard_manage'
import searchSelect from '@/views/components/searchSelect.vue'
import logDialog from '@/views/components/logDialog.vue'
import DetailDialog from '@/views/components/detailDialog.vue'

export default {
  name: 'Trial_date',
  dicts: [
    'securitylevel',
    'query_certificate_type',
    'query_guard_state',
    'sys_user_sex',
    'marriage',
    'nation',
    'education',
    'politicaloutlook',
    'discharge',
    'qualification',
    'query_guard_photo',
    'recordproof',
    'domicile',
    'endowmentinsurance',
    'retirementcertificate',
    'bank_type',
    'health',
  ],
  components: { searchSelect, logDialog, DetailDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 保安人员管理表格数据
      staffList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityName: null,
        deptId: null,
        positionId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        trialStartDate: [
          { required: true, message: "请选择试始日期", trigger: "change" }
        ],
        trialEndDate: [
          { required: true, message: "请输入试止日期", trigger: "change" }
        ],
      },
      // 变更记录
      staffLogColumns,
      // 详情数据
      trialDateConfig,
      detail: {},
    };
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询保安人员管理列表 */
    getList() {
      this.loading = true;
      listNoAccount(this.queryParams).then(response => {
        this.staffList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
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
    // 查询岗位方法
    async listPostFn(queryParams) {
      const { rows, total } = await listPost({
        ...queryParams,
        positionStatus: 0
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
        securityId: null,
        trialStartDate: null,
        trialEndDate: null,
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      for(let k in this.form) {
        this.form[k] = row[k]
      }
      this.open = true
      this.title = "修改保安账号"
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.securityId != null) {
            updateStaff(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            })
          }
        }
      });
    },


    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/staff/exportNoAccount', {
        ...exportParams
      }, `账号设置表_${new Date().getTime()}.xlsx`)
    },

    // 查看保安变更记录
    async logFn(queryParams) {
      const { rows, total } = await staffLog(queryParams)

      return { rows, total }
    },
  }
};
</script>
