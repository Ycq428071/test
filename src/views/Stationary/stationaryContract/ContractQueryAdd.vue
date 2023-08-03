<template>
  <div class="gl-form_container">
    <el-form ref="form" :model="form" :rules="rules" label-width="125px" inline>
      <el-form-item label="合同名称" prop="contractName">
        <el-input v-model="form.contractName" :disabled="flag === 3 || flag === 4" placeholder="请输入合同名称" />
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNumber">
        <el-input v-model="form.contractNumber" :disabled="flag === 3 || flag === 4" placeholder="请输入合同编号" />
      </el-form-item>
      <el-form-item label="签约人" prop="signatoryId">
        <search-select v-model="form.signatoryId" :listFn="listSignFn" :backArr="backObj.sign"
          label="userName" option="userId" placeholder="请选择签约人" :disabled="flag === 3 || flag === 4" filterable />
      </el-form-item>
      <el-form-item label="负责人" prop="headId">
        <search-select v-model="form.headId" :listFn="listHeadFn" :backArr="backObj.head"
          label="headName" option="staffHeadId" placeholder="请选择负责人" :disabled="flag === 3 || flag === 4" filterable />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select v-model="form.deptId" :listFn="listDeptFn" :backArr="backObj.dept"
          label="deptName" option="deptId" placeholder="请选择大队" :disabled="flag === 3 || flag === 4" filterable />
      </el-form-item>
      <el-form-item label="单位类别" prop="unitCategory">
          <el-select v-model="form.unitCategory" placeholder="请选择单位类别" :style="{ width: '100%' }" :disabled="flag === 3 || flag === 4">
            <el-option v-for="dict in dict.type.un" :key="dict.value" :label="dict.label"
              :value="Number(dict.value)"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="合同上交" prop="contractSubmission">
        <el-select v-model="form.contractSubmission" placeholder="请选择合同上交" :style="{ width: '100%' }" :disabled="flag === 3 || flag === 4">
          <el-option v-for="dict in dict.type.contractsubmission" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缴费方式" prop="paymentMethod">
        <el-select v-model="form.paymentMethod" placeholder="请选择合同上交" :style="{ width: '100%' }" :disabled="flag === 3 || flag === 4">
          <el-option v-for="dict in dict.type.paymentmethod" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缴费周期" prop="paymentCycle">
        <el-select v-model="form.paymentCycle" placeholder="请选择缴费周期" :style="{ width: '100%' }" :disabled="flag === 3 || flag === 4">
          <el-option v-for="dict in dict.type.paymentcycle" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签约日期" prop="signingDate">
        <el-date-picker clearable v-model="form.signingDate" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择签约日期" style="width: 100%" :disabled="flag === 3 || flag === 4">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="生效日期" prop="effectiveDate">
        <el-date-picker clearable v-model="form.effectiveDate" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择生效日期" style="width: 100%">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="终止日期" prop="endDate">
        <el-date-picker clearable v-model="form.endDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择终止日期" style="width: 100%">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="保安人数" prop="staffNumber">
        <el-input-number
          class="ipt-number"
          placeholder="请输入保安人数"
          v-model="form.contractCostLog.staffNumber"
          :controls="false"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="保安费用" prop="staffCosts">
        <el-input-number
          class="ipt-number"
          placeholder="请输入保安费用"
          v-model="form.contractCostLog.staffCosts"
          :controls="false"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="消控人数" prop="fireControlNum">
        <el-input-number
          class="ipt-number"
          placeholder="请输入消控人数"
          v-model="form.contractCostLog['fireControlNum']"
          :controls="false"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="消控单价" prop="fireControlCosts">
        <el-input-number
          class="ipt-number"
          placeholder="请输入消控单价"
          v-model="form.contractCostLog.fireControlCosts"
          :controls="false"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="餐费补贴" prop="mealAllowance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入餐费补贴"
          v-model="form.contractCostLog.mealAllowance"
          :controls="false"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="小队长补贴" prop="leaderAllowance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入小队长补贴"
          v-model="form.contractCostLog.leaderAllowance"
          :controls="false"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="超时补贴" prop="overTimeAllowance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入超时补贴"
          v-model="form.contractCostLog.overTimeAllowance"
          :controls="false"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="其他费" prop="otherCost">
        <el-input-number
          class="ipt-number"
          v-model="form.contractCostLog.otherCost"
          placeholder="请输入其他费"
          :controls="false"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="月费用" prop="mouthCost">
        <el-input-number
          class="ipt-number"
          placeholder="请输入月费用"
          v-model="form.contractCostLog.mouthCost"
          :controls="false"
          :precision="2"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="年人费用" prop="annualPeopleCost">
        <el-input-number
          class="ipt-number"
          placeholder="请输入年人费用"
          v-model="form.contractCostLog.annualPeopleCost"
          :controls="false"
          :precision="2"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="年总费用" prop="annualTotalCost">
        <el-input-number
          class="ipt-number"
          placeholder="请输入年总费用"
          v-model="form.contractCostLog.annualTotalCost"
          :controls="false"
          :precision="2"
          :disabled="flag === 2"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" :disabled="flag === 3 || flag === 4" />
      </el-form-item>
    </el-form>

    <div class="gl-form_btns">
      <el-button
        v-if="flag !== 2"
        type="info"
        @click="calcFn"
      >计 算</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

    <!-- <el-form-item label="服装费" prop="dressCost">
      <el-input-number
        class="ipt-number"
        placeholder="请输入服装费"
        v-model="form.dressCost"
        :controls="false"
      />
    </el-form-item>
    <el-form-item label="餐费" prop="mealsBill">
      <el-input-number
        class="ipt-number"
        placeholder="请输入餐费"
        v-model="form.mealsBill"
        :controls="false"
      />
    </el-form-item> -->

    <!-- <el-form-item label="续签日期" prop="renewalDate">
      <el-date-picker clearable v-model="form.renewalDate" type="date" value-format="yyyy-MM-dd"
        placeholder="请选择续签日期" style="width: 100%">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="人数" prop="peopleNumber">
      <el-input v-model="form.peopleNumber" placeholder="请输入人数" />
    </el-form-item>
    <el-form-item label="节日补贴" prop="festivalAllowance">
      <el-input v-model="form.festivalAllowance" placeholder="请输入节日补贴" />
    </el-form-item>
    <el-form-item label="其他费1" prop="otherCost1">
      <el-input v-model="form.otherCost1" placeholder="请输入其他费1" />
    </el-form-item>
    <el-form-item label="其他费2" prop="otherCost2">
      <el-input v-model="form.otherCost2" placeholder="请输入其他费2" />
    </el-form-item>
    <el-form-item label="其他" prop="other">
      <el-input v-model="form.other" placeholder="请输入其他" />
    </el-form-item> -->

    <!-- <el-form-item label="客户发放" prop="customerDistribution">
      <el-input v-model="form.customerDistribution" placeholder="请输入客户发放" />
    </el-form-item>
    <el-form-item label="护卫犬数" prop="dogNumber">
      <el-input v-model="form.dogNumber" placeholder="请输入护卫犬数" />
    </el-form-item>
    <el-form-item label="缴费日" prop="paymentDate">
      <el-input v-model="form.paymentDate" placeholder="请输入缴费日" />
    </el-form-item>
    <el-form-item label="纳税类别" prop="taxCategory">
      <el-select v-model="form.taxCategory" placeholder="请选择纳税类别" :style="{ width: '100%' }">
        <el-option v-for="dict in dict.type.taxcategory" :key="dict.value" :label="dict.label"
          :value="Number(dict.value)"></el-option>
      </el-select>
    </el-form-item> -->
  </div>
</template>

<script>
import { listContract, addContract, updateContract, listLog, addLog, updateLog } from "@/api/Stationary/stationaryContract/ContractQuery.js";
import searchSelect from '@/views/components/searchSelect.vue';
import { listDept } from "@/api/wage_manage/query";
import { listUser } from '@/api/system/user.js'
import { listLeader } from "@/api/Stationary/head"
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export default {
  name: 'ContractQuery-add',
  components: { searchSelect },
  dicts: ['contractsubmission', 'contractstate', 'taxcategory', 'paymentmethod', 'paymentcycle', 'un'],
  data() {
    return {
      // 标识场景 0 新增、1 续签、2 修改、3 新增合同费用记录、4 修改合同费用记录
      flag: +this.$route.params.flag,
      // 续签 id
      renewalId: null,
      queryParams: {},
      // 表单参数
      form: {
        contractId: null,
        'contractName': null,
        'contractNumber': null,
        'signatoryId': null,
        'headId': null,
        'deptId': null,
        'unitCategory': 0,
        'contractSubmission': 0,
        'paymentMethod': 0,
        'paymentCycle': 0,
        'signingDate': dayjs().format('YYYY-MM-DD'),
        'effectiveDate': dayjs().format('YYYY-MM-DD'),
        'endDate': dayjs().add(1, 'year').format('YYYY-MM-DD'),
        contractCostLog: {
          'staffNumber': null,
          'staffCosts': null,
          'fireControlNum': null,
          'fireControlCosts': null,
          'mealAllowance': null,
          'leaderAllowance': null,
          'overTimeAllowance': null,
          'otherCost': null,
          'mouthCost': null,
          'annualPeopleCost': null,
          'annualTotalCost': null,
        },
        'remark': null,
      },
      // 表单校验
      rules: {
        contractName: [
          { required: true, message: "合同名称不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所属大队不能为空", trigger: "change" }
        ],
      },
      Squadronlist: [],
      DepartmentList: [],
      listOfResident: [],
      listStaffUnitList: [],
      contractor: [],
      // 选择器回显数据
      backObj: {
        dept: [],
        sign: [],
        head: [],
      },
      info: {},
      // contractId: null
    }
  },

  created() {
    if(this.flag !== 0) this.setForm()
  },

  computed: {
    // 月数 多出天数大于等于 15 天则算一个月
    monthCount() {
      const startDate = dayjs(this.form.effectiveDate)
      const endDate = dayjs(this.form.endDate)
      const months = endDate.diff(startDate, 'month')
      const remainingDays = endDate.diff(startDate.add(months, 'month'), 'day')
      return remainingDays >= 14 ? months + 1 : months
    },
    // 月费用 = 保安人数 * (保安费用 + 餐费补贴) + 消控人数 * 消控单价 + 小队长补贴 + 超时补贴 + 其他费
    mouthCost() {
      const { 
        staffNumber,
        staffCosts,
        fireControlCosts,
        fireControlNum,
        mealAllowance,
        leaderAllowance,
        overTimeAllowance,
        otherCost
      } = this.form.contractCostLog
      const signal = staffNumber < 0 ? -1 : 1
      return (Math.abs(staffNumber) * (staffCosts + mealAllowance) +
        fireControlNum * fireControlCosts +
        leaderAllowance + overTimeAllowance + otherCost) * signal
        || 0
    },
    // 年人费用 = 年总费用 / 保安人数
    annualPeopleCost() {
      return this.annualTotalCost / Math.abs(this.form.contractCostLog.staffNumber) || 0
    },
    // 年总费用 = 月费用 * 月数
    annualTotalCost() {
      return this.mouthCost * this.monthCount || 0
    },
  },

  // 费用计算后，赋值给表单
  // watch: {
  //   mouthCost: {
  //     immediate: true,
  //     handler() {
  //       this.form.contractCostLog.mouthCost = this.mouthCost
  //     }
  //   },
  //   annualPeopleCost: {
  //     immediate: true,
  //     handler() {
  //       this.form.contractCostLog.annualPeopleCost = this.annualPeopleCost
  //     }
  //   },
  //   annualTotalCost: {
  //     immediate: true,
  //     handler() {
  //       this.form.contractCostLog.annualTotalCost = this.annualTotalCost
  //     }
  //   },
  // },

  methods: {
    // 数据回显
    async setForm() {
      const { rows } = await listContract({ contractId: this.$route.params.contractId })
      this.renewalId = rows[0].renewalId
      this.backObj.dept = [{ deptName: rows[0].deptName, deptId: rows[0].deptId }]
      this.backObj.sign = [{ userName: rows[0].signatory, userId: rows[0].signatoryId }]
      this.backObj.head = [{ headName: rows[0].headName, staffHeadId: rows[0].headId }]

      for(const k in this.form) {
        if(k === 'contractCostLog') {
          let obj = rows[0]
          if(this.flag === 4) {
            const { rows } = await listLog({ contractCostLogId: this.$route.query.contractCostLogId })
            obj = rows[0]
          }
          for(const key in this.form.contractCostLog) {
            this.form.contractCostLog[key] = obj[key]
          }
        } else {
          this.form[k] = rows[0][k]
        }
      }
    },
    // 将计算值赋值给表单
    calcFn() {
      this.form.contractCostLog.mouthCost = this.mouthCost
      this.form.contractCostLog.annualPeopleCost = this.annualPeopleCost
      this.form.contractCostLog.annualTotalCost = this.annualTotalCost
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        const flag = dayjs(this.form.effectiveDate).isAfter(dayjs(this.form.endDate))
        if(flag) return this.$modal.msgError('生效日期不能在终止日期之后')
        if (valid) {
          let form = {}
          switch (this.flag) {
            case 0:
              addContract(this.form).then(response => {
                this.$modal.msgSuccess("新增成功")
                this.cancel()
              })
              break
            case 1:
              addContract({ ...this.form, renewalId: this.renewalId }).then(response => {
                this.$modal.msgSuccess("续签成功")
                this.cancel()
              })
              break
            case 2:
              updateContract(this.form).then(response => {
                this.$modal.msgSuccess("修改成功")
                this.cancel()
              })
              break
            case 3:
              form = {
                contractId: this.form.contractId,
                effectiveDate: this.form.effectiveDate,
                endDate: this.form.endDate,
                ...this.form.contractCostLog
              }
              addLog(form).then(response => {
                this.$modal.msgSuccess("新增成功")
                this.cancel()
              })
              break
            case 4:
              form = {
                contractCostLogId: +this.$route.query.contractCostLogId,
                effectiveDate: this.form.effectiveDate,
                endDate: this.form.endDate,
                ...this.form.contractCostLog
              }
              updateLog(form).then(response => {
                this.$modal.msgSuccess("修改成功")
                this.cancel()
              })
              break
            default:
              break
          }
        }
      });
    },

    // 取消按钮
    cancel() {
      this.$router.go(-1);
      this.$tab.closePage(this.$route)
    },
    // 查询签约人方法
    async listSignFn(queryParams) {
      const { rows, total } = await listUser({
        ...queryParams,
      })

      return { rows, total }
    },
    // 查询负责人方法
    async listHeadFn(queryParams) {
      const { rows, total } = await listLeader({
        ...queryParams,
      })

      return { rows, total }
    },
    // 查询部门方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
  }
}
</script>

<style></style>