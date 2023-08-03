<template>
  <div class="gl-form_container">
    <el-form ref="form" :model="form" :rules="rules" label-width="125px" inline>
      <el-form-item label="工资年月" prop="payday">
        <el-date-picker
          v-model="form.payday"
          type="month"
          placeholder="请选择工资年月"
          style="width: 100%;"
          value-format="yyyy-MM"
          :disabled="form.id !== null"
          :editable="false"
          :clearable="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="保安姓名">
        <el-input v-model="info.securityName" disabled />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select
          v-model="form.deptId"
          :listFn="listDeptFn"
          :backArr="backObj.dept"
          :disabled="form.id !== null"
          label="deptName"
          option="deptId"
          placeholder="请选择大队"
        />
      </el-form-item>
      <el-form-item label="所属岗位" prop="positionId">
        <el-tooltip :disabled="form.deptId !== null" effect="dark" content="请先选择大队" placement="top">
          <search-select
            v-model="form.positionId"
            :listFn="listPostFn"
            :backArr="backObj.post"
            :watchVal="form.deptId"
            :disabled="form.deptId === null || form.id !== null"
            label="positionName"
            option="groupPositionId"
            placeholder="请选择岗位"
            filterable
            remote
          />
        </el-tooltip>
      </el-form-item>
      <!-- <el-form-item label="所属岗位" prop="positionId">
        <search-select
          v-model="form.positionId"
          :listFn="listPostFn"
          :backArr="backObj.post"
          :disabled="form.id !== null"
          label="positionName"
          option="groupPositionId"
          placeholder="请选择岗位"
          filterable
          remote
        />
      </el-form-item> -->
      <el-form-item label="工龄工资" prop="seniorityPay">
        <el-input-number
          class="ipt-number"
          placeholder="请输入工龄工资"
          v-model="form['seniorityPay']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="超时补贴" prop="overtimeAllowance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入超时补贴"
          v-model="form['overtimeAllowance']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="餐费" prop="mealAllowance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入餐费"
          v-model="form['mealAllowance']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="考核工资" prop="probationSalary">
        <el-input-number
          class="ipt-number"
          placeholder="请输入考核工资"
          v-model="form['probationSalary']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="岗位补贴" prop="situationAllowance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入岗位补贴"
          v-model="form['situationAllowance']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="补足工资" prop="repaySalary">
        <el-input-number
          class="ipt-number"
          placeholder="请输入补足工资"
          v-model="form['repaySalary']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="缺员加班" prop="shorthandedOvertime">
        <el-input-number
          class="ipt-number"
          placeholder="请输入缺员加班"
          v-model="form['shorthandedOvertime']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="出勤天数" prop="attendanceDays">
        <el-input-number
          class="ipt-number"
          placeholder="请输入出勤天数"
          v-model="form['attendanceDays']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="出勤标准" prop="attendanceStandard">
        <el-input-number
          class="ipt-number"
          placeholder="请输入出勤标准"
          v-model="form['attendanceStandard']"
          :controls="false"
          :disabled="flag"
        />
      </el-form-item>
      <el-form-item label="基本工资" prop="baseSalary">
        <el-input-number
          class="ipt-number"
          placeholder="请输入基本工资"
          v-model="form['baseSalary']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="职务工资" prop="jobSalary">
        <el-input-number
          class="ipt-number"
          placeholder="请输入职务工资"
          v-model="form['jobSalary']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="服装津贴" prop="clothesAllowance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入服装津贴"
          v-model="form['clothesAllowance']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="加班天数" prop="overtimeDays">
        <el-input-number
          class="ipt-number"
          placeholder="请输入加班天数"
          v-model="form['overtimeDays']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="加班标准" prop="overtimeStandard">
        <el-input-number
          class="ipt-number"
          placeholder="请输入加班标准"
          v-model="form['overtimeStandard']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="加班费用" prop="overtimePay">
        <el-input-number
          class="ipt-number"
          placeholder="请输入加班费用"
          v-model="comForm['overtimePay']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="节日天数" prop="holidayDays">
        <el-input-number
          class="ipt-number"
          placeholder="请输入节日天数"
          v-model="form['holidayDays']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="节日标准" prop="holidayStandard">
        <el-input-number
          class="ipt-number"
          placeholder="请输入节日标准"
          v-model="form['holidayStandard']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="节日费用" prop="holidayFee">
        <el-input-number
          class="ipt-number"
          placeholder="请输入节日费用"
          v-model="comForm['holidayFee']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="低保补贴" prop="subsistenceAllowance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入低保补贴"
          v-model="form['subsistenceAllowance']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="其他1" prop="otherAllowance1">
        <el-input-number
          class="ipt-number"
          placeholder="请输入其他1"
          v-model="form['otherAllowance1']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="其他2" prop="otherAllowance2">
        <el-input-number
          class="ipt-number"
          placeholder="请输入其他2"
          v-model="form['otherAllowance2']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="应发工资" prop="shouldSalary">
        <el-input-number
          class="ipt-number"
          placeholder="请输入应发工资"
          v-model="comForm['shouldSalary']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="请假扣划" prop="offWorkDeduct">
        <el-input-number
          class="ipt-number"
          placeholder="请输入请假扣划"
          v-model="form['offWorkDeduct']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="养老金" prop="pension">
        <el-input-number
          class="ipt-number"
          placeholder="请输入养老金"
          v-model="form['pension']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="医保" prop="medicalInsurance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入医保"
          v-model="form['medicalInsurance']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="失业" prop="unemploymentInsurance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入失业"
          v-model="form['unemploymentInsurance']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="公积金(原大病)" prop="seriousIllness">
        <el-input-number
          class="ipt-number"
          placeholder="请输入公积金"
          v-model="form['seriousIllness']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="意外险" prop="accidentInsurance1">
        <el-input-number
          class="ipt-number"
          placeholder="请输入意外险"
          v-model="form['accidentInsurance1']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="意外险2" prop="accidentInsurance2">
        <el-input-number
          class="ipt-number"
          placeholder="请输入意外险2"
          v-model="form['accidentInsurance2']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="违纪工资" prop="breachPrinciple">
        <el-input-number
          class="ipt-number"
          placeholder="请输入违纪工资"
          v-model="form['breachPrinciple']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="不上班扣款" prop="absenteeism">
        <el-input-number
          class="ipt-number"
          placeholder="请输入不上班扣款"
          v-model="form['absenteeism']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="其他扣款1" prop="otherDeduct1">
        <el-input-number
          class="ipt-number"
          placeholder="请输入其他扣款1"
          v-model="form['otherDeduct1']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="其他扣款2" prop="otherDeduct2">
        <el-input-number
          class="ipt-number"
          placeholder="请输入其他扣款2"
          v-model="form['otherDeduct2']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="保险补扣" prop="insuranceDeduct">
        <el-input-number
          class="ipt-number"
          placeholder="请输入保险补扣"
          v-model="form['insuranceDeduct']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="个税" prop="incomeTax">
        <el-input-number
          class="ipt-number"
          placeholder="请输入个税"
          v-model="form['incomeTax']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="实发工资" prop="actualSalary">
        <el-input-number
          class="ipt-number"
          placeholder="请输入实发工资"
          v-model="comForm['actualSalary']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="卡工资" prop="cardSalary">
        <el-input-number
          class="ipt-number"
          placeholder="请输入卡工资"
          v-model="comForm['cardSalary']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="制表日期" prop="createDate">
        <el-input v-model="form.createDate" disabled />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <div class="gl-form_btns">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { getVariousCosts, addSalary, updateSalary, addKeys1, addKeys2, subKeys } from "@/api/wage_manage/guard_wage"
import { listStaff } from "@/api/wage_manage/staff"
import { listDept } from "@/api/wage_manage/query";
import { listPost } from '@/api/wage_manage/guard_manage'
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Qw_enter-add',
  components: { searchSelect },

  data() {
    return {
      info: {},
      // 表单参数
      form: {
        id: null,
        empId: null,
        payday: null,
        deptId: null,
        positionId: null,
        seniorityPay: null,
        overtimeAllowance: null,
        mealAllowance: null,
        probationSalary: null,
        situationAllowance: null,
        repaySalary: null,
        shorthandedOvertime: null,
        attendanceDays: null,
        attendanceStandard: null,
        baseSalary: null,
        jobSalary: null,
        clothesAllowance: null,
        overtimeDays: null,
        overtimeStandard: null,
        // overtimePay: null,
        holidayDays: null,
        holidayStandard: null,
        // holidayFee: null,
        subsistenceAllowance: null,
        otherAllowance1: null,
        otherAllowance2: null,
        // shouldSalary: null,
        offWorkDeduct: null,
        pension: null,
        medicalInsurance: null,
        unemploymentInsurance: null,
        seriousIllness: null,
        accidentInsurance1: null,
        accidentInsurance2: null,
        breachPrinciple: null,
        absenteeism: null,
        otherDeduct1: null,
        otherDeduct2: null,
        insuranceDeduct: null,
        incomeTax: null,
        // actualSalary: null,
        // cardSalary: null,
        createDate: null,
        remark: null,
      },
      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "请选择大队", trigger: "change" }
        ],
        positionId: [
          { required: true, message: "请选择岗位", trigger: "change" }
        ],
      },
      // 选择器回显数据
      backObj: {
        post: [],
        dept: [],
      },
    }
  },

  created() {
    this.form.id = +this.$route.params.id || null
    this.form.empId = +this.$route.params.securityId
    this.getinfo()
  },

  watch: {
    async 'form.positionId'(positionId) {
      if(!positionId) return

      if (this.$route.query.row) {

      } else {
        const { data } = await getVariousCosts({
          positionId,
          empId: this.form.empId,
          payday: this.form.payday + '-01'
        })

        for(const k in data) {
          this.form[k] = data[k]
        }
      }
    },
    // 日期变化时，重新获取费用信息
    async 'form.payday'(payday) {
      if (!this.form.positionId) return

      if (this.$route.query.row) {

      } else {
        const { data } = await getVariousCosts({
          positionId: this.form.positionId,
          empId: this.form.empId,
          payday: payday + '-01'
        })

        for (const k in data) {
          this.form[k] = data[k]
        }
        this.form.attendanceDays = dayjs(payday).daysInMonth()
      }
    },
    flag(val) {
      this.form.attendanceStandard = val ? 0 : this.form.overtimeStandard
    }
  },

  computed: {
    // 判断出勤天数是否与所选月份天数相等
    flag() {
      const daysInMonth = dayjs(this.form.payday).daysInMonth()
      return daysInMonth === this.form.attendanceDays
    },
    comForm() {
      // 某某费用 = 某某标准 * 某某天数
      const attendance = +this.form.attendanceDays * +this.form.attendanceStandard
      const overtimePay = +this.form.overtimeStandard * +this.form.overtimeDays
      const holidayFee = +this.form.holidayDays * +this.form.holidayStandard

      // 应发工资 = (form[addKeys] 累加) + 三个某某费用
      const arr = this.flag ? addKeys1 : addKeys2
      const shouldSalary = arr.reduce(
        (sum, key) => sum + +this.form[key], 0
      ) + overtimePay + holidayFee + attendance

      // 实发工资 = 应发工资 - (form[subKeys] 累加)
      const actualSalary = shouldSalary - subKeys.reduce(
        (sum, key) => sum + +this.form[key], 0
      )

      return {
        overtimePay,
        holidayFee,
        shouldSalary,
        actualSalary,
        cardSalary: actualSalary,
      }
    }
  },

  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== null) {
            updateSalary({ ...this.form, ...this.comForm }).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.cancel()
            })
          } else {
            addSalary({ isDepart: 1, ...this.form, ...this.comForm }).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.cancel()
            })
          }
        }
      })
    },
    cancel() {
      this.$router.back()
      this.$tab.closePage(this.$route)
    },
    // 请求回显的数据
    async getinfo() {
      const { rows } = await listStaff({ securityId: this.form.empId })
      this.info = rows[0]
      this.setForm()
    },
    // 回显数据
    async setForm() {
      // if(this.form.id !== null) {
      if (this.$route.query.row) {
        // 修改
        const row = JSON.parse(this.$route.query.row)
        for(let k in this.form) {
          // 如果值是 0 不是 null 也要进行赋值
          if(k !== 'id' && !!row[k] || row[k] === 0) {
            this.form[k] = row[k]
          }
        }

        this.form.positionId = row.positionId

        this.backObj.dept = [{ deptName: row.deptName, deptId: row.deptId }]
        this.backObj.post = [{ positionName: row.positionName, groupPositionId: row.positionId }]
      } else {
        // 新增
        this.form.payday = dayjs().subtract(1, 'month').format('YYYY-MM')
        this.form.createDate = dayjs().format('YYYY-MM-DD')
        this.form.attendanceDays = dayjs(this.form.payday).daysInMonth()

        this.backObj.dept = [{ deptName: this.info.deptName, deptId: this.info.deptId }]
        this.backObj.post = [{ positionName: this.info.positionName, groupPositionId: this.info.positionId }]
      }
    },

    // 查询大队方法
    async listDeptFn(queryParams) {
      const { rows, total } = await listDept(queryParams)

      return { rows, total }
    },
    // 查询岗位方法
    async listPostFn(queryParams) {
      const { rows, total } = await listPost({
        ...queryParams,
        positionStatus: 0,
        deptId: this.form.deptId
      })

      return { rows, total }
    },
  },
}
</script>
