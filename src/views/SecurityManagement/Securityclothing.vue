<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="120px">
      <el-form-item label="保安名字" prop="securityId">
        <el-select v-model="queryParams.securityId" filterable remote placeholder="请选择" :remote-method="remoteMethodsayn">
          <el-option v-for="item in list" :key="item.securityId" :label="item.securityName" :value="item.securityId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-popover placement="bottom" trigger="click">
        <el-form-item label="费用日期" prop="feeDate">
          <el-date-picker clearable v-model="queryParams.feeDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择费用日期">
          </el-date-picker>
        </el-form-item>
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
      </el-popover>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['affairs:clothingFee:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['affairs:clothingFee:export']">导出</el-button>
        </el-col> -->

      </el-row>

      <el-table height="calc(100vh - 84px - 60px - 86px - 70px - 56px - 50px)" v-loading="loading" :data="clothingFeeList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="保安" align="center" prop="securityName" />
        <el-table-column label="费用日期" align="center" prop="feeDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.feeDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保安服装费用" align="center" prop="clothingCost" />

        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="创建人" align="center" prop="createBy" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:clothingFee:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:clothingFee:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改保安服装费用对话框 -->
    <el-dialog v-dialogDrag :title="Feetitle" :visible.sync="Feeopen" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="Feeform" :model="Feeform" :rules="rules" label-width="80px">
        <el-form-item label="保安名字" prop="securityId">
          <el-select disabled v-if="Feeform.securityId" v-model="Feeform.securityId" filterable remote placeholder="请选择"
            :remote-method="remoteMethodsayn">
            <el-option v-for="item in list" :key="item.securityId" :label="item.securityName" :value="item.securityId">
            </el-option>
          </el-select>

          <el-select v-else v-model="Feeform.securityId" filterable remote placeholder="请选择"
            :remote-method="remoteMethodsayn">
            <el-option v-for="item in list" :key="item.securityId" :label="item.securityName" :value="item.securityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用日期" prop="feeDate">
          <el-date-picker clearable v-model="Feeform.feeDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择费用日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="保安服装费用" prop="clothingCost">
          <el-input v-model="Feeform.clothingCost" placeholder="请输入保安服装费用" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="Feeform.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="创建人" prop="createId">
          <el-select disabled v-if="Feeform.securityId" :remote-method="contractorsayn" :style="{ width: '100%' }"
            v-model="form.createId" remote filterable placeholder="请选择">
            <el-option v-for="item in contractor" :key="item.userId" clearable :label="item.createBy"
              :value="Number(item.userId)" @keyup.enter.native="handleQuery">
            </el-option>
          </el-select>

          <el-select v-else :remote-method="contractorsayn" :style="{ width: '100%' }" v-model="Feeform.createId" remote
            filterable placeholder="请选择">
            <el-option v-for="item in contractor" :key="item.userId" clearable :label="item.createBy"
              :value="Number(item.userId)" @keyup.enter.native="handleQuery">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="FeesubmitForm">确 定</el-button>
        <el-button @click="Feecancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listClothingFee, delClothingFee, addClothingFee, updateClothingFee } from "@/api/SecurityManagement/Securityclothing.js";
import { listUser } from '@/api/system/user.js'
import { listStaff } from "@/api/SecurityManagement/Security.js";
export default {
  name: "ClothingFee",
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
      Feetitle: "",
      // 是否显示弹出层
      Feeopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityId: null,
        feeDate: null,
        clothingCost: null,
        residueClothingCost: null,
        createId: null,
        isReturnFee: null
      },
      // 表单参数
      Feeform: {},
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
    };
  },
  created() {
    this.getList();


  },
  methods: {
    /** 查询保安服装费用列表 */
    getList() {
      this.loading = true;
      listClothingFee(this.queryParams).then(response => {
        this.clothingFeeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.Feeopen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.Feeform = {
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
      this.resetForm("Feeform");
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
      this.ids = selection.map(item => item.feeId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.Feeopen = true;
      this.Feetitle = "添加保安服装费用";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.Feeform = row;
      this.Feeopen = true;
      this.Feetitle = "修改保安服装费用";
      // });
      this.contractorbtn(row.createId)
      this.remoteMethod(row.securityId)
      // console.log(this.form);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["Feeform"].validate(valid => {
        if (valid) {
          if (this.Feeform.feeId != null) {
            updateClothingFee(this.Feeform).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClothingFee(this.Feeform).then(response => {
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
    /** 导出按钮操作 */
    handleExport() {
      this.download('affairs/clothingFee/export', {
        ...this.queryParams
      }, `clothingFee_${new Date().getTime()}.xlsx`)
    },

  }
};
</script>
