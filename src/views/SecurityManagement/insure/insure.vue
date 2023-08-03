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
          <el-button plain icon="el-icon-s-operation" @click="contractBase"
            v-hasPermi="['affairs:insure:export']">保险基数调整</el-button>
        </el-col> -->

        <!-- <el-row :gutter="10" class="mb8"> -->
        <el-col :span="1.5">

        </el-col>
        <!-- </el-row> -->
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="suspensionOfCoveragehandleExport"
            v-hasPermi="['affairs:insure:export']">保险停保导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" @click="handleExport"
            v-hasPermi="['affairs:insure:export']">导出</el-button>
        </el-col>
      </el-row>
      <el-table height="calc(100vh - 84px - 60px - 86px - 70px - 56px - 50px)" v-loading="loading" :data="staffList"
        @selection-change="handleSelectionChange" @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }">
        <el-table-column label="保安姓名" align="center" prop="securityName" />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" />
        <el-table-column label="所属驻点" align="center" prop="groupName" width="250" />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">在职</span>
            <span v-if="scope.row.status == 1">变更</span>
            <span v-if="scope.row.status == 2">离职</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            
            <!-- <router-link :to="'/SecurityManagement/insure-add/index/' + scope.row.securityId">
              <el-button icon="el-icon-edit" type="text">新增保险</el-button>
            </router-link> -->



            <router-link :to="'/securitymanagement/Securitymanagement/index/' + scope.row.securityId">
              <el-button size="mini" type="text">保险</el-button>
            </router-link>

            <el-button style="margin: 0 10px;" size="mini" type="text"
              @click="changeHistory(scope.row)" v-hasPermi="['affairs:staff:edit']">变更记录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <el-dialog v-dialogDrag title="变更记录" :visible.sync="dialogTableVisible" :modal-append-to-body="false" width="80vw">
      <el-table :data="gridData">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column width="150" label="保安姓名" align="center" prop="securityName" />
        <el-table-column width="150" label="所属大队" align="center" prop="deptName" />
        <el-table-column width="150" label="所属驻点" align="center" prop="groupId" show-overflow-tooltip />
        <el-table-column width="180" label="证件号码" align="center" prop="certificateNumber" />
        <el-table-column width="150" label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">在职</span>
            <span v-if="scope.row.status == 1">变更</span>
            <span v-if="scope.row.status == 2">离职</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="证件类型" align="center" prop="certificateType" />
        <el-table-column width="150" label="银行账号" align="center" prop="account" />
        <el-table-column width="150" label="出生日期" align="center" prop="birthday" />
        <el-table-column width="150" label="报道日期" align="center" prop="reportDate" />
        <el-table-column width="150" label="使用开始日期" align="center" prop="trialStartDate" />
        <el-table-column width="150" label="使用截止日期" align="center" prop="trialEndDate" />
        <el-table-column width="150" label="性别" align="center" prop="sex">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="婚姻" align="center" prop="marriage">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.marriage" :value="scope.row.marriage" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="民族" align="center" prop="nation">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.nation" :value="scope.row.nation" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="文化程度" align="center" prop="education">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.education" :value="scope.row.education" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="政治面貌" align="center" prop="politicalOutlook">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.politicaloutlook" :value="scope.row.politicaloutlook" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="退伍" align="center" prop="discharge">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.discharge" :value="scope.row.discharge" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="健康状况" align="center" prop="health">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.health" :value="scope.row.health" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="资格证" align="center" prop="qualification">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.qualification" :value="scope.row.qualification" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="保安级别" align="center" prop="securityLevel">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.securitylevel" :value="scope.row.securitylevel" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="户籍性质" align="center" prop="domicile">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.domicile" :value="scope.row.domicile" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="养老保险" align="center" prop="endowmentInsurance">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.endowmentinsurance" :value="scope.row.endowmentinsurance" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="身高" align="center" prop="height" />
        <el-table-column width="150" label="上岗日期" align="center" prop="onBoardDate" />
        <el-table-column width="150" label="保安证编号" align="center" prop="reportNumber" />
        <el-table-column width="150" label="户籍地址" align="center" prop="registeredResidenceAddress" />
        <el-table-column width="150" label="联系电话" align="center" prop="telephone" />
        <el-table-column width="150" label="现居地址" align="center" prop="currentAddress" />
        <el-table-column width="150" label="手机号码" align="center" prop="phoneNumber" />
        <el-table-column width="150" label="银行类型" align="center" prop="bankType" />
        <el-table-column width="150" label="合同开始日期" align="center" prop="contractStartDate" />
        <el-table-column width="150" label="合同截止日期" align="center" prop="contractEndDate" />
        <el-table-column width="150" label="意外险" align="center" prop="accidentInsurance">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.accidentinsurance" :value="scope.row.accidentinsurance" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="职业等级" align="center" prop="joblevel">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.joblevel" :value="scope.row.joblevel" />
          </template>
        </el-table-column>
        <el-table-column width="150" label="创建者" align="center" prop="createBy" />
        <el-table-column width="150" label="创建时间" align="center" prop="createTime" />
        <el-table-column width="150" label="更新者" align="center" prop="updateBy" />
        <el-table-column width="150" label="更新时间" align="center" prop="updateTime" />
        <el-table-column width="150" label="备注" align="center" prop="remark" />
      </el-table>
      <pagination v-show="pagtotal > 0" :total="pagtotal" :page.sync="pagqueryParams.pageNum"
        :limit.sync="pagqueryParams.pageSize" @pagination="gridData" />
    </el-dialog>

    <!-- 详情弹窗 -->
    <detail-dialog ref="detail" title="保险详情" width="1300px" label-width="106px" span="4.5" :config="queryConfig"
      :detail="detail" :dict="dict" />
  </div>
</template>

<script>
import { listStaff, changeHistory } from "@/api/SecurityManagement/Security.js";
import { exportAPI } from "@/api/SecurityManagement/insure.js";
import { listDept } from "@/api/wage_manage/query";
import searchSelect from '@/views/components/searchSelect.vue';
import DetailDialog from '@/views/components/detailDialog.vue'
export default {
  dicts: ['sys_user_sex', 'sys_status', 'marriage', 'nation', 'education', 'politicaloutlook', 'discharge', 'health', 'qualification', 'securitylevel', 'recordproof', 'domicile', 'endowmentinsurance', 'retirementcertificate', 'accidentinsurance', 'clothingdeposit', 'joblevel'],
  name: "Insure",
  components: { searchSelect, DetailDialog },
  data() {
    return {
      queryConfig: [
        { label: '保安姓名', value: 'securityName' },
        { label: '所属驻点', value: 'groupId' },
        { label: '所属大队', value: 'deptName' },
        { label: '证件号码', value: 'certificateNumber' },
        { label: '状态', value: 'status', dict: 'sys_status' },
        { label: '证件类型', value: 'certificateType' },
        { label: '银行账号', value: 'account' },
        { label: '出生日期', value: 'birthday' },
        { label: '报道日期', value: 'reportDate' },
        { label: '使用开始日期', value: 'trialStartDate' },
        { label: '使用截止日期', value: 'trialEndDate' },
        { label: '性别', value: 'sex', dict: 'sys_user_sex' },
        { label: '婚姻', value: 'marriage', dict: 'marriage' },
        { label: '民族', value: 'nation', dict: 'nation' },
        { label: '文化程度', value: 'education', dict: 'education' },
        { label: '政治面貌', value: 'politicalOutlook', dict: 'politicaloutlook' },
        { label: '退伍', value: 'discharge', dict: 'discharge' },
        { label: '健康状况', value: 'health', dict: 'health' },
        { label: '资格证', value: 'qualification', dict: 'qualification' },
        { label: '保安级别', value: 'securityLevel', dict: 'securitylevel' },
        { label: '户籍性质', value: 'domicile', dict: 'domicile' },
        { label: '养老保险', value: 'endowmentInsurance', dict: 'endowmentinsurance' },
        { label: '身高', value: 'height' },
        { label: '服装款', value: 'clothingStyle' },
        { label: '上岗日期', value: 'onBoardDate' },
        { label: '保安证编号', value: 'reportNumber' },
        { label: '户籍地址', value: 'registeredResidenceAddress' },
        { label: '联系电话', value: 'telephone' },
        { label: '现居地址', value: 'currentAddress' },
        { label: '手机号码', value: 'phoneNumber' },
        { label: '银行类型', value: 'bankType' },
        { label: '合同开始日期', value: 'contractStartDate' },
        { label: '合同截止日期', value: 'contractEndDate' },
        { label: '意外险', value: 'accidentInsurance', dict: 'accidentinsurance' },
        { label: '职业等级', value: 'joblevel', dict: 'joblevel' },
        { label: '创建者', value: 'createBy' },
        { label: '创建时间', value: 'createTime' },
        { label: '更新者', value: 'updateBy' },
        { label: '更新时间', value: 'updateTime' },
        { label: '备注', value: 'remark' },
      ],
      detail: {},
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
        endowmentInsurance: 1,
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
      listStaff(this.queryParams).then(response => {
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
    async changeHistory(row) {
      this.pagqueryParams.securityId = row.securityId
      // console.log(typeof row.securityId);
      const res = await changeHistory(this.pagqueryParams)
      console.log(res);
      this.dialogTableVisible = true
      this.gridData = res.rows
      this.pagtotal = res.total
    },
    contractBase() {
      this.dialogVisible = true
      this.monthlyBase = ''

    },
    // 保险停保导出
    suspensionOfCoveragehandleExport() {
      this.download('/affairs/insure/noInsuranceExport', {
      }, `保险停保表_${new Date().getTime()}.xlsx`)
    },

    /** 导出按钮操作 */
    async handleExport() {
      exportAPI(this.ids)
        .then((res) => {
          const fileName = `保险表_${new Date().getTime()}.xlsx`
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
