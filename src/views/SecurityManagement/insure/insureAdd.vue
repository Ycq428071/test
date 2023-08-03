<template>
  <div class="gl-form_container">
    <el-form ref="form" :model="form" :rules="rules" inline label-width="125px">
      <el-form-item label="保安人员" prop="securityId">
        <el-input disabled v-model="securityName" />
      </el-form-item>
      <el-form-item label="社会保障号" prop="socialSecurityNumber">
        <el-input v-model="form.socialSecurityNumber" placeholder="请输入社会保障号" />
      </el-form-item>
      <el-form-item label="参保起始年月" prop="insureStartTime">
        <el-date-picker clearable v-model="form.insureStartTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择参保起始年月" :style="{ width: '100%' }">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否特困" prop="isDestitute">
        <el-select v-model="form.isDestitute" placeholder="请选择是否特困" :style="{ width: '100%' }">
          <el-option v-for="    dict     in     dict.type.isdestitute    " :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构审核日期" prop="institutionalReviewTime">
        <el-date-picker clearable v-model="form.institutionalReviewTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择机构审核日期" :style="{ width: '100%' }">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="填报日期" prop="fillingDate">
        <el-date-picker clearable v-model="form.fillingDate" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择填报日期" :style="{ width: '100%' }">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="月缴纳基数" prop="monthlyBase">
        <el-input-number
          class="ipt-number"
          placeholder="请输入月缴纳基数"
          v-model="form['monthlyBase']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="养老保险" prop="endowmentInsurance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入养老保险"
          v-model="form['endowmentInsurance']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="医疗保险" prop="medicalInsurance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入医疗保险"
          v-model="form['medicalInsurance']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="大病保险" prop="sicknessInsurance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入大病保险"
          v-model="form['sicknessInsurance']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="失业保险" prop="unemploymentInsurance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入失业保险"
          v-model="form['unemploymentInsurance']"
          :controls="false"
          disabled
        />
      </el-form-item>
      <el-form-item label="公积金保险" prop="accumulationFundInsurance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入公积金保险"
          v-model="form['accumulationFundInsurance']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="其他保险" prop="otherInsurance">
        <el-input-number
          class="ipt-number"
          placeholder="请输入其他保险"
          v-model="form['otherInsurance']"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="审核日期" prop="approvedDate">
        <el-date-picker clearable v-model="form.approvedDate" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择审核日期" :style="{ width: '100%' }">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="机构受理日期" prop="institutionalAcceptanceDate">
        <el-date-picker clearable v-model="form.institutionalAcceptanceDate" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择机构受理日期" :style="{ width: '100%' }">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否受理成功" prop="isAccepted">
        <el-select v-model="form.isAccepted" placeholder="请选择是否受理成功" :style="{ width: '100%' }">
          <el-option v-for="     dict      in      dict.type.isaccepted     " :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医保起始年月" prop="medicalInsuranceStartDate">
        <el-date-picker clearable v-model="form.medicalInsuranceStartDate" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择医保起始年月" :style="{ width: '100%' }">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="领卡日期" prop="cardCollectionDate">
        <el-date-picker clearable v-model="form.cardCollectionDate" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择领卡日期" :style="{ width: '100%' }">
        </el-date-picker>
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
import { listInsure, addInsure, updateInsure, getInsureInfo } from "@/api/SecurityManagement/insure.js";
import { listStaff } from '@/api/SecurityManagement/Security.js'
export default {
  name: 'insure-add',
  dicts: ['isdestitute', 'isaccepted', 'offmaintenancestatus'],
  data() {
    return {
      // 表单参数
      form: {
        endowmentInsurance: null,
        medicalInsurance: null,
        monthlyBase: null,
        unemploymentInsurance: null,
      },
      // 表单校验
      rules: {
      },
      // 人员列表
      staffList: [],
      queryParams: {},
      securityName: ''

    }
  },
  async created() {
    if (this.$route.params.insureId != 0) {
      this.queryParams.insureId = this.$route.params.insureId
      this.getList()
    } else {
      this.form.securityId = this.$route.query.securityId
      const res = await listStaff({ securityId: this.form.securityId })
      this.securityName = res.rows[0].securityName
      this.getInsureInfoFn()
    }
  },
  methods: {
    async getList() {
      const res = await listStaff()
      this.staffList = res.rows
      listInsure(this.queryParams).then(async response => {
        this.form = response.rows[0];
        this.form.securityId = response.rows[0].securityStaff.securityId;
        const res = await listStaff({ securityId: this.form.securityId })
        this.securityName = res.rows[0].securityName
      });
    },
    // 获取保安保险信息
    async getInsureInfoFn() {
      const res = await getInsureInfo()
      for(const k in res) {
        this.form[k] = res[k]
      }
    },
    async remoteMethod(query) {
      const res = await listStaff({ securityName: query })
      this.staffList = res.rows
    },
    // 表单重置
    reset() {
      this.form = {
        insureId: null,
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
        isAccepted: null,
        medicalInsuranceStartDate: null,
        cardCollectionDate: null,
        offMaintenanceStatus: null,
        offMaintenanceDate: null,
        offMaintenanceNumber: null,
        offMaintenancePeople: null,
        offMaintenanceRemark: null,
        remark: null,
        createBy: null,
        createDate: null
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      delete this.form.securityStaff
      this.form.securityId = this.form.securityId - 0
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.insureId != undefined) {
            updateInsure(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.$router.go(-1);
              this.getList();
            });
          } else {
            addInsure(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.$router.go(-1);
              this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
      this.$router.go(-1);
    },
  }
}
</script>

<style></style>