<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <!-- <el-form-item label="服装款年月" prop="createTime">
        <el-date-picker clearable v-model="queryParams['createTime']" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择服装款年月">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="保安姓名" prop="securityId">
        <search-select v-model="queryParams.securityId" :listFn="listStaffFn"
          label="securityName" option="securityId" placeholder="请选择保安"
          filterable clearable />
      </el-form-item>

      <!-- <el-popover placement="bottom" trigger="click">
        <el-form-item label="服装费用" prop="clothingCost">
          <el-input v-model="queryParams.clothingCost" placeholder="请输入保安服装费用" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="创建人" prop="createId">
          <el-select :remote-method="contractorbtn" :style="{ width: '100%' }" v-model="queryParams.createId" remote
            filterable placeholder="请选择">
            <el-option v-for="item in contractor" :key="item.userId" clearable :label="item.nickName"
              :value="Number(item.userId)" @keyup.enter.native="handleQuery">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>
      </el-popover> -->

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['affairs:clothingFee:add']">新增</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:residueCost:export']">导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            @click="handleImport"
            v-hasPermi="['affairs:residueCost:import']"
          >导入</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" height="calc(100vh - 244px - 106px - 56px)" v-loading="loading" :data="clothingFeeList">
        <el-table-column label="服装款年月" align="center" prop="createTime" show-overflow-tooltip />
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" width="180" show-overflow-tooltip />
        <el-table-column label="服装费用" align="center" prop="clothingCost" show-overflow-tooltip />
        <el-table-column label="已返费用" align="center" prop="returnClothingCost" show-overflow-tooltip />
        <el-table-column label="剩余服装款" align="center" prop="residueClothingCost" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="所属驻点" align="center" prop="groupName" width="400" show-overflow-tooltip />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>

    <!-- 服装费用余额导入对话框 -->
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
import { listOfBalances } from "@/api/SecurityManagement/clothingbalance.js";
import { listUser } from '@/api/system/user.js'
import { listStaff } from "@/api/SecurityManagement/Security.js";
import { getToken } from "@/utils/auth"
import searchSelect from '@/views/components/searchSelect.vue'

export default {
  name: "Clothingbalance",
  components: { searchSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 保安服装费用表格数据
      clothingFeeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityId: null,
        createTime: null,
        // feeDate: null,
        // clothingCost: null,
        // residueClothingCost: null,
        // createId: null,
        // isReturnFee: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        securityId: [
          { required: true, message: "保安主键id不能为空", trigger: "blur" }
        ],
        feeDate: [
          { required: true, message: "费用日期不能为空", trigger: "blur" }
        ],
        clothingCost: [
          { required: true, message: "保安服装费用不能为空", trigger: "blur" }
        ],
        residueClothingCost: [
          { required: true, message: "剩余服装费用不能为空", trigger: "blur" }
        ],
        isReturnFee: [
          { required: true, message: "是否全部返还完成：0否 1是不能为空", trigger: "blur" }
        ]
      },
      contractor: [],
      list: [],

      // 服装费用余额导入参数
      upload: {
        // 是否显示弹出层（服装费用余额导入）
        open: false,
        // 弹出层标题（服装费用余额导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/residueCost/importData"
      },
    };
  },
  created() {
    this.getList();


  },
  methods: {
    /** 查询保安服装费用列表 */
    getList() {
      this.loading = true;
      listOfBalances(this.queryParams).then(response => {
        this.clothingFeeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        feeId: null,
        securityId: null,
        feeDate: null,
        clothingCost: null,
        residueClothingCost: null,
        remark: null,
        createId: null,
        createTime: null,
        updateTime: null,
        updateBy: null,
        isReturnFee: null
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.securityId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加保安服装费用";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const feeId = row.feeId || this.ids
      getClothingFee(feeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改保安服装费用";
      });
      this.contractorbtn(row.createId)
      this.remoteMethod(row.securityId)
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.feeId != null) {
            updateClothingFee(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClothingFee(this.form).then(response => {
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
      const feeIds = row.feeId || this.ids;
      this.$modal.confirm('是否确认删除保安服装费用编号为"' + feeIds + '"的数据项？').then(function () {
        return delClothingFee(feeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    async contractorbtn(query) {
      console.log('11');
      // 签约人
      const res4 = await listUser({ userId: query })
      this.contractor = res4.rows
    },
    remoteMethod(query) {
      listStaff({ securityId: query }).then(response => {
        this.list = response.rows;
      });
    },
    // 查询人员方法
    async listStaffFn(queryParams) {
      const { rows, total } = await listStaff({
        ...queryParams,
      })

      return { rows, total }
    },

    // 
    async contractorsayn(query) {
      // 签约人
      const res4 = await listUser({ createBy: query })
      this.contractor = res4.rows
    },
    remoteMethodsayn(query) {
      listStaff({ securityName: query }).then(response => {
        this.list = response.rows;
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
      this.download('/affairs/residueCost/export', {
        ...exportParams
      }, `服装费用余额表_${new Date().getTime()}.xlsx`)
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "服装费用余额导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/residueCost/exportTemplate', {
      }, `服装费用余额导入模板_${new Date().getTime()}.xlsx`)
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
