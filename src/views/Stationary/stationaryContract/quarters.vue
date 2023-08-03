<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true" @submit.native.prevent>
      <el-form-item label="所属驻点" prop="groupId">
        <search-select v-model="queryParams.groupId" :listFn="listUnitFn"
          label="groupName" option="groupId" placeholder="请选择驻点" filterable />
      </el-form-item>
      <!-- <el-form-item label="岗位薪资" prop="positionSalary">
        <el-input v-model="queryParams.positionSalary" placeholder="请输入岗位薪资" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
            v-hasPermi="['affairs:position:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" icon="el-icon-edit" :disabled="single" @click="handleUpdate"
            v-hasPermi="['affairs:position:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['affairs:position:remove']">删除</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:position:export']">导出</el-button>
        </el-col> -->
      </el-row>

      <el-table
        v-loading="loading"
        :data="positionList"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 244px - 106px - 56px)"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="驻点岗位信息表" align="center" prop="groupPositionId" /> -->
        <el-table-column label="所属驻点" align="center" prop="groupName" width="250" />
        <el-table-column label="岗位类型" align="center" prop="positionType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.positiontype" :value="scope.row.positionType" />
          </template>
        </el-table-column>
        <el-table-column label="岗位薪资" align="center" prop="positionSalary" />
        <el-table-column label="岗位人数" align="center" prop="positionNumber" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:position:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:position:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改驻点岗位信息对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位类型" prop="positionType">
          <el-select v-model="form['positionType']" style="width: 100%" placeholder="请选择类型">
            <el-option
              v-for="item in dict.type['positiontype']"
              :key="item.value"
              :label="item.label"
              :value="+item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属驻点" prop="groupId">
          <search-select v-model="form.groupId" :listFn="listUnitFn" :backArr="backObj.unit"
            label="groupName" option="groupId" placeholder="请选择驻点" filterable />
        </el-form-item>
        <el-form-item label="岗位人数" prop="positionNumber">
          <el-input-number
            class="ipt-number"
            placeholder="请输入岗位人数"
            v-model="form.positionNumber"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="岗位薪资" prop="positionSalary">
          <el-input-number
            class="ipt-number"
            placeholder="请输入岗位薪资"
            v-model="form.positionSalary"
            :controls="false"
          />
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
import { listPosition, delPosition, addPosition, updatePosition } from "@/api/Stationary/stationaryContract/JobInformation.js";
import { listUnit } from "@/api/wage_manage/query"
import searchSelect from '@/views/components/searchSelect.vue'

export default {
  dicts: ['positiontype'],
  name: "Quarters",
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
      // 驻点岗位信息表格数据
      positionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        // positionType: null,
        // positionSalary: null,
      },
      // 表单参数
      form: {},
      backObj: {
        unit: [],
      },
      // 表单校验
      rules: {
        positionType: [
          { required: true, message: "岗位类型不能为空", trigger: "change" }
        ],
        groupId: [
          { required: true, message: "所属驻点不能为空", trigger: "blur" }
        ],
        positionSalary: [
          { required: true, message: "岗位薪资不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询驻点岗位信息列表 */
    getList() {
      this.loading = true
      listPosition(this.queryParams).then(response => {
        this.positionList = response.rows
        this.total = response.total
        this.loading = false
      })
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
        groupPositionId: null,
        groupId: null,
        positionNumber: null,
        positionType: null,
        positionSalary: null,
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.groupPositionId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加驻点岗位信息"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.backObj.unit = [{ groupName: row.groupName, groupId: row.groupId }]
      this.form = { ...row }
      this.open = true
      this.title = "修改驻点岗位信息"
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.groupPositionId != null) {
            updatePosition(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addPosition(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const groupPositionIds = row.groupPositionId || this.ids;
      this.$modal.confirm('是否确认删除该驻点岗位？').then(function () {
        return delPosition(groupPositionIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => { })
    },
    /** 导出按钮操作 */
    // handleExport() {
    //   this.download('affairs/position/export', {
    //     ...this.queryParams
    //   }, `position_${new Date().getTime()}.xlsx`)
    // }
  }
}
</script>
