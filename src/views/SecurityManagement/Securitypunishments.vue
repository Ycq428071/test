<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="奖惩人员" prop="securityId">
        <search-select v-model="queryParams.securityId" :listFn="listStaffFn"
          label="securityName" option="securityId" placeholder="请选择保安"
          filterable clearable />
      </el-form-item>
      <el-form-item label="奖惩类型" prop="rewardPunishType">
        <el-select v-model="queryParams.rewardPunishType" placeholder="请选择">
          <el-option v-for="dict in dict.type.rewardpunishtype" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)" @keyup.enter.native="handleQuery"></el-option>
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
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
            v-hasPermi="['affairs:rewardPunish:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            @click="handleImport"
            v-hasPermi="['affairs:rewardPunish:import']"
          >导入</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" v-loading="loading" :data="rewardPunishList" height="calc(100vh - 244px - 106px - 56px)">
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="奖惩类型" align="center" prop="rewardPunishType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.rewardpunishtype" :value="scope.row.rewardPunishType" />
          </template>
        </el-table-column>
        <el-table-column label="奖惩日期" align="center" prop="rewardPunishDate" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.rewardPunishDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖惩金额" align="center" prop="rewardPunishMoney" show-overflow-tooltip />
        <el-table-column label="分数" align="center" prop="fraction" show-overflow-tooltip />
        <!-- <el-table-column label="奖惩状况" align="center" prop="isRewardPunish">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.isrewardpunish" :value="scope.row.isRewardPunish" />
          </template>
        </el-table-column> -->
        <el-table-column label="奖惩说明" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:rewardPunish:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:rewardPunish:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改保安奖惩信息对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="奖惩人员" prop="securityId">
          <search-select v-model="form.securityId" :listFn="listStaffFn"
            :backArr="backObj.staf" label="securityName" option="securityId" placeholder="请选择保安"
            filterable />
        </el-form-item>
        <el-form-item label="奖惩类型" prop="rewardPunishType">
          <el-select v-model="form.rewardPunishType" placeholder="请选择奖惩类型" :style="{ width: '100%' }">
            <el-option v-for="dict in dict.type.rewardpunishtype" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖惩日期" prop="rewardPunishDate">
          <el-date-picker clearable v-model="form.rewardPunishDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择奖惩日期" style="width: 100%" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="奖惩金额" prop="rewardPunishMoney">
          <el-input-number
            class="ipt-number"
            placeholder="请输入奖惩金额"
            v-model="form['rewardPunishMoney']"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="分数" prop="fraction">
          <el-input-number
            class="ipt-number"
            placeholder="请输入分数"
            v-model="form['fraction']"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="奖惩说明" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入奖惩说明" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 奖惩导入对话框 -->
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
  </div>
</template>

<script>
import { listRewardPunish, delRewardPunish, addRewardPunish, updateRewardPunish } from "@/api/SecurityManagement/Securitypunishments.js";
import { listStaff } from "@/api/SecurityManagement/Security.js";
import { getToken } from "@/utils/auth"
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs';

export default {
  dicts: ['isrewardpunish', 'rewardpunishtype'],
  name: "Securitypunishments",
  components: { searchSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 保安奖惩信息表格数据
      rewardPunishList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityId: null,
        rewardPunishType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        securityId: [
          { required: true, message: "被奖惩保安人员不能为空", trigger: "blur" }
        ],
        rewardPunishDate: [
          { required: true, message: "奖惩日期不能为空", trigger: "blur" }
        ],
        rewardPunishMoney: [
          { required: true, message: "奖惩金额不能为空", trigger: "blur" }
        ],
      },
      list: [],
      // 限制选择时间
      pickerOptions: {
        disabledDate: (date) => {
          return date.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      // 表单回显
      backObj: {
        staf: []
      },

      // 奖惩导入参数
      upload: {
        // 是否显示弹出层（奖惩导入）
        open: false,
        // 弹出层标题（奖惩导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/rewardPunish/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安奖惩信息列表 */
    getList() {
      this.loading = true;
      listRewardPunish(this.queryParams).then(response => {
        this.rewardPunishList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 查询人员方法
    async listStaffFn(queryParams) {
      const { rows, total } = await listStaff({
        ...queryParams,
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
        id: null,
        securityId: null,
        rewardPunishType: 0,
        rewardPunishDate: dayjs().format('YYYY-MM-DD'),
        rewardPunishMoney: null,
        fraction: null,
        remark: null,
      }
      this.resetForm("form")
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加保安奖惩信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.backObj.staf = [{ securityName: row.securityName, securityId: row.securityId }]
      this.form = { ...row }
      this.title = "修改保安奖惩信息"
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRewardPunish(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRewardPunish(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除该奖惩信息？').then(function () {
        return delRewardPunish(row.id)
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('affairs/rewardPunish/export', {
        ...this.queryParams
      }, `rewardPunish_${new Date().getTime()}.xlsx`)
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "奖惩导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/rewardPunish/exportTemplate', {
      }, `奖惩导入模板_${new Date().getTime()}.xlsx`)
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
