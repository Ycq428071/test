<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label-width="80px" label="保安人员" prop="securityId">
        <search-select v-model="queryParams.securityId" :listFn="listSquaFn" label="securityName"
          option="securityId" placeholder="请选择人员" filterable remote />
      </el-form-item>
      <!-- <el-form-item label="服装" prop="clothingId">
        <search-select v-model="queryParams.clothingId" :listFn="clothing" label="equipName"
          option="equipId" placeholder="请选择服装" filterable remote />
      </el-form-item>
      <el-form-item label="型号" prop="modelId">
        <search-select v-model="queryParams.modelId" :listFn="model" label="equipName"
          option="equipId" placeholder="请选择型号" filterable remote />
      </el-form-item> -->
      <el-form-item label-width="110px" label="配发日期起始" prop="startDate">
        <el-date-picker value-format="yyyy-MM-dd" v-model="queryParams.startDate" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label-width="110px" label="配发日期截止" prop="endDate">
        <el-date-picker value-format="yyyy-MM-dd" v-model="queryParams.endDate" type="date" placeholder="选择日期">
        </el-date-picker>
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
            v-hasPermi="['affairs:ecurityEquip:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['affairs:ecurityEquip:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['affairs:ecurityEquip:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:ecurityEquip:export']">导出</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="ecurityEquipList" @selection-change="handleSelectionChange" height="calc(100vh - 244px - 106px - 56px)">
        <el-table-column label="保安人员" align="center" prop="securityName" />
        <el-table-column label="服装" align="center" prop="clothingName" />
        <el-table-column label="领用数量" align="center" prop="number" />
        <el-table-column label="总金额" align="center" prop="totalAmount" />
        <el-table-column label="型号" align="center" prop="modelName" />
        <el-table-column label="配发日期" align="center" prop="distributionDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.distributionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">全部</span>
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 2">归还</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:ecurityEquip:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:ecurityEquip:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改保安服装配发管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="保安人员" prop="securityId">
          <search-select v-model="form.securityId" :listFn="listSquaFn" :backArr="backObj.squa" label="securityName"
            option="securityId" placeholder="请选择人员" filterable remote />
        </el-form-item>
        <el-form-item label="服装" prop="clothingId">
          <search-select v-model="form.clothingId" :listFn="clothing" :backArr="backObj.elem" label="equipName"
            option="equipId" placeholder="请选择服装" filterable remote />
        </el-form-item>
        <el-form-item label="领用数量" prop="number">
          <el-input-number
            class="ipt-number"
            placeholder="请输入领用数量"
            v-model="form['number']"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="总金额" prop="totalAmount">
          <el-input-number
            class="ipt-number"
            placeholder="请输入总金额"
            v-model="form['totalAmount']"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="型号" prop="modelId">
          <search-select v-model="form.modelId" :listFn="model" :backArr="backObj.unit" label="equipName" option="equipId"
            placeholder="请选择型号" filterable remote />
        </el-form-item>
        <el-form-item label="配发日期" prop="distributionDate">
          <el-date-picker clearable v-model="form.distributionDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择配发日期" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listStaff } from "@/api/SecurityManagement/Security.js";
import { listEcurityEquip, getEcurityEquip, delEcurityEquip, addEcurityEquip, updateEcurityEquip } from "@/api/SecurityManagement/Securityclothingdistribution.js";
import searchSelect from '@/views/components/searchSelect.vue';
import { listEquip } from '@/api/SecurityManagement/Clothingexpenses.js'


export default {
  components: { searchSelect },
  name: "Securityclothingdistribution",
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
      // 保安服装配发管理表格数据
      ecurityEquipList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityId: null,
        startDate: null,
        endDate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 选择器回显数据
      backObj: {
        dept: [],
        // 人员
        squa: [],
        // 服装
        elem: [],
        // 型号
        unit: [],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询保安人员方法
    async listSquaFn(queryParams) {
      const { rows, total } = await listStaff({
        ...queryParams,
        securityId: this.form.securityId,
      })
      return { rows, total }
    },
    // 查询服装方法
    async clothing(queryParams) {
      const { rows, total } = await listEquip({
        ...queryParams,
        equipId: this.form.equipId,
        type: 1
      })
      return { rows, total }
    },

    // 查询型号方法
    async model(queryParams) {
      const { rows, total } = await listEquip({
        ...queryParams,
        equipId: this.form.equipId,
        type: 2
      })
      return { rows, total }
    },
    /** 查询保安服装配发管理列表 */
    getList() {
      this.loading = true;
      listEcurityEquip(this.queryParams).then(response => {
        this.ecurityEquipList = response.rows;
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
        id: null,
        securityId: null,
        clothingId: null,
        number: null,
        totalAmount: null,
        modelId: null,
        distributionDate: null,
        status: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增保安服装配发管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.backObj.unit = [{ equipId: row.modelId, equipName: row.modelName }]
      this.backObj.elem = [{ equipId: row.clothingId, equipName: row.clothingName }]
      this.backObj.squa = [{ securityId: row.securityId, securityName: row.securityName }]
      this.open = true;
      this.title = "修改保安服装配发管理";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEcurityEquip(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEcurityEquip(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该保安服装配发？').then(function () {
        return delEcurityEquip(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('affairs/ecurityEquip/export', {
        ...exportParams
      }, `保安服装配发表_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
