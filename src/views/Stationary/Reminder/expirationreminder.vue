<template>
  <div class="app-container">
    <el-form class="gl-search_form" :model="queryParams" ref="queryForm" :inline="true"
      label-width="100px">
      <el-form-item label="提醒内容" prop="contractName">
        <el-input v-model="queryParams.contractName" placeholder=""></el-input>
      </el-form-item>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:contract:exportExpireList']">导出</el-button>
        </el-col>
      </el-row>

      <el-table
        ref="table"
        border
        @header-dragend="$nextTick(() => { $refs.table.doLayout() })" height="calc(100vh - 244px - 106px - 56px)" :data="contractList"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="过期天数" align="center" prop="expirationDays" show-overflow-tooltip />
        <el-table-column label="提醒内容" align="center" prop="reminderContent" show-overflow-tooltip />
        <el-table-column label="合同人数" align="center" prop="contractPeople" show-overflow-tooltip />
        <el-table-column label="到期时间" align="center" prop="endDate" show-overflow-tooltip />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
  </div>
</template>

<script>
import searchSelect from '@/views/components/searchSelect.vue';
import { listOfExpiredContracts, exportAPI } from '@/api/Stationary/Reminder/expirationreminder.js'

export default {
  components: { searchSelect },
  name: "Contract",
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
        contractState: null,
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
        unitId: this.queryParams.unitId,
      })

      return { rows, total }
    },
    /** 查询保安单位驻点合同列表 */
    getList() {
      this.loading = true;
      listOfExpiredContracts(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.contractId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    // async handleExport() {
    //   exportAPI(this.ids)
    //     .then((res) => {
    //       const fileName = 'xxx'
    //       const contentType =
    //         'application/vnd.ms-excel'
    //       this.exportFile(res, contentType, fileName)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // },
    handleExport() {
      const exportParams = {}
      for(const k in this.queryParams) {
        if(k !== 'pageNum' && k !== 'pageSize') {
          exportParams[k] = this.queryParams[k]
        }
      }
      this.download('/affairs/contract/exportExpireList', {
        ...exportParams
      }, `合同到期提醒表_${new Date().getTime()}.xlsx`)
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
  }
};
</script>
