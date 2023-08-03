<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label-width="80px" label="保安姓名" prop="securityName">
        <el-input v-model="queryParams.securityName" placeholder="请输入保安姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select v-model="queryParams.deptId" :listFn="listDeptFn" label="deptName"
          option="deptId" placeholder="请选择大队" />
      </el-form-item>
      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <router-link to="/SecurityManagement/Security-add/index/0">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
              v-hasPermi="['affairs:staff:add']">新增</el-button>
          </router-link>
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:staff:departExport']">导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" v-loading="loading" :data="staffList" @selection-change="handleSelectionChange" height="calc(100vh - 244px - 106px - 56px)">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" show-overflow-tooltip />
        <el-table-column label="状态" align="center" prop="status" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">在职</span>
            <span v-if="scope.row.status == 1">变更</span>
            <span v-if="scope.row.status == 2">离职</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <!-- <router-link :to="'/SecurityManagement/Security-add/index/' + scope.row.securityId">
              <el-button style="margin: 0 10px;" size="mini" type="text"
                @click="handleUpdate(scope.row)" v-hasPermi="['affairs:staff:edit']">修改</el-button>
            </router-link>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:staff:remove']">删除</el-button> -->
            <el-button size="mini" type="text" @click="changeHistory(scope.row)"
              v-hasPermi="['affairs:staffLog:list']">变更记录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>

    <el-dialog v-dialogDrag title="变更记录" :visible.sync="dialogTableVisible" :modal-append-to-body="false" width="80vw">
      <el-table
        ref="changeTable"
        border
        @header-dragend="$nextTick(() => { $refs.changeTable.doLayout() })"
        :data="gridData"
      >
        <el-table-column width="150" label="保安姓名" align="center" prop="securityName" show-overflow-tooltip />
        <el-table-column width="150" label="所属大队" align="center" prop="deptName" show-overflow-tooltip />
        <el-table-column label="所属岗位" align="center" prop="positionName" width="250" show-overflow-tooltip />
        <el-table-column width="180" label="证件号码" align="center" prop="certificateNumber" show-overflow-tooltip />
        <el-table-column width="150" label="状态" align="center" prop="status" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type['query_guard_state']" :value="scope.row['status']" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="证件类型" align="center" prop="certificateType" show-overflow-tooltip />
        <el-table-column width="150" label="银行账号" align="center" prop="account" show-overflow-tooltip />
        <el-table-column width="150" label="出生日期" align="center" prop="birthday" show-overflow-tooltip />
        <el-table-column width="150" label="报道日期" align="center" prop="reportDate" show-overflow-tooltip />
        <el-table-column width="150" label="使用开始日期" align="center" prop="trialStartDate" show-overflow-tooltip />
        <el-table-column width="150" label="使用截止日期" align="center" prop="trialEndDate" show-overflow-tooltip />
        <el-table-column width="150" label="性别" align="center" prop="sex" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="婚姻" align="center" prop="marriage" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.marriage" :value="scope.row.marriage" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="民族" align="center" prop="nation" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.nation" :value="scope.row.nation" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="文化程度" align="center" prop="education" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.education" :value="scope.row.education" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="政治面貌" align="center" prop="politicalOutlook" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.politicaloutlook" :value="scope.row.politicaloutlook" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="退伍" align="center" prop="discharge" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.discharge" :value="scope.row.discharge" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="健康状况" align="center" prop="health" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.health" :value="scope.row.health" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="资格证" align="center" prop="qualification" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.qualification" :value="scope.row.qualification" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="保安级别" align="center" prop="securityLevel" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.securitylevel" :value="scope.row.securitylevel" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="户籍性质" align="center" prop="domicile" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.domicile" :value="scope.row.domicile" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="养老保险" align="center" prop="endowmentInsurance" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.endowmentinsurance" :value="scope.row.endowmentinsurance" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="身高" align="center" prop="height" show-overflow-tooltip />
        <el-table-column width="150" label="服装款" align="center" prop="clothingStyle" show-overflow-tooltip />
        <el-table-column width="150" label="上岗日期" align="center" prop="onBoardDate" show-overflow-tooltip />
        <el-table-column width="150" label="保安证编号" align="center" prop="reportNumber" show-overflow-tooltip />
        <el-table-column width="150" label="户籍地址" align="center" prop="registeredResidenceAddress" show-overflow-tooltip />
        <el-table-column width="150" label="现居地址" align="center" prop="currentAddress" show-overflow-tooltip />
        <el-table-column width="150" label="手机号码" align="center" prop="phoneNumber" show-overflow-tooltip />
        <el-table-column width="150" label="银行类型" align="center" prop="bankType" show-overflow-tooltip />
        <el-table-column width="150" label="合同开始日期" align="center" prop="contractStartDate" show-overflow-tooltip />
        <el-table-column width="150" label="合同截止日期" align="center" prop="contractEndDate" show-overflow-tooltip />
        <el-table-column width="150" label="意外险" align="center" prop="accidentInsurance" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.accidentinsurance" :value="scope.row.accidentinsurance" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="职业等级" align="center" prop="joblevel" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.joblevel" :value="scope.row.joblevel" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="创建者" align="center" prop="createBy" show-overflow-tooltip />
        <el-table-column width="150" label="创建时间" align="center" prop="createTime" show-overflow-tooltip />
        <el-table-column width="150" label="更新者" align="center" prop="updateBy" show-overflow-tooltip />
        <el-table-column width="150" label="更新时间" align="center" prop="updateTime" show-overflow-tooltip />
        <el-table-column width="150" label="备注" align="center" prop="remark" show-overflow-tooltip />
      </el-table>
      <pagination v-show="pagtotal > 0" :total="pagtotal" :page.sync="pagqueryParams.pageNum"
        :limit.sync="pagqueryParams.pageSize" @pagination="gridData" />
    </el-dialog>
  </div>
</template>

<script>
import { delStaff, changeHistory } from "@/api/SecurityManagement/Security.js";
import { listDept } from "@/api/wage_manage/query";
import searchSelect from '@/views/components/searchSelect.vue';
import { didntArriveAt } from '@/api/SecurityManagement/Unearnedresignation.js'

export default {
  dicts: [
    'sys_user_sex',
    'marriage',
    'nation',
    'education',
    'politicaloutlook',
    'discharge',
    'health',
    'qualification',
    'securitylevel',
    'recordproof',
    'domicile',
    'endowmentinsurance',
    'retirementcertificate',
    'accidentinsurance',
    'clothingdeposit',
    'joblevel',
    'query_guard_state'
  ],
  name: "Unearnedresignation",
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
      // 保安人员管理表格数据
      staffList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityName: null,
        groupId: null,
        unitId: null,
        squadronId: null,
        deptId: null,
        alias: null,
        certificateType: null,
        certificateNumber: null,
        status: null,
        birthday: null,
        reportDate: null,
        sex: null,
        marriage: null,
        nation: null,
        education: null,
        politicalOutlook: null,
        discharge: null,
        health: null,
        qualification: null,
        securityLevel: null,
        recordProof: null,
        domicile: null,
        endowmentInsurance: null,
        retirementCertificate: null,
        height: null,
        clothingStyle: null,
        onBoardDate: null,
        reportNumber: null,
        registeredResidenceAddress: null,
        telephone: null,
        currentResidence: null,
        currentAddress: null,
        phoneNumber: null,
        bankType: null,
        account: null,
        contractStartDate: null,
        contractEndDate: null,
        speciality: null,
        precinct: null,
        trialStartDate: null,
        trialEndDate: null,
        photo: null,
        badgeNumber: null,
        introducer: null,
        issuanceDate: null,
        zipCode: null,
        accidentInsurance: null,
        clothingDeposit: null,
        jobLevel: null,
      },

      // 部门列表
      DepartmentList: [],
      // 中队列表
      Squadronlist: [],
      dialogTableVisible: false,
      gridData: [],
      backObj: {
        dept: [],
        squa: [],
        elem: [],
        unit: [],
      },
      pagqueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      pagtotal: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    /** 查询保安人员管理列表 */
    getList() {
      this.loading = true;
      didntArriveAt(this.queryParams).then(response => {
        this.staffList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      this.ids = selection.map(item => item.securityId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      this.open = true;
      this.title = "添加保安人员管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      const securityId = row.securityId || this.ids

    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const securityIds = row.securityId || this.ids;
      this.$modal.confirm('是否确认删除该保安？').then(function () {
        return delStaff(securityIds);
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
      this.download('/affairs/staff/departExport', {
        ...exportParams
      }, `保安当月试用期未到离职表_${new Date().getTime()}.xlsx`)
    },
    async changeHistory(row) {
      this.pagqueryParams.securityId = row.securityId
      // console.log(typeof row.securityId);
      const res = await changeHistory(this.pagqueryParams)
      console.log(res);
      this.dialogTableVisible = true
      this.gridData = res.rows
      this.pagtotal = res.total
    }
  }
};
</script>
