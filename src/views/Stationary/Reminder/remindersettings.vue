<template>
  <div class="app-container">
    <!-- <el-form class="gl-search_form" :model="queryParams" ref="queryForm" size="small" :inline="true"
      label-width="100px">
      <el-form-item label="提醒类型" prop="reminderType">
        <el-select v-model="queryParams.reminderType" placeholder="">
          <el-option label="驻点合同到期" value="0"></el-option>
          <el-option label="驻点合同收款到期" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提醒人员" prop="reminderPerson">
        <el-input v-model="queryParams.reminderPerson" placeholder="请输入提醒人员" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
            v-hasPermi="['affairs:reminder:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['affairs:reminder:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['affairs:reminder:remove']">删除</el-button>
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:reminder:export']">导出</el-button>
        </el-col> -->
        <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" v-loading="loading" :data="reminderList" @selection-change="handleSelectionChange" height="calc(100vh - 244px - 56px)">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <!-- <el-table-column label="提醒设置表主键ID" align="center" prop="id" /> -->
        <el-table-column label="提醒类型" align="center" prop="reminderType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.remindertype" :value="scope.row.reminderType" />
          </template>
        </el-table-column>
        <el-table-column label="提醒天数" align="center" prop="reminderDays" show-overflow-tooltip />
        <el-table-column label="提醒人员" align="center" prop="reminderPersonName" show-overflow-tooltip />
        <el-table-column label="操作日期" align="center" prop="createTime" show-overflow-tooltip />
        <el-table-column label="操作人" align="center" prop="createBy" show-overflow-tooltip />
        <!-- <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['affairs:reminder:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:reminder:remove']">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <!-- 添加或修改提醒设置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="提醒天数" prop="reminderDays">
          <el-input v-model="form.reminderDays" placeholder="请输入提醒天数" />
        </el-form-item>
        <el-form-item label="提醒类型">
          <el-select v-model="form.reminderType" placeholder="请选择提醒类型" :style="{ width: '100%' }">
            <el-option v-for="dict in dict.type.remindertype" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提醒人员" prop="ids">
          <el-select v-model="form.ids" multiple filterable placeholder="请选择提醒人员" :style="{ width: '100%' }">
            <el-option v-for="item in  listOfPeople " :key="item.userId" :label="item.userName"
              :value="Number(item.userId)">
            </el-option>
          </el-select>
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
import { listReminder, getReminder, delReminder, addReminder, updateReminder, exportAPI } from "@/api/Stationary/Reminder/remindersettings.js";
import { listUser } from '@/api/system/user.js'

export default {
  dicts: ['remindertype'],
  name: "Reminder",
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
      // 提醒设置表格数据
      reminderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reminderType: null,
        reminderDays: null,
        reminderPerson: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reminderType: [
          { required: true, message: "提醒类型：0驻点合同到期！1驻点合同收款到期！不能为空", trigger: "change" }
        ],
        reminderDays: [
          { required: true, message: "提醒天数不能为空", trigger: "blur" }
        ],
        ids: [
          { required: true, message: "提醒人员不能为空", trigger: "blur" }
        ],
      },
      // 人员列表
      listOfPeople: []
    };
  },
  async created() {
    this.getList();
    const res = await listUser()
    this.listOfPeople = res.rows
  },
  methods: {
    /** 查询提醒设置列表 */
    getList() {
      this.loading = true;
      listReminder(this.queryParams).then(response => {
        this.reminderList = response.rows;
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
        reminderType: null,
        reminderDays: null,
        ids: null,
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
    async handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加提醒设置";
      const res = await listUser()
      this.listOfPeople = res.rows
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReminder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提醒设置";
      });
      const res = await listUser()
      this.listOfPeople = res.rows
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateReminder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReminder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除提醒设置编号为"' + ids + '"的数据项？').then(function () {
        return delReminder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    async handleExport() {
      exportAPI(this.ids)
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
