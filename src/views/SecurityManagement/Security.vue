<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label-width="80px" label="保安姓名" prop="securityName">
        <el-input v-model="queryParams.securityName" placeholder="请输入保安姓名" clearable @keyup.enter.native="handleQuery" />
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
      <el-form-item label="所属岗位" prop="positionId">
        <search-select
          v-model="queryParams.positionId"
          :listFn="listPostFn"
          label="positionName"
          option="groupPositionId"
          placeholder="请选择岗位"
          filterable
          remote
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams['status']">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in dict.type['query_guard_state']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
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
          <el-button type="primary" icon="el-icon-plus" @click="$router.push('/SecurityManagement/Security-add/index/0')"
            v-hasPermi="['affairs:staff:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            @click="handleImport"
            v-hasPermi="['affairs:staff:import']"
          >导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:staff:export']">导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        height="calc(100vh - 244px - 106px - 56px)"
        v-loading="loading"
        :data="staffList"
        @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }"
      >
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" show-overflow-tooltip />
        <el-table-column label="状态" align="center" prop="status" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_guard_state']" :value="scope.row['status']" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text"
              v-if="scope.row.status !== 2"
              @click="$router.push('/SecurityManagement/Security-add/index/' + scope.row.securityId)"
              v-hasPermi="['affairs:staff:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:staff:edit']">删除</el-button>
            <el-dropdown size="mini" v-hasPermi="[
              'affairs:staff:edit',
              'affairs:staff:staffDepart',
              'affairs:staffLog:list',
            ]">
              <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="scope.row.status === 0"
                  @click.native="resetFn(scope.row)"
                  v-hasPermi="['affairs:staff:edit']"
                >待岗</el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status !== 2"
                  @click.native="dimission(scope.row)"
                  v-hasPermi="['affairs:staff:staffDepart']"
                >离职</el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status === 2"
                  @click.native="reboardingDate(scope.row)"
                  v-hasPermi="['affairs:staff:edit']"
                >重新入职</el-dropdown-item>
                <el-dropdown-item
                  @click.native="$refs.logDialog.openFn({ securityId: scope.row.securityId })"
                  v-hasPermi="['affairs:staffLog:list']"
                >变更记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>

    <!-- 离职 -->
    <el-dialog v-dialogDrag title="离职" :visible.sync="dialogVisible" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="离职日期" prop="resignationTime">
          <el-date-picker
            v-model="form.resignationTime"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%" 
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="departStaffFn(2)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 重新入职 -->
    <el-dialog v-dialogDrag title="重新入职" :visible.sync="reboardingDatedialogVisible" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="所属岗位" prop="positionId">
          <search-select
            v-model="form.positionId"
            :listFn="listPostFn"
            label="positionName"
            option="groupPositionId"
            placeholder="请选择岗位"
            filterable
            remote
          />
        </el-form-item>
        <el-form-item label="入职日期" prop="reRegisterDate">
          <el-date-picker
            v-model="form.reRegisterDate"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%" 
          />
        </el-form-item>
        <el-form-item label="试用开始日期" prop="trialStartDate">
          <el-date-picker
            v-model="form.trialStartDate"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%" 
          />
        </el-form-item>
        <el-form-item label="试用截止日期" prop="trialEndDate">
          <el-date-picker
            v-model="form.trialEndDate"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%" 
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reboardingDatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dimissionareYouSure(0)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog v-dialogDrag :title="upload.title" :visible.sync="upload.open" width="400px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="保安详情"
      width="1220px"
      label-width="100px"
      span="4.5"
      :config="secuConfig"
      :detail="detail"
      :dict="dict"
    />

    <!-- 变更记录 -->
    <log-dialog
      ref="logDialog"
      title="变更记录"
      height="calc(100vh - 370px)"
      :columns="secuColumns"
      :listFn="logFn"
      :dict="dict"
    />
  </div>
</template>

<script>
import {  updateStaff, departStaff, secuConfig, secuColumns } from "@/api/SecurityManagement/Security.js";
import { listDept } from "@/api/wage_manage/query"
import { listPost } from '@/api/wage_manage/guard_manage'
import { listStaff, changeHistory } from "@/api/SecurityManagement/Security.js";
import { getToken } from "@/utils/auth"
import logDialog from '@/views/components/logDialog.vue'
import searchSelect from '@/views/components/searchSelect.vue';
import DetailDialog from '@/views/components/detailDialog.vue'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export default {
  dicts: [
    'sys_user_sex',
    'marriage',
    'nation',
    'education',
    'politicaloutlook',
    'discharge',
    'health',
    'qualification',
    'securitylevel',
    'domicile',
    'endowmentinsurance',
    'accidentinsurance',
    'joblevel',
    'bank_type',
    'query_certificate_type',
    'query_guard_state',
  ],
  name: "Security",
  components: { searchSelect, DetailDialog, logDialog },
  data() {
    return {
      // 详情数据
      detail: {},
      secuConfig,
      // 变更记录
      secuColumns,
      // 表单校验
      rules: {
        positionId: [
          { required: true, message: "所属岗位不能为空", trigger: "change" }
        ],
        reRegisterDate: [
          { required: true, message: "入职日期不能为空", trigger: "blur" }
        ],
        trialStartDate: [
          { required: true, message: "试用开始日期不能为空", trigger: "blur" }
        ],
        trialEndDate: [
          { required: true, message: "试用截止日期不能为空", trigger: "blur" }
        ],
        resignationTime: [
          { required: true, message: "离职日期不能为空", trigger: "blur" }
        ],
      },
      list: [],
      reboardingDatedialogVisible: false,
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
        status: 0,
        positionId: null,
      },
      // 重新入职表单
      form: {},
      dialogVisible: false,

      // 保安导入参数
      upload: {
        // 是否显示弹出层（保安导入）
        open: false,
        // 弹出层标题（保安导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/staff/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  watch: {
    $route(route) {
      if(route.name === 'Security') this.getList()
    },
    'form.reRegisterDate': {
      handler(val) {
        if(this.flag) return
        const months = dayjs(val).endOf('month').diff(val, 'day') >= 15 ? 2 : 3

        this.form.trialStartDate = val
        this.form.trialEndDate = dayjs(val).add(months, 'month').endOf('month').format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    // 查询大队方法
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

    /** 查询保安人员管理列表 */
    getList() {
      this.loading = true;
      listStaff(this.queryParams).then(response => {
        this.staffList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除该保安人员？').then(function () {
        return updateStaff({ securityId: row.securityId, status: 3 });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    resetFn(row) {
      this.$prompt('请输入备注', '待岗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        console.log()
        this.$modal.confirm('是否确认将该保安人员转为待岗？').then(function () {
          return updateStaff({ securityId: row.securityId, status: 1, groupId: 0, positionId: 0, remark: value })
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess("转为待岗成功")
        }).catch(() => { })
      }).catch(() => {})
    },
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/staff/export', {
        ...exportParams
      }, `保安表_${new Date().getTime()}.xlsx`)
    },
    // 查看保安变更记录
    async logFn(queryParams) {
      const { rows, total } = await changeHistory(queryParams)

      return { rows, total }
    },

    // 表单重置
    reset() {
      const months = dayjs().endOf('month').diff(dayjs(), 'day') >= 15 ? 2 : 3
      this.form = {
        'securityId': null,
        'status': null,
        'positionId': null,
        'reRegisterDate': dayjs().format('YYYY-MM-DD'),
        'trialStartDate': dayjs().format('YYYY-MM-DD'),
        'trialEndDate': dayjs().add(months, 'month').endOf('month').format('YYYY-MM-DD'),
        'remark': null,
      }
      this.resetForm('form')
    },
    // 重新入职
    reboardingDate(row) {
      this.reset()
      this.form.securityId = row.securityId
      this.form.status = 0
      this.reboardingDatedialogVisible = true
    },
    dimissionareYouSure(status) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateStaff({ ...this.form, status }).then(response => {
            this.$modal.msgSuccess('重新入职成功');
            this.dialogVisible = false
            this.getList();
            this.reboardingDatedialogVisible = false
          });
        }
      })
    },
    // 离职
    dimission(row) {
      this.resetForm('form')
      this.form = {}
      this.form.securityId = row.securityId
      this.resignationTime = dayjs().format('YYYY-MM-DD'),
      this.dialogVisible = true
    },
    departStaffFn(status) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          departStaff({ ...this.form, status }).then(response => {
            this.$modal.msgSuccess('离职成功');
            this.dialogVisible = false
            this.getList();
            this.reboardingDatedialogVisible = false
          });
        }
      })
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "保安导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/staff/exportTemplate', {
      }, `保安导入模板_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
  }
};
</script>
