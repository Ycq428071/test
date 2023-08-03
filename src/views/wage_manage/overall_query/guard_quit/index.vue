<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="gl-search_form">
      <el-form-item label="保安姓名" prop="securityName">
        <el-input
          v-model="queryParams.securityName"
          placeholder="请输入保安姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select
          v-model="queryParams.deptId"
          :listFn="listDeptFn"
          label="deptName"
          option="deptId"
          placeholder="请选择所属大队"
          clearable
        />
      </el-form-item>
      <el-form-item label="所属驻点" prop="stagnationPointId">
        <search-select
          v-model="queryParams.stagnationPointId"
          :listFn="listUnitFn"
          label="groupName"
          option="groupId"
          placeholder="请选择驻点"
          filterable
          clearable
        />
      </el-form-item>

      <el-popover
        popper-class="gl-search_popover"
        placement="bottom"
        trigger="click"
      >
        <el-form :model="queryParams" ref="queryFormMore" :inline="true" class="gl-search_form">
          <el-form-item label="保安级别" prop="securityLevel">
            <el-select v-model="queryParams['securityLevel']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['securitylevel']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码" prop="certificateNumber">
            <el-input
              v-model="queryParams['certificateNumber']"
              placeholder="请输入证件号码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="证件类型" prop="certificateType">
            <el-select v-model="queryParams['certificateType']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['query_certificate_type']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams['status']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['query_guard_state']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="queryParams['sex']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['sys_user_sex']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="婚姻" prop="marriage">
            <el-select v-model="queryParams['marriage']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['marriage']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select v-model="queryParams['nation']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['nation']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文化程度" prop="education">
            <el-select v-model="queryParams['education']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['education']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="政治面貌" prop="politicalOutlook">
            <el-select v-model="queryParams['politicalOutlook']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['politicaloutlook']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退伍" prop="discharge">
            <el-select v-model="queryParams['discharge']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['discharge']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资格证" prop="qualification">
            <el-select v-model="queryParams['qualification']">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="item in dict.type['qualification']"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登记起始日期" prop="reportStartDate">
            <el-date-picker
              v-model="queryParams['reportStartDate']"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="登记终止日期" prop="reportEndDate">
            <el-date-picker
              v-model="queryParams['reportEndDate']"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="离职起始日期" prop="">
            <el-date-picker
              v-model="queryParams['']"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="离职终止日期" prop="">
            <el-date-picker
              v-model="queryParams['']"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="身高(cm)大于" prop="heightGt">
            <el-input
              v-model="queryParams['heightGt']"
              placeholder="请输入身高"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="身高(cm)小于" prop="heightLt">
            <el-input
              v-model="queryParams['heightLt']"
              placeholder="请输入身高"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="户籍地址" prop="registeredResidenceAddress">
            <el-input
              v-model="queryParams['registeredResidenceAddress']"
              placeholder="请输入户籍地址"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-form>

        <el-button slot="reference" type="text" icon="el-icon-d-arrow-right">更多</el-button>
      </el-popover>

      <el-form-item class="gl-search_button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="gl-body">
      <el-table v-loading="loading" :data="staffList" height="calc(100vh - 84px - 60px - 106px - 50px - 50px)">
        <el-table-column label="保安姓名" align="center" prop="securityName" />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" />
        <el-table-column label="银行账号" align="center" prop="account" />
        <el-table-column label="登记日期" align="center" prop="reportDate" width="100" />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" />
        <el-table-column label="所属驻点" align="center" prop="groupName" width="250" />

        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['']"
              @click="$refs.wageDialog.openFn({ securityId: scope.row.securityId })"
            >
              薪水信息
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['']"
              @click="$refs.resumeDialog.openFn({ securityId: scope.row.securityId })"
            >
              履历信息
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['']"
              @click="$refs.relationshipDialog.openFn({ securityId: scope.row.securityId })"
            >
              社会关系信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div v-show="total<=0" style="height: 50px"></div>
    </div>

    <!-- 薪水信息弹窗 -->
    <log-dialog
      ref="wageDialog"
      title="薪水信息"
      height="calc(100vh - 370px)"
      :columns="wageInfoTable"
      :listFn="logFn"
    />
    <!-- 个人履历信息弹窗 -->
    <log-dialog
      ref="resumeDialog"
      title="保安变更浏览"
      height="calc(100vh - 370px)"
      :columns="resumeTable"
      :listFn="logFn"
    />
    <!-- 家庭成员及在杭社会关系信息弹窗 -->
    <log-dialog
      ref="relationshipDialog"
      title="保安变更浏览"
      height="calc(100vh - 370px)"
      :columns="relationshipTable"
      :listFn="logFn"
    />
  </div>
</template>

<script>
import { listGuard } from "@/api/wage_manage/guard_wage"
import { staffLog, staffLogColumns } from "@/api/wage_manage/log"
import { listDept, listSqua, listElem, listUnit } from "@/api/wage_manage/query"
import { wageInfoTable, resumeTable, relationshipTable } from "@/api/wage_manage/overall_query"
import searchSelect from '@/views/components/searchSelect.vue'
import logDialog from '@/views/components/logDialog.vue'

export default {
  name: "Guard_quit",
  dicts: [
    'securitylevel',
    'query_certificate_type',
    'query_guard_state',
    'sys_user_sex',
    'marriage',
    'nation',
    'education',
    'politicaloutlook',
    'discharge',
    'qualification',
  ],
  components: { searchSelect, logDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 保安人员管理表格数据
      staffList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sceneFlag: 0,
        'securityName': null,
        'deptId': null,
        'squadronId': null,
        'unitId': null,
        'stagnationPointId': null,
        'securityLevel': null,
        'certificateNumber': null,
        'certificateType': null,
        'status': null,
        'sex': null,
        'marriage': null,
        'nation': null,
        'education': null,
        'politicalOutlook': null,
        'discharge': null,
        'qualification': null,
        'reportStartDate': null,
        'reportEndDate': null,
        '': null,
        '': null,
        'heightGt': null,
        'heightLt': null,
        'registeredResidenceAddress': null,
      },
      // 薪水信息配置表
      wageInfoTable,
      // 个人履历信息配置表
      resumeTable,
      // 家庭成员及在杭社会关系信息配置表
      relationshipTable,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安人员管理列表 */
    getList() {
      this.loading = true;
      listGuard(this.queryParams).then(response => {
        this.staffList = response.rows = [{}]
        this.total = response.total = 0
        this.loading = false
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.resetForm("queryFormMore")
      this.handleQuery()
    },
    // 查询部门方法
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

    // 查看保安变更记录
    async logFn(queryParams) {
      const { rows, total } = await staffLog(queryParams)

      return { rows, total }
    },
  }
};
</script>
