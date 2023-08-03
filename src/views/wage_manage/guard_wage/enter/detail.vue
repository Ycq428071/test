<template>
  <div class="app-container">
    <div class="gl-body">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            v-hasPermi="['affairs:salary:add']"
            @click="$router.push('/wage_manage/guard_wage/wg_enter-add/index/' + $route.params.securityId + '/0')"
          >
            新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['affairs:salary:export']"
          >
            导出
          </el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="loading"
        :data="salaryList"
        height="calc(100vh - 84px - 60px - 50px - 56px - 50px)"
        @cell-dblclick="(row) => { detail = row; $refs.detail.openFn() }"
      >
        <el-table-column label="工资年月" align="center" prop="payday" />
        <el-table-column label="姓名" align="center" prop="securityName" />
        <el-table-column label="银行账号" align="center" prop="account" width="100" />
        <el-table-column label="证件号码" align="center" prop="certificateNumber" width="100" />
        <el-table-column label="所属大队" align="center" prop="deptName" width="110" />
        <el-table-column label="所属驻点" align="center" prop="groupName" width="250" />
        <el-table-column label="基本工资" align="center" prop="baseSalary" />
        <el-table-column label="出勤费用" align="center" prop="">
          <template slot-scope="scope">
            {{ scope.row.attendanceDays * scope.row.attendanceStandard }}
          </template>
        </el-table-column>
        <el-table-column label="超时补贴" align="center" prop="overtimeAllowance" />
        <el-table-column label="餐费" align="center" prop="mealAllowance" />
        <el-table-column label="考核工资" align="center" prop="probationSalary" />
        <el-table-column label="岗位补贴" align="center" prop="situationAllowance" />
        <el-table-column label="补足工资" align="center" prop="repaySalary" />
        <el-table-column label="缺员加班" align="center" prop="shorthandedOvertime" />
        <el-table-column label="工龄工资" align="center" prop="seniorityPay" />
        <el-table-column label="职务工资" align="center" prop="jobSalary" />
        <el-table-column label="服装津贴" align="center" prop="clothesAllowance" />
        <el-table-column label="加班费用" align="center" prop="overtimePay" />
        <el-table-column label="节日费用" align="center" prop="holidayFee" />
        <el-table-column label="低保补贴" align="center" prop="subsistenceAllowance" />
        <el-table-column label="其他1" align="center" prop="otherAllowance1" />
        <el-table-column label="其他2" align="center" prop="otherAllowance2" />
        <el-table-column label="应发工资" align="center" prop="shouldSalary" />
        <el-table-column label="请假扣划" align="center" prop="offWorkDeduct" />
        <el-table-column label="养老金" align="center" prop="pension" />
        <el-table-column label="医保" align="center" prop="medicalInsurance" />
        <el-table-column label="失业" align="center" prop="unemploymentInsurance" />
        <el-table-column label="公积金（原大病）" align="center" prop="seriousIllness" width="130" />
        <el-table-column label="意外险" align="center" prop="accidentInsurance1" />
        <el-table-column label="意外险2" align="center" prop="accidentInsurance2" />
        <el-table-column label="违纪工资" align="center" prop="breachPrinciple" />
        <el-table-column label="不上班扣款" align="center" prop="absenteeism" width="90" />
        <el-table-column label="其他扣款1" align="center" prop="otherDeduct1" />
        <el-table-column label="其他扣款2" align="center" prop="otherDeduct2" />
        <el-table-column label="保险补扣" align="center" prop="insuranceDeduct" />
        <el-table-column label="个税" align="center" prop="incomeTax" />
        <el-table-column label="实发工资" align="center" prop="actualSalary" />
        <el-table-column label="卡工资" align="center" prop="cardSalary" />
        <el-table-column label="制表日期" align="center" prop="createDate" />
        <el-table-column label="制表人" align="center" prop="createUserName" />
        <el-table-column label="复核日期" align="center" prop="checkDate" />
        <el-table-column label="复核人" align="center" prop="checkUserName" />

        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['']"
              @click="$router.push('/wage_manage/guard_wage/wg_enter-update/index/' + $route.params.securityId + '/' + scope.row.id + '?row=' + JSON.stringify(scope.row))"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['']"
            >删除</el-button>
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

    <!-- 详情弹窗 -->
    <detail-dialog
      ref="detail"
      title="保安工资详情"
      width="1560px"
      label-width="106px"
      span="4.5"
      :config="enterConfig"
      :detail="detail"
    />
  </div>
</template>

<script>
import { listStream, delSalary, enterConfig } from "@/api/wage_manage/guard_wage";
import DetailDialog from '@/views/components/detailDialog.vue'

export default {
  name: 'Wg_enter-detail',
  components: { DetailDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 保安工资表格数据
      salaryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 详情参数
      enterConfig,
      detail: {},
    }
  },
  watch: {
    $route(route) {
      if(route.name === 'Wg_enter-detail') this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询保安工资列表 */
    getList() {
      this.loading = true;
      listStream(this.$route.params.securityId, this.queryParams).then(response => {
        this.salaryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除保安工资编号为"' + ids + '"的数据项？').then(function() {
        return delSalary(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/salary/employee/exportSalaryDetailByEmpId?empId=' + this.$route.params.securityId, {
      }, `保安工资表_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
