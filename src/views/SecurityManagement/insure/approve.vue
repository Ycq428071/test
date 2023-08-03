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
      <el-form-item label="参保年月始" prop="insureStartDate">
        <el-date-picker
          v-model="queryParams['insureStartDate']"
          type="month"
          placeholder="请选择年月"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否填报" prop="isFilled">
        <el-select v-model="queryParams['isFilled']">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in dict.type['query_no_yes']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否受理" prop="acceptedOrNot">
        <el-select v-model="queryParams['acceptedOrNot']">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in dict.type['query_no_yes']"
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
            v-hasPermi="['affairs:insure:batchFilling']"
            type="success"
            icon="el-icon-edit"
            :disabled="allChecked"
            @click="handleWrite"
          >填报</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['affairs:insure:batchCancelFilling']"
            type="danger"
            icon="el-icon-delete"
            :disabled="allUnchecked"
            @click="handleUnwrite"
          >销填报</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['affairs:insure:export']"
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
        @selection-change="handleSelectionChange"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="性别" align="center" prop="sex" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['sys_user_sex']" :value="scope.row['sex']" />
          </template>
        </el-table-column>
        <el-table-column label="证件号码" align="center" prop="certificateNumber" width="170" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column label="单位名称" align="center" prop="unitName" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_unit_name']" :value="scope.row['unitName']" />
          </template>
        </el-table-column>
        <el-table-column label="保险号" align="center" prop="insuranceNumber" show-overflow-tooltip />
        <el-table-column label="社会保障号" align="center" prop="socialSecurityNumber" width="170" show-overflow-tooltip />
        <el-table-column label="参保起始年月" align="center" prop="insureStartTime" width="100" show-overflow-tooltip />
        <el-table-column label="医保起始年月" align="center" prop="medicalInsuranceStartDate" width="100" show-overflow-tooltip />
        <el-table-column label="操作员" align="center" prop="updateBy" show-overflow-tooltip />

        <el-table-column label="填报人" align="center" prop="insureInformant" show-overflow-tooltip />
        <el-table-column label="填报日期" align="center" prop="fillingDate" width="100" show-overflow-tooltip />
        <el-table-column label="受理人" align="center" prop="institutionalAcceptor" show-overflow-tooltip />
        <el-table-column label="受理日期" align="center" prop="institutionalAcceptanceDate" width="100" show-overflow-tooltip />
        <el-table-column label="试始日期" align="center" prop="trialStartDate" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['trialStartDate'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="试止日期" align="center" prop="trialEndDate" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row['trialEndDate'], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.isAccepted === 1"
              v-hasPermi="['affairs:insure:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >受理</el-button>
            <!-- <el-button
              v-hasPermi="['']"
              size="mini"
              type="text"
              @click="handleRewrite(scope.row)"
            >重新填报</el-button> -->
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
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-col :span="span" v-if="flag === 'write'">
            <el-form-item label="填报日期" prop="fillingDate">
              <el-date-picker
                v-model="form.fillingDate"
                type="date"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <template v-else>
            <el-col :span="span">
              <el-form-item label="参保起始年月" prop="insureStartTime">
                <el-date-picker
                  v-model="form['insureStartTime']"
                  type="month"
                  placeholder="请选择年月"
                  value-format="yyyy-MM"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="机构受理日期" prop="institutionalAcceptanceDate">
                <el-date-picker
                  v-model="form['institutionalAcceptanceDate']"
                  type="date"
                  placeholder="请选择日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="受理成功" prop="isAccepted">
                <el-select v-model="form['isAccepted']" placeholder="请选择是否成功" style="width: 100%">
                  <el-option
                    v-for="item in dict.type['query_no_yes']"
                    :key="item.value"
                    :label="item.label"
                    :value="+item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="保险号" prop="insuranceNumber">
                <el-input v-model="form['insuranceNumber']" placeholder="请输入保险号" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="医保起始年月" prop="medicalInsuranceStartDate">
                <el-date-picker
                  v-model="form['medicalInsuranceStartDate']"
                  type="month"
                  placeholder="请选择年月"
                  value-format="yyyy-MM"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form['remark']" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </template>
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
import { listInsure, writeInsure, unwriteInsure, updateInsure } from '@/api/SecurityManagement/insure'
import dayjs from 'dayjs'

export default {
  name: 'Insure_approve',
  dicts: [
    'query_no_yes',
    'sys_user_sex',
    'endowmentinsurance',
    'query_unit_name',
    // '',
  ],
  data() {
    return {
      // 查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        'securityName': null,
        'insureStartDate': null,
        'isFilled': null,
        'acceptedOrNot': null,
      },
      // 列表
      loading: false,
      tableList: [],
      total: 0,
      // 多选
      ids: [],
      // 弹出层
      title: '',
      open: false,
      span: 24,
      // 表单参数
      form: {},
      rules: {
        'fillingDate': [
          { required: true, message: '请选择日期', trigger: 'change' },
        ],
        'institutionalAcceptanceDate': [
          { required: true, message: '请选择日期', trigger: 'change' },
        ],
      },
      // 填报
      flag: '',
    }
  },
  created() {
    this.getList()
    console.log(this.$store.state.user.name)
  },
  computed: {
    // 选中的全是复核的
    allChecked() {
      if(this.ids.length === 0) {
        return true
      } else {
        return !this.tableList
          .filter(item => this.ids.includes(item.insureId))
          .every(item => item.fillingDate === null)
      }
    },
    // 选中的全是未复核的
    allUnchecked() {
      if(this.ids.length === 0) {
        return true
      } else {
        return !this.tableList
        .filter(item => this.ids.includes(item.insureId))
        .every(item => item.fillingDate !== null)
      }
    },
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
        'insureId': null,
        'fillingDate': dayjs().format('YYYY-MM-DD'),
        'insureStartTime': dayjs().format('YYYY-MM'),
        'institutionalAcceptanceDate': dayjs().format('YYYY-MM-DD'),
        'isAccepted': null,
        'insuranceNumber': null,
        'medicalInsuranceStartDate': dayjs().format('YYYY-MM'),
        'remark': null,
      }
      this.resetForm('form')
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item['insureId'])
    },
    /** 填报按钮操作 */
    handleWrite() {
      this.reset()
      this.title = '养老保险填报'
      this.flag = 'write'
      this.open = true
    },
    // 销填报
    handleUnwrite() {
      const insureIds = this.ids
      this.$modal.confirm('是否确认销填报所选保安保险？').then(function() {
        return unwriteInsure(insureIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('销填报成功')
      }).catch((err) => {
        console.log(err)
      })
    },
    /** 受理按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.flag = ''
      this.form = { ...row }
      this.title = '修改'
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if(this.flag === 'write') {
            const insureIds = this.ids
            this.$modal.confirm('是否确认填报所选保安保险？').then(() => {
              return writeInsure({ insureIds, fillingDate: this.form.fillingDate })
            }).then(() => {
              this.getList()
              this.open = false
              this.$modal.msgSuccess('填报成功')
            }).catch((err) => {
              console.log(err)
            })
            return
          }
          if (this.form['insureId'] != null) {
            updateInsure({ ...this.form, institutionalAcceptor: this.$store.state.user.name }).then(response => {
              this.$modal.msgSuccess('受理成功')
              this.open = false
              this.getList()
            })
          } else {
          }
        }
      })
    },
    /** 重新填报按钮操作 */
    handleRewrite(row) {
      const ids = row['Id'] || this.ids
      this.$modal.confirm('是否确认删除？').then(function() {
        return delStaff(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
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
      this.download('/affairs/insure/export', {
        ...exportParams
      }, `_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>
