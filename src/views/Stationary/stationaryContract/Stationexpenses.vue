<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" size="small" :inline="true">
      <!-- <el-form-item label="驻点ID" prop="groupId">
        <el-input v-model="queryParams.groupId" placeholder="请输入驻点ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="总金额" prop="totalAmount">
        <el-input v-model="queryParams.totalAmount" placeholder="请输入总金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="发生日期" prop="occurDate">
        <el-date-picker clearable v-model="queryParams.occurDate" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择发生日期">
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
            v-hasPermi="['affairs:groupCost:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:groupCost:export']">导出</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="groupCostList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="驻点费用主键ID" align="center" prop="id" /> -->
        <el-table-column label="驻点" align="center" prop="groupName" />
        <el-table-column label="费用类型" align="center" prop="costType">
          <template slot-scope="scope">
            <span v-if="scope.row.costType == 0">驻点其他费用</span>
            <span v-if="scope.row.costType == 1">驻点餐费</span>
          </template>
        </el-table-column>
        <el-table-column label="总金额" align="center" prop="totalAmount" />
        <el-table-column label="发生日期" align="center" prop="occurDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.occurDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:groupCost:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:groupCost:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改驻点费用对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="驻点" prop="groupName">
          <el-input disabled v-model="form.groupName" placeholder="请输入驻点" />
        </el-form-item>

        <!-- <el-form-item label="驻点人数" prop="groupName">
          <el-input disabled v-model="form.groupName" placeholder="请输入驻点人数" />
        </el-form-item> -->

        <el-form-item label="费用类型" prop="costType">
          <el-select v-model="form.costType" placeholder="请选择费用类型" style="width: 100%">
            <el-option v-for="dict in dict.type.totalamount" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="总金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入总金额" />
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
import { listGroupCost, getGroupCost, delGroupCost, addGroupCost, updateGroupCost, exportAPI } from "@/api/SecurityManagement/Stationexpenses.js";
import { listOfResidentUnits } from '@/api/Stationary/stationaryContract/unit.js'

export default {
  dicts: ['totalamount'],
  name: "GroupCost",
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
      // 驻点费用表格数据
      groupCostList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        costType: null,
        totalAmount: null,
        occurDate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        groupId: [
          { required: true, message: "驻点ID不能为空", trigger: "blur" }
        ],
        costType: [
          { required: true, message: "费用类型：0驻点其他费用 1驻点餐费不能为空", trigger: "change" }
        ],
      },
      list: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询驻点费用列表 */
    getList() {
      console.log(this.$route.params.groupId);
      this.queryParams.groupId = this.$route.params.groupId
      this.loading = true;
      listGroupCost(this.queryParams).then(response => {
        this.groupCostList = response.rows;
        this.total = response.total;
        this.loading = false;
      });



      listOfResidentUnits({ groupId: this.$route.params.groupId }).then(response => {
        // this.form = response.rows[0];
        console.log(response.rows[0]);

        this.form.groupName = response.rows[0].groupName
        this.form.groupId = response.rows[0].groupId
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
        costType: null,
        totalAmount: null,
        occurDate: null,
        remark: null,
        createBy: null,
        updateBy: null,
        createTime: null,
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
      // this.reset();
      this.open = true;
      this.title = "添加驻点费用";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGroupCost(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改驻点费用";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGroupCost(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGroupCost(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除驻点费用编号为"' + ids + '"的数据项？').then(function () {
        return delGroupCost(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    async handleExport() {
      exportAPI(this.form.groupId)
        .then((res) => {
          const fileName = 'xxx'
          const contentType =
            'application/vnd.ms-excel'
          this.exportFile(res, contentType, fileName)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    exportFile(data, type, fileName) {
      const blob = new Blob([data], {
        // type类型后端返回来的数据中会有，根据自己实际进行修改
        // 表格下载为 application/xlsx，压缩包为 application/zip等，
        type: type
      })
      const filename = fileName
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL.createObjectURL(blob)
        // 创建隐藏<a>标签进行下载
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)// 移除dom元素
        window.URL.revokeObjectURL(blobURL)// 释放bolb内存
      }
    },
  }
};
</script>
