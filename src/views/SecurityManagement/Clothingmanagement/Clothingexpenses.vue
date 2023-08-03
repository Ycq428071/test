<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="名称" prop="equipName">
        <el-input v-model="queryParams.equipName" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" :style="{ width: '100%' }">
          <el-option v-for="dict in dict.type.clothingtype" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
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
            v-hasPermi="['affairs:equip:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:equip:export']">导出</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="equipList" height="calc(100vh - 244px - 106px - 56px)">
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.clothingtype" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="equipName" />
        <el-table-column label="价格" align="center" prop="price" />
        <el-table-column label="服装类型" align="center" prop="dressType">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.dresstype" :value="scope.row.dressType" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />

        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:equip:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:equip:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改服装装备管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" :style="{ width: '100%' }" :disabled="form.equipId !== null">
            <el-option v-for="dict in dict.type.clothingtype" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="equipName">
          <el-input v-model="form.equipName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number
            class="ipt-number"
            placeholder="请输入价格"
            v-model="form['price']"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="服装类型" v-if="form.type === 1">
          <el-select v-model="form.dressType" placeholder="请选择服装类型" :style="{ width: '100%' }">
            <el-option v-for="dict in dict.type.dresstype" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
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
import { listEquip, getEquip, delEquip, addEquip, updateEquip, exportAPI } from "@/api/SecurityManagement/Clothingexpenses.js";

export default {
  name: "Clothingexpenses",
  dicts: ['clothingtype', 'dresstype'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 服装装备管理表格数据
      equipList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipName: null,
        type: 0,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equipName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询服装装备管理列表 */
    getList() {
      this.loading = true;
      listEquip(this.queryParams).then(response => {
        this.equipList = response.rows;
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
        equipId: null,
        type: 0,
        equipName: null,
        price: null,
        dressType: 0,
        remark: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增服装装备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getEquip(row.equipId).then(response => {
        this.form = { ...response.data }
        this.form.dressType = 0
        this.open = true;
        this.title = "修改服装装备";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const form = {}
          for(const k in this.form) {
            // 只有类型为服装时，才有服装类型
            if(!(this.form.type !== 1 && k === 'dressType')) form[k] = this.form[k]
          }
          if (this.form.equipId != null) {
            updateEquip(form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEquip(form).then(response => {
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
      this.$modal.confirm('是否确认删除该服装装备？').then(function () {
        return delEquip(row.equipId);
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
      this.download('affairs/equip/export', {
        ...exportParams
      }, `服装费用表_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
