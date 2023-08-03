<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" class="gl-search_form" @submit.native.prevent>
      <el-form-item label="" prop="">
        <el-input
          v-model="queryParams['']"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日期" prop="">
        <el-date-picker
          v-model="queryParams['']"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>

      <el-popover
        popper-class="gl-search_popover"
        placement="bottom"
        trigger="click"
      >
        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>

        <el-form ref="queryFormMore" :model="queryParams" :inline="true" class="gl-search_form">
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
              <el-option label="全部" :value="null" />
              <el-option
                v-for="item in dict.type['']"
                :key="item.value"
                :label="item.label"
                :value="+item.value"
              />
            </el-select>
          </el-form-item>

        </el-form>
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
            v-hasPermi="['']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['']"
            type="success"
            icon="el-icon-edit"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['']"
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
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
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="名称" align="center" prop="" show-overflow-tooltip />
        <el-table-column label="" align="center" prop="" show-overflow-tooltip />
        <el-table-column label="类型" align="center" prop="" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['']" :value="scope.row['']" />
          </template>
        </el-table-column>
        <el-table-column label="" prop="" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row[''], '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150">
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
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="span">
            <el-form-item label="名称" prop="Name">
              <el-input v-model="form['Name']" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="" prop="">
              <el-input v-model="form['']" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="" prop="">
              <el-input-number
                class="ipt-number"
                placeholder="请输入"
                v-model="form['']"
                :controls="false"
                :precision="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="" prop="">
              <el-select v-model="queryParams['']" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in dict.type['']"
                  :key="item.value"
                  :label="item.label"
                  :value="+item.value"
                />
              </el-select>
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
import { listStaff, updateStaff, addStaff, delStaff } from '@/api/wage_manage/guard_manage'

export default {
  name: '',
  dicts: [
    '',
  ],
  data() {
    return {
      // 查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        '': null,
      },
      // 列表
      loading: false,
      tableList: [{}],
      total: 0,
      // 多选
      ids: [],
      single: true,
      multiple: true,
      // 弹出层
      title: '',
      open: false,
      span: 24,
      // 表单参数
      form: {},
      rules: {
        '': [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
      }
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listStaff(this.queryParams).then(response => {
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item['Id'])
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
      this.title = '修改'
      this.open = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form['Id'] != null) {
            updateStaff(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addStaff(this.form).then(response => {
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
      this.download('', {
        ...exportParams
      }, `_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>
