<template>
  <div class="gl-form_container">
    <el-form ref="form" :model="form" :rules="rules" label-width="125px" inline>
      <el-form-item label="驻点名称" prop="groupName">
        <el-input v-model="form['groupName']" placeholder="请输入驻点名称" />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractId">
        <search-select
          v-model="form['contractId']"
          :listFn="listContFn"
          :backArr="backObj.cont"
          label="contractName"
          option="contractId"
          placeholder="请选择"
          filterable
        />
      </el-form-item>
      <el-form-item label="负责人" prop="head">
        <search-select
            v-model="form.head"
            :listFn="listHeadFn"
            :backArr="backObj.head"
            label="headName"
            option="staffHeadId"
            placeholder="请选择负责人"
            filterable
          />
      </el-form-item>
      <el-form-item label="驻点电话" prop="phone">
        <el-input v-model="form['phone']" placeholder="请输入驻点电话" />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptName">
        <el-input v-model="elseForm['deptName']" disabled />
      </el-form-item>
      <el-form-item label="客户联系电话" prop="customerTelephone">
        <el-input v-model="form['customerTelephone']" placeholder="请输入客户联系电话" />
      </el-form-item>
      <el-form-item label="客户联系人" prop="customer">
        <el-input v-model="form['customer']" placeholder="请输入客户联系人" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form['address']" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="elseForm['status']" disabled style="width: 100%">
          <el-option
            v-for="item in dict.type['status']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="编制人数" prop="headcount">
        <el-input-number
          class="ipt-number"
          placeholder="请输入编制人数"
          v-model="form['headcount']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="客户类型" prop="customerType">
        <el-select v-model="form['customerType']" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in dict.type['query_client_type']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工作性质" prop="jobNature">
        <el-select v-model="form['jobNature']" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in dict.type['query_work_nature']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提供住宿" prop="accommodate">
        <el-select v-model="form['accommodate']" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in dict.type['query_offer_house']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="住宿地址" prop="accommodateAddress">
        <el-input v-model="form['accommodateAddress']" placeholder="请输入住宿地址" />
      </el-form-item>
      <el-form-item label="管理性质" prop="managementNature">
        <el-select v-model="form['managementNature']" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in dict.type['query_manage_nature']"
            :key="item.value"
            :label="item.label"
            :value="+item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="修改时间" prop="updateTime">
        <el-input v-model="elseForm['updateTime']" disabled />
      </el-form-item>
      <el-form-item label="加班工资" prop="overtimeWages">
        <el-input-number
          class="ipt-number"
          placeholder="请输入加班工资"
          v-model="form['overtimeWages']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="基本工资" prop="basicSalary">
        <el-input-number
          class="ipt-number"
          placeholder="请输入基本工资"
          v-model="form['basicSalary']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="节假标准" prop="holidayStandards">
        <el-input-number
          class="ipt-number"
          placeholder="请输入节假标准"
          v-model="form['holidayStandards']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form['remark']" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <div class="gl-form_btns">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { listCont } from '@/api/wage_manage/query'
import { listLeader } from "@/api/Stationary/head"
import { updateGroup } from '@/api/wage_manage/guard_manage'
import searchSelect from '@/views/components/searchSelect.vue'
import dayjs from 'dayjs'

export default {
  name: 'Guard_point_define-update',
  components: { searchSelect },
  dicts: [
    'status',
    'query_client_type',
    'query_work_nature',
    'query_offer_house',
    'query_manage_nature',
  ],
  data() {
    return {
      form: {
        'groupId': null,
        'groupName': null,
        'contractId': null,
        'head': null,
        'phone': null,
        'customerTelephone': null,
        'customer': null,
        'address': null,
        'headcount': null,
        'customerType': null,
        'jobNature': null,
        'accommodate': null,
        'accommodateAddress': null,
        'managementNature': null,
        'overtimeWages': null,
        'basicSalary': null,
        'holidayStandards': null,
        'remark': null,
      },
      // 不能修改的回显数据
      elseForm: {
        'deptName': null,
        'squadronName': null,
        'unitName': null,
        'status': null,
        'updateTime': null,
      },
      rules: {},
      // 选择器回显数据
      backObj: {
        cont: [],
        head: [],
      },
    }
  },

  created() {
    this.echoFn()
  },

  methods: {
    echoFn() {
      const row = JSON.parse(this.$route.query.row)
      for (const k in this.form) {
        this.form[k] = row[k]
      }
      for (const k in this.elseForm) {
        this.elseForm[k] = row[k]
      }
      this.elseForm.updateTime = dayjs().format('YYYY-MM-DD')
      if(row.head) this.backObj.head = [{ headName: row.headName, staffHeadId: row.head }]
      if(row.contractId) this.backObj.cont = [{ contractName: row.contractName, contractId: row.contractId }]
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateGroup({ ...this.form, reviewedStatus: 0 }).then(response => {
            this.$modal.msgSuccess("修改成功")
            this.cancel()
          })
        }
      })
    },
    cancel() {
      this.$router.back()
      this.$tab.closePage(this.$route)
    },

    // 查询合同方法
    async listContFn(queryParams) {
      const { rows, total } = await listCont({
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
  },
}
</script>
