<template>
  <div class="app-container">
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <!-- <router-link :to="{
            name: 'insure-add', query: {
              insureId: 0,
              securityId: securityId
            }
          }">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
              v-hasPermi="['affairs:insure:add']">新增</el-button>
          </router-link> -->
          <el-button type="primary" icon="el-icon-plus" 
            @click="$router.push('/SecurityManagement/insure-add/index/0?securityId=' + securityId)"
            v-hasPermi="['affairs:insure:add']">新增</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="insureList" @selection-change="handleSelectionChange" height="calc(100vh - 244px - 56px)">
        <el-table-column label="保安保险" align="center" prop="insureId" />
        <el-table-column label="保安人员" align="center" prop="securityName">
          <template slot-scope="scope">
            <span>{{ scope.row.securityStaff.securityName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否特困" align="center" prop="isDestitute">
          <template slot-scope="scope">
            <span v-if="scope.row.isDestitute == 0">否</span>
            <span v-if="scope.row.isDestitute == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="月缴纳基数" align="center" prop="monthlyBase" />
        <el-table-column label="养老保险" align="center" prop="endowmentInsurance" />
        <el-table-column label="医疗保险" align="center" prop="medicalInsurance" />
        <el-table-column label="大病保险" align="center" prop="sicknessInsurance" />
        <el-table-column label="失业保险" align="center" prop="unemploymentInsurance" />
        <el-table-column label="公积金保险" align="center" prop="accumulationFundInsurance" />
        <el-table-column label="停保状态" align="center" prop="offMaintenanceStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.offMaintenanceStatus == 0">否</span>
            <span v-if="scope.row.offMaintenanceStatus == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="停保人" align="center" prop="offMaintenancePeople" />
        <el-table-column label="操作" align="center" fixed="right" width="180px">
          <template slot-scope="scope">
            <!-- <router-link :to="{ name: 'insure-add', query: { insureId: scope.row.insureId, securityId: securityId } }">
              <el-button style="margin: 0 10px;" size="mini" type="text"
                @click="$router.push('/SecurityManagement/insure-add/index/' + scope.row.insureId + '?securityId=' + securityId)"
              v-hasPermi="['affairs:insure:edit']">修改</el-button>
            </router-link> -->
            <el-button size="mini" type="text"
              @click="$router.push('/SecurityManagement/insure-add/index/' + scope.row.insureId + '?securityId=' + securityId)"
              v-hasPermi="['affairs:insure:edit']">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              v-hasPermi="['affairs:insure:remove']">停保</el-button>
            <el-button size="mini" type="text" @click="changeHistory(scope.row)"
              v-hasPermi="['affairs:staff:edit']">变更记录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div v-show="total<=0" style="height: 50px" />
    </div>
    <el-dialog v-dialogDrag title="变更记录" :visible.sync="dialogTableVisible" :modal-append-to-body="false" width="80vw">
      <el-table v-loading="loading" :data="gridData" @selection-change="handleSelectionChange">
        <el-table-column label="保安保险" align="center" prop="insureId" />
        <el-table-column label="保安人员" align="center" prop="securityId">
          <template slot-scope="scope">
            <span>{{ scope.row.securityStaff.securityName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="社会保障号" align="center" prop="socialSecurityNumber" width="90" />
        <el-table-column label="参保起始年月" align="center" prop="insureStartTime" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.insureStartTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否特困" align="center" prop="isDestitute">
          <template slot-scope="scope">
            <span v-if="scope.row.isDestitute == 0">否</span>
            <span v-if="scope.row.isDestitute == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="机构审核日期" align="center" prop="institutionalReviewTime" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.institutionalReviewTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="填报日期" align="center" prop="fillingDate" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.fillingDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="月缴纳基数" align="center" prop="monthlyBase" width="90" />
        <el-table-column label="养老保险" align="center" prop="endowmentInsurance" />
        <el-table-column label="医疗保险" align="center" prop="medicalInsurance" />
        <el-table-column label="大病保险" align="center" prop="sicknessInsurance" />
        <el-table-column label="失业保险" align="center" prop="unemploymentInsurance" />
        <el-table-column label="公积金保险" align="center" prop="accumulationFundInsurance" width="90" />
        <el-table-column label="其他保险" align="center" prop="otherInsurance" />
        <el-table-column label="审核日期" align="center" prop="approvedDate" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构受理日期" align="center" prop="institutionalAcceptanceDate" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.institutionalAcceptanceDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否受理成功" align="center" prop="isAccepted" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isAccepted == 0">否</span>
            <span v-if="scope.row.isAccepted == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="医保起始年月" align="center" prop="medicalInsuranceStartDate" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.medicalInsuranceStartDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领卡日期" align="center" prop="cardCollectionDate" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.cardCollectionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="停保状态" align="center" prop="offMaintenanceStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.offMaintenanceStatus == 0">否</span>
            <span v-if="scope.row.offMaintenanceStatus == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="停保日期" align="center" prop="offMaintenanceDate" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.offMaintenanceDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="停保编号" align="center" prop="offMaintenanceNumber" />
        <el-table-column label="停保人" align="center" prop="offMaintenancePeople" />
        <el-table-column label="停保备注" align="center" prop="offMaintenanceRemark" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createDate" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="ditotal > 0" :total="ditotal" :page.sync="diqueryParams.pageNum"
        :limit.sync="diqueryParams.pageSize" @pagination="changeHistory" />
    </el-dialog>

    <el-dialog v-dialogDrag title="保险" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form style="width: 40%;  margin: 0 auto;" label-width="100px">
        <el-form-item label="保险基数" prop="monthlyBase">
          <el-input v-model="monthlyBase" placeholder="请输入保险基数" />
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="submit">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog v-dialogDrag title="停保" :visible.sync="suspensiondialogVisible" width="600px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="停保" prop="offMaintenanceDate">
          <el-select v-model="form.offMaintenanceStatus" placeholder="请选择" style="width: 100%">
            <el-option label="解除" :value="0">
            </el-option>
            <el-option label="未解除" :value="1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停保日期" prop="offMaintenanceDate">
          <el-date-picker clearable v-model="form.offMaintenanceDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择停保日期" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="停保编号" prop="offMaintenanceNumber">
          <el-input v-model="form.offMaintenanceNumber" placeholder="请输入停保日期" />
        </el-form-item>
        <!-- <el-form-item label="停保人" prop="offMaintenancePeople">
          <el-input v-model="form.offMaintenancePeople" placeholder="请输入停保人" />
        </el-form-item> -->
        <el-form-item label="停保备注" prop="offMaintenanceRemark">
          <el-input v-model="form.offMaintenanceRemark" placeholder="请输入停保备注" />
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="suspensubmit">确 定</el-button>
          <el-button @click="suspencancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { updateInsure, listInsure, getInsure, changeHistory, insuranceBaseAdjustments, exportAPI } from "@/api/SecurityManagement/insure.js";

export default {
  dicts: ['offmaintenancestatus'],
  name: "SSecuritymanagement",
  data() {
    return {
      diqueryParams: {},
      ditotal: 0,
      form: {},
      suspensiondialogVisible: false,
      monthlyBase: '',
      dialogVisible: false,
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
      // 保安保险管理表格数据
      insureList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        securityId: null,
        socialSecurityNumber: null,
        insureStartTime: null,
        isDestitute: null,
        institutionalReviewTime: null,
        fillingDate: null,
        monthlyBase: null,
        endowmentInsurance: null,
        medicalInsurance: null,
        sicknessInsurance: null,
        unemploymentInsurance: null,
        accumulationFundInsurance: null,
        otherInsurance: null,
        approvedDate: null,
        institutionalAcceptanceDate: null,
        // isAccepted: 1,
        medicalInsuranceStartDate: null,
        cardCollectionDate: null,
        offMaintenanceStatus: null,
        offMaintenanceDate: null,
        offMaintenanceNumber: null,
        offMaintenancePeople: null,
        offMaintenanceRemark: null,
        createDate: null
      },
      dialogTableVisible: false,
      gridData: [],
      securityId: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询保安保险管理列表 */
    getList() {
      this.securityId = this.$route.params.securityId
      this.loading = true;
      this.queryParams.securityId = this.$route.params.securityId
      listInsure(this.queryParams).then(response => {
        this.insureList = response.rows;
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
      this.ids = selection.map(item => item.insureId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row.insureId);
      const insureId = row.insureId || this.ids
      getInsure(insureId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改保安保险管理";
      });
      // this.$router.push({
      //   params: row
      // })
    },

    /** 停保按钮操作 */
    handleDelete(row) {
      this.form = row
      this.suspensiondialogVisible = true
    },
    suspensubmit() {
      // if (this.form.offMaintenanceStatus) {
      //   this.form.offMaintenanceStatus = 0
      // } else {
      //   this.form.offMaintenanceStatus = null
      // }
      updateInsure(this.form).then(response => {
        this.$modal.msgSuccess("成功");
        this.suspensiondialogVisible = false;
        this.getList();
      });
    },
    suspencancel() {
      this.suspensiondialogVisible = false
    },


    async changeHistory(row) {
      this.diqueryParams.insureId = row.insureId
      const res = await changeHistory(this.diqueryParams)
      console.log(res);
      this.dialogTableVisible = true
      this.gridData = res.rows
      this.ditotal = res.total
    },

    async submit() {
      this.dialogVisible = false
      await insuranceBaseAdjustments({ monthlyBase: this.monthlyBase })

    },
    cancel() {
      this.dialogVisible = false
    },
    /** 新增按钮操作 */
    handleAdd() {

    },
  }
};
</script>
