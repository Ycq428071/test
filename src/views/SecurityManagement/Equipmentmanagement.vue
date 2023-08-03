<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="驻点单位" prop="groupId">
        <search-select v-model="queryParams.groupId" :listFn="listUnitFn" label="groupName"
          option="groupId" placeholder="请选择驻点" filterable remote />
      </el-form-item>
      <el-form-item label="服装装备" prop="equipId">
        <search-select v-model="queryParams.equipId" :listFn="listElemFn" label="equipName"
          option="equipId" placeholder="请选择服装装备" filterable remote />
      </el-form-item>
      <el-form-item label="发生日期起始" prop="type">
        <el-date-picker value-format="yyyy-MM-dd" v-model="queryParams.startDate" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="发生日期截止" prop="endDate">
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
        <!-- <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
            v-hasPermi="['affairs:groupEquip:add']">新增</el-button>
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['affairs:groupEquip:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['affairs:groupEquip:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:groupEquip:export']">导出</el-button>
        </el-col>
        <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
      </el-row>

      <el-table v-loading="loading" :data="groupEquipList" @selection-change="handleSelectionChange" height="calc(100vh - 244px - 106px - 56px)">
        <el-table-column label="驻点单位" align="center" prop="groupId" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.stationaryUnit.groupName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服装装备" align="center" prop="equipId">
          <template slot-scope="scope">
            <span>{{ scope.row.equip.equipName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领用数量" align="center" prop="number" />
        <el-table-column label="总金额" align="center" prop="totalAmount" />
        <el-table-column label="领用人" align="center" prop="recipient" />
        <el-table-column label="发生日期" align="center" prop="occurDate" width="180" />
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:groupEquip:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:groupEquip:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改驻点装备配发管理对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="驻点单位" prop="groupId">
          <el-input :disabled="true" v-model="form.stationaryUnit.groupName" placeholder="请输入驻点单位" />
        </el-form-item>
        <el-form-item label="服装装备" prop="equipId">
          <el-input v-model="form.equip.equipName" placeholder="请输入服装装备" />
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
        <el-form-item label="领用人" prop="recipient">
          <el-input v-model="form.recipient" placeholder="请输入领用人" />
        </el-form-item>
        <el-form-item label="发生日期" prop="occurDate">
          <el-date-picker clearable v-model="form.occurDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择发生日期" style="width: 100%">
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
import searchSelect from '@/views/components/searchSelect.vue';
import { listGroupEquip, delGroupEquip, updateGroupEquip } from "@/api/SecurityManagement/Equipmentmanagement.js";
import { listEquip } from "@/api/SecurityManagement/Clothingexpenses.js";
import { listUnit } from "@/api/wage_manage/query";
export default {
  name: "Equipmentmanagement",
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
      // 驻点装备配发管理表格数据
      groupEquipList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        equipId: null,
        number: null,
        totalAmount: null,
        recipient: null,
        occurDate: null,
        startDate: null,
        endDate: null,
      },
      // 表单参数
      form: {
        stationaryUnit: {},
        equip: {}
      },
      // 表单校验
      rules: {
      },
      // 选择器回显数据
      backObj: {
        dept: [],
        squa: [],
        elem: [],
        unit: [],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询驻点装备配发管理列表 */
    getList() {
      this.loading = true;
      listGroupEquip(this.queryParams).then(response => {
        this.groupEquipList = response.rows;
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
        groupId: null,
        equipId: null,
        number: null,
        totalAmount: null,
        recipient: null,
        occurDate: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        stationaryUnit: {},
        equip: {},
        startDate: null,
        endDate: null,
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
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        equipId: null,
        number: null,
        totalAmount: null,
        recipient: null,
        occurDate: null,
        startDate: null,
        endDate: null,
      }
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
      this.title = "新增驻点装备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.form = row;
      this.title = "修改驻点装备";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateGroupEquip(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该驻点装备？').then(function () {
        return delGroupEquip(ids);
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
      this.download('affairs/groupEquip/export', {
        ...exportParams
      }, `驻点装备配发表_${new Date().getTime()}.xlsx`)
    },
    async listElemFn(queryParams) {
      const { rows, total } = await listEquip({
        ...queryParams,
        type: 0
      })
      console.log(rows, total);
      return { rows, total }
    },
    // 查询驻点方法
    async listUnitFn(queryParams) {
      const { rows, total } = await listUnit({
        ...queryParams,
      })
      console.log(rows, total);
      return { rows, total }
    },
  }
};
</script>
