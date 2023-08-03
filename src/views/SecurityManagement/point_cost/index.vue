<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" class="gl-search_form">
      <el-form-item label="驻点名称" prop="groupId">
        <search-select v-model="queryParams.groupId" :listFn="listUnitFn"
          label="groupName" option="groupId" placeholder="请选择驻点" filterable />
      </el-form-item>
      <el-form-item label="费用类型" prop="costType">
        <el-select v-model="queryParams['costType']">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in dict.type['totalamount']"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
            v-hasPermi="['']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['']"
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="loading"
        :data="tableList"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column label="驻点名称" align="center" prop="groupName" width="250" />
        <el-table-column label="费用类型" align="center" prop="costType" width="110">
          <template slot-scope="scope">
            <dict-tag :options="dict.type['totalamount']" :value="scope.row['costType']" />
          </template>
        </el-table-column>
        <el-table-column label="总金额" align="center" prop="totalAmount" />
        <el-table-column label="发生日期" align="center" prop="occurDate" width="100" />
        <el-table-column label="操作者" align="center" prop="createBy" />
        <el-table-column label="所属大队" align="center" prop="deptName" width="100" />
        <el-table-column label="合同名称" align="center" prop="contractName" />
        <el-table-column label="合同总人数" align="center" prop="headCount" />
        <el-table-column label="驻点人数" align="center" prop="groupNumber" />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />

        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['']"
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
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
      <div v-show="total<=0" style="height: 50px" />
    </div>

    <!-- 新增或修改对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="驻点名称" prop="groupId">
        <search-select v-model="form.groupId" :listFn="listUnitFn" :backArr="backObj.unit"
          label="groupName" option="groupId" placeholder="请选择驻点" />
      </el-form-item>
        <el-form-item label="费用类型" prop="costType">
          <el-select v-model="form['costType']" style="width: 100%">
            <el-option
              v-for="item in dict.type['totalamount']"
              :key="item.value"
              :label="item.label"
              :value="+item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="总金额" prop="totalAmount">
          <el-input-number
            class="ipt-number"
            placeholder="请输入总金额"
            v-model="form['totalAmount']"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="发生日期" prop="occurDate">
          <el-date-picker v-model="form.occurDate" type="date" placeholder="请选择工资年月" style="width: 100%;"
            value-format="yyyy-MM-dd">
          </el-date-picker>
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
  </div>
</template>

<script>
import { listGroupCost, delGroupCost, addGroupCost, updateGroupCost } from "@/api/SecurityManagement/Stationexpenses.js";
import { listUnit } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Point_cost',
  dicts: [
    'totalamount',
  ],
  components: { searchSelect },
  data() {
    return {
      // 遮罩层
      loading: false,
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
        'groupId': null,
        'costType': null,
      },
      // 表单参数
      form: {},
      // 回显
      backObj: {
        unit: [],
      },
      // 表单校验
      rules: {
        'groupId': [
          { required: true, message: '驻点名称不能为空', trigger: 'blur' }
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
      listGroupCost(this.queryParams).then(response => {
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
      this.handleQuery()
    },
    // 查询驻点方法
    async listUnitFn(queryParams) {
      const { rows, total } = await listUnit({
        ...queryParams,
      })

      return { rows, total }
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        'id': null,
        'groupId': null,
        'costType': 0,
        'totalAmount': null,
        'occurDate': dayjs().format('YYYY-MM-DD'),
        'remark': null,
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.title = '添加驻点费用'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.backObj.unit = [{ groupName: row.groupName, groupId: row.groupId }]
      this.form = { ...row }
      this.title = '修改驻点费用'
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form['id'] != null) {
            updateGroupCost(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addGroupCost(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除该驻点费用？').then(function() {
        return delGroupCost(row['id'])
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
      this.download('/affairs/groupCost/export', {
        ...exportParams
      }, `驻点费用表_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>
