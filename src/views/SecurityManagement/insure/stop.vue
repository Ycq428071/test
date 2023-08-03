<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" class="gl-search_form" @submit.native.prevent>
      <el-form-item label="保安姓名" prop="securityName">
        <el-input
          v-model="queryParams['securityName']"
          placeholder="请输入保安姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="停保状态" prop="offMaintenanceStatus">
        <el-select v-model="queryParams['offMaintenanceStatus']">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in dict.type['offmaintenancestatus']"
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
          <el-button
            v-hasPermi="['affairs:insure:noInsuranceExport']"
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="tableList"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="性别" align="center" prop="sex" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['sys_user_sex']" :value="scope.row['sex']" />
          </template>
        </el-table-column>
        <el-table-column label="离职日期" align="center" prop="resignationTime" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['resignationTime'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="离职备注" align="center" prop="resignationRemark" width="100"  show-overflow-tooltip/>
        <el-table-column label="停保状态" align="center" prop="offMaintenanceStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['offmaintenancestatus']" :value="scope.row['offMaintenanceStatus']" />
          </template>
        </el-table-column>
        <el-table-column label="证件号码" align="center" prop="certificateNumber" width="170" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column label="单位名称" align="center" prop="unitName" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_unit_name']" :value="scope.row['unitName']" show-overflow-tooltip />
          </template>
        </el-table-column>
        <el-table-column label="保险号" align="center" prop="insuranceNumber" show-overflow-tooltip />
        <el-table-column label="社会保障号" align="center" prop="socialSecurityNumber" width="170" show-overflow-tooltip />
        <el-table-column label="参保起始年月" align="center" prop="insureStartTime" width="100" show-overflow-tooltip />
        <el-table-column label="月缴纳基数" align="center" prop="monthlyBase" width="90" show-overflow-tooltip />
        <el-table-column label="养老金保险" align="center" prop="endowmentInsurance" width="90" show-overflow-tooltip />
        <el-table-column label="医疗保险" align="center" prop="medicalInsurance" show-overflow-tooltip />
        <el-table-column label="大病保险" align="center" prop="sicknessInsurance" show-overflow-tooltip />
        <el-table-column label="失业保险" align="center" prop="unemploymentInsurance" show-overflow-tooltip />
        <el-table-column label="公积金保险" align="center" prop="accumulationFundInsurance" width="90" show-overflow-tooltip />
        <el-table-column label="其他保险" align="center" prop="otherInsurance" show-overflow-tooltip />
        <el-table-column label="医保起始年月" align="center" prop="medicalInsuranceStartDate" width="100" show-overflow-tooltip />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作员" align="center" prop="updateBy" show-overflow-tooltip />
        <el-table-column label="填报人" align="center" prop="insureInformant" show-overflow-tooltip />
        <el-table-column label="填报日期" align="center" prop="fillingDate" show-overflow-tooltip />
        <el-table-column label="受理人" align="center" prop="institutionalAcceptor" show-overflow-tooltip />
        <el-table-column label="受理日期" align="center" prop="institutionalAcceptanceDate" width="100" show-overflow-tooltip />

        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['affairs:insure:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >停保</el-button>
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
            <el-form-item label="保安姓名" prop="securityName">
              <el-input v-model="form['securityName']" />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="停保状态" prop="offMaintenanceStatus">
              <el-select v-model="form['offMaintenanceStatus']" placeholder="请选择停保状态" style="width: 100%">
                <el-option
                  v-for="item in dict.type['offmaintenancestatus']"
                  :key="item.value"
                  :label="item.label"
                  :value="+item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="停保日期" prop="offMaintenanceDate">
              <el-date-picker
                v-model="form['offMaintenanceDate']"
                type="date"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="停保编号" prop="offMaintenanceNumber">
              <el-input v-model="form['offMaintenanceNumber']" placeholder="请输入停保编号" />
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
import { listInsure, updateInsure } from '@/api/SecurityManagement/insure'

export default {
  name: 'Insure_stop',
  dicts: [
    'offmaintenancestatus',
    'sys_user_sex',
    'query_unit_name',
    'domicile',
  ],
  data() {
    return {
      // 查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        'securityName': null,
        'status': 2,
        'acceptedOrNot': 1,
        'offMaintenanceStatus': 0,
      },
      // 列表
      loading: false,
      tableList: [],
      total: 0,
      // 弹出层
      title: '',
      open: false,
      span: 24,
      // 表单参数
      form: {},
      rules: {
        'offMaintenanceDate': [
          { required: true, message: '停保日期不能为空', trigger: 'blur' },
        ],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listInsure(this.queryParams).then(response => {
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
        'Id': null,
        'Name': null,
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.title = '添加'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = { ...row }
      this.title = '保险停保'
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form['insureId'] != null) {
            updateInsure(this.form).then(response => {
              this.$modal.msgSuccess('停保成功')
              this.open = false
              this.getList()
            })
          } else {

          }
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/insure/noInsuranceExport', {
        ...exportParams
      }, `保险停保表_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>
