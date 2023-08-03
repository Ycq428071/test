<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="保安姓名" prop="staffName">
        <el-input
          v-model="queryParams['staffName']"
          placeholder="请输入保安姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>



      <!-- <el-popover
        popper-class="gl-search_popover"
        placement="bottom"
        trigger="click"
      >
        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>

        <el-form :model="queryParams" ref="queryFormMore" :inline="true" class="gl-search_form">
          <el-form-item label="" prop="">
            <el-input
              v-model="queryParams['']"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="" prop="">
            <el-select v-model="queryParams['']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>


        </el-form>
      </el-popover> -->

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:deduction:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            @click="handleImport"
            v-hasPermi="['affairs:insureExport:import']"
          >导入</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        show-summary
        :summary-method="getSummaries"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="staffNumber" show-overflow-tooltip /> -->
        <el-table-column label="保安姓名" align="center" prop="staffName" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="affiliatedDept" width="110" show-overflow-tooltip />
        <el-table-column label="所属驻点" align="center" prop="groupName" width="250" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="identificationNumber" width="170" show-overflow-tooltip />
        <el-table-column label="银行账号" align="center" prop="accountNumber" width="170" show-overflow-tooltip />
        <el-table-column label="补扣金额" align="center" prop="supplementaryDeductionAmount" show-overflow-tooltip />
        <el-table-column label="扣款状态" align="center" prop="deductionStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.query_deduction_state" :value="scope.row.deductionStatus" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />

        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:deduction:remove']"
            >删除</el-button>
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

    <!-- 保险补扣导入对话框 -->
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
import { listDeduction, delDeduction } from "@/api/wage_manage/params_setting"
import { getToken } from "@/utils/auth"

export default {
  name: 'Insure_update_import',
  dicts: [
    'query_deduction_state',
  ],
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
        'staffName': null,
      },

      // 保险补扣导入参数
      upload: {
        // 是否显示弹出层（保险补扣导入）
        open: false,
        // 弹出层标题（保险补扣导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/affairs/deduction/importData"
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listDeduction(this.queryParams).then(response => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false

        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
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
      // this.resetForm("queryFormMore")
      this.handleQuery()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item['insuranceDeductionId'])
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row['insuranceDeductionId'] || this.ids
      this.$modal.confirm('是否确认删除选中数据？').then(function() {
        return delDeduction(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "保险补扣导入"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/affairs/deduction/export', {
      }, `保险补扣导入模板_${new Date().getTime()}.xlsx`)
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

    // 自定义合计栏方法
    getSummaries({ columns, data }) {
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
        } else if (index === 4) {
          const values = data.map(item => Number(item[column.property]))

          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>
