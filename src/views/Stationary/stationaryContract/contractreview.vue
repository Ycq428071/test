<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true"
      label-width="100px">
      <el-form-item label="所属大队" prop="deptId">
        <search-select v-model="queryParams.deptId" :listFn="listDeptFn" label="deptName"
          option="deptId" placeholder="请选择大队" />
      </el-form-item>
      <el-form-item label="所属驻点" prop="groupId">
        <search-select
          v-model="queryParams.groupId"
          :listFn="listUnitFn" label="groupName" option="groupId" placeholder="请选择驻点" filterable
          remote />
      </el-form-item>
      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="gl-body">
      <!-- <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <router-link to="/stationaryContract/ContractQuery-add/index/0">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
              v-hasPermi="['affairs:contract:add']">新增</el-button>
          </router-link>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:contract:export']">导出</el-button>
        </el-col>
      </el-row> -->

      <el-table height="calc(100vh - 84px - 60px - 86px - 70px - 56px - 50px)" :data="contractList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="合同名字" align="center" prop="contractName" />
        <el-table-column label="所属大队" align="center" prop="deptName" />
        <el-table-column label="所属驻点" align="center" prop="groupName" width="210px" />
        <el-table-column label="保安人数" align="center" prop="staffNumber" />
        <el-table-column label="保安费用" align="center" prop="staffCosts" />
        <el-table-column label="超时补贴" align="center" prop="overTimeAllowance" />
        <el-table-column label="月费用" align="center" prop="mouthCost" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <!-- <router-link :to="'/stationaryContract/ContractQuery-add/index/' + scope.row.contractId">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['affairs:contract:edit']">修改</el-button>
            </router-link> -->
            <el-button size="mini" type="text" icon="el-icon-edit" @click="changeHistory(scope.row)"
              v-hasPermi="['affairs:staff:edit']">变更记录</el-button>

            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:contract:remove']">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <el-dialog v-dialogDrag title="驻点单位" :visible.sync="dialogTableVisible" :modal-append-to-body="false">
      <el-table :data="gridData">
        <el-table-column label="合同名字" align="center" prop="contractName" />
        <el-table-column width="210px" label="驻点" align="center" prop="groupName" />
        <el-table-column label="所属大队" align="center" prop="deptName" />
        <el-table-column label="合同编号" align="center" prop="contractNumber" />
        <el-table-column label="签约人" align="center" prop="signatory" />
        <el-table-column label="生效日期" align="center" prop="effectiveDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.effectiveDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="终止日期" align="center" prop="endDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签约日期" align="center" prop="signingDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.signingDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center" prop="head" />
        <el-table-column label="合同上交" align="center" prop="contractSubmission" />
        <el-table-column label="合同状态" align="center" prop="contractState" />
        <el-table-column label="纳税类别" align="center" prop="taxCategory" />
        <el-table-column label="保安人数" align="center" prop="staffNumber" />
        <el-table-column label="保安费用" align="center" prop="staffCosts" />
        <el-table-column label="客户发放" align="center" prop="customerDistribution" />
        <el-table-column label="护卫犬数" align="center" prop="dogNumber" />
        <el-table-column label="消控费" align="center" prop="fireControlCosts" />
        <el-table-column label="餐费补贴" align="center" prop="mealAllowance" />
        <el-table-column label="小队长补贴" align="center" prop="leaderAllowance" />
        <el-table-column label="人数" align="center" prop="peopleNumber" />
        <el-table-column label="超时补贴" align="center" prop="overTimeAllowance" />
        <el-table-column label="其他" align="center" prop="other" />
        <el-table-column label="节日补贴" align="center" prop="festivalAllowance" />
        <el-table-column label="缴费方式" align="center" prop="paymentMethod" />
        <el-table-column label="缴费周期" align="center" prop="paymentCycle" />
        <el-table-column label="缴费日" align="center" prop="paymentDate" />
        <el-table-column label="月费用" align="center" prop="mouthCost" />
        <el-table-column label="月费用备注" align="center" prop="mouthCostRemark" />
        <el-table-column label="年人费用" align="center" prop="annualPeopleCost" />
        <el-table-column label="年总费用" align="center" prop="annualTotalCost" />
        <el-table-column label="服装费" align="center" prop="dressCost" />
        <el-table-column label="餐费" align="center" prop="mealsBill" />
        <el-table-column label="续签日期" align="center" prop="renewalDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.renewalDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="其他费" align="center" prop="otherCost" />
        <el-table-column label="其他费1" align="center" prop="otherCost1" />
        <el-table-column label="其他费2" align="center" prop="otherCost2" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import searchSelect from '@/views/components/searchSelect.vue';
import { listDept, listSqua, listElem, listUnit } from "@/api/wage_manage/query";
import { listContract, getContract, delContract, exportAPI, changeInformation } from "@/api/Stationary/stationaryContract/ContractQuery.js";
import { listSquadron } from "@/api/SecurityManagement/Squadron.js";
import { listStaffUnit, Department } from "@/api/SecurityManagement/staffUnit.js";
import { listOfResidentUnits } from '@/api/Stationary/stationaryContract/unit.js'
export default {
  components: { searchSelect },
  name: "Contract",
  data() {
    return {
      dialogTableVisible: false,
      gridData: [],
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
      // 保安单位驻点合同表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        deptId: null,
        detachmentId: null,
        contingentId: null,
        contractName: null,
        contractNumber: null,
        signatoryId: null,
        effectiveDate: null,
        endDate: null,
        signingDate: null,
        headId: null,
        contractSubmission: null,
        contractState: 2,
        taxCategory: null,
        staffNumber: null,
        staffCosts: null,
        customerDistribution: null,
        dogNumber: null,
        fireControlCosts: null,
        mealAllowance: null,
        leaderAllowance: null,
        peopleNumber: null,
        overTimeAllowance: null,
        other: null,
        festivalAllowance: null,
        paymentMethod: null,
        paymentCycle: null,
        paymentDate: null,
        mouthCost: null,
        mouthCostRemark: null,
        annualPeopleCost: null,
        annualTotalCost: null,
        dressCost: null,
        mealsBill: null,
        renewalDate: null,
        otherCost: null,
        otherCost1: null,
        otherCost2: null,
      },
      Squadronlist: [],
      DepartmentList: [],
      listOfResident: [],
      listStaffUnitList: [],
      contractor: [],
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
    /** 查询保安单位驻点合同列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    async remoteMethod(query) {
      if (query) {
        // 中队
        const res = await listSquadron({ squadronName: query })
        this.Squadronlist = res.rows
        // 分队
        const res1 = await listStaffUnit({ unitName: query })
        this.listStaffUnitList = res1.rows
        // 驻点
        const res2 = await listOfResidentUnits({ groupName: query })
        this.listOfResident = res2.rows
        // 部门
        const res3 = await Department({ deptName: query })
        this.DepartmentList = res3.rows
        // console.log(this.options);
      } else {
        this.options = []
      }

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
      this.ids = selection.map(item => item.contractId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      this.open = true;
      this.title = "添加保安单位驻点合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      const contractId = row.contractId || this.ids
      getContract(contractId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改保安单位驻点合同";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const contractIds = row.contractId || this.ids;
      this.$modal.confirm('是否确认删除保安单位驻点合同编号为"' + contractIds + '"的数据项？').then(function () {
        return delContract(contractIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
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
    async changeHistory(row) {
      this.dialogTableVisible = true
      const res = await changeInformation({ contractId: row.contractId })
      console.log(res);
      this.gridData = res.rows

    },
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询中队方法
    async listSquaFn(queryParams) {
      const { rows, total } = await listSqua({
        ...queryParams,
        deptId: this.queryParams.deptId,
      })

      return { rows, total }
    },
    // 查询分队方法
    async listElemFn(queryParams) {
      const { rows, total } = await listElem({
        ...queryParams,
        squadronId: this.queryParams.squadronId,
      })

      return { rows, total }
    },
    // 查询驻点方法
    async listUnitFn(queryParams) {
      const { rows, total } = await listUnit({
        ...queryParams,
      })

      return { rows, total }
    },


  }
};
</script>
