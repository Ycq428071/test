<template>
  <div class="gl-form_container">
    <el-form ref="form" :model="form" :rules="rules" inline label-width="125px">
      <el-form-item label="保安姓名" prop="securityName">
        <el-input v-model="form.securityName" placeholder="请输入保安姓名" />
      </el-form-item>
      <el-form-item label="保安证编号" prop="reportNumber">
        <el-input v-model="form.reportNumber" placeholder="请输入保安证编号" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="所属大队" prop="deptId">
        <search-select v-model="form.deptId" :listFn="listDeptFn" :backArr="backObj.dept" label="deptName"
          option="deptId" placeholder="请选择大队" />
      </el-form-item>
      <el-form-item label="所属岗位" prop="positionId">
        <el-tooltip :disabled="form.deptId !== null" effect="dark" content="请先选择大队" placement="top">
          <search-select
            v-model="form.positionId"
            :listFn="listPostFn"
            :backArr="backObj.post"
            :watchVal="form.deptId"
            :disabled="form.deptId === null"
            label="positionName"
            option="groupPositionId"
            placeholder="请选择岗位"
            filterable
            remote
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="报道日期" prop="reportDate">
        <el-date-picker clearable v-model="form.reportDate" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上岗日期" prop="onBoardDate">
        <el-date-picker clearable v-model="form.onBoardDate" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="进驻日期" prop="enteringDate">
        <el-date-picker clearable v-model="form.enteringDate" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="合同开始日期" prop="contractStartDate">
        <el-date-picker clearable v-model="form.contractStartDate" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="合同截止日期" prop="contractEndDate">
        <el-date-picker clearable v-model="form.contractEndDate" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="试用开始日期" prop="trialStartDate">
        <el-date-picker clearable v-model="form.trialStartDate" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="试用截止日期" prop="trialEndDate">
        <el-date-picker clearable v-model="form.trialEndDate" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="证件类型" prop="certificateType">
        <el-select v-model="form.certificateType">
          <el-option v-for="dict in dict.type.query_certificate_type" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="certificateNumber">
        <el-input v-model="form.certificateNumber" placeholder="请输入证件号码" />
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker clearable v-model="form.birthday" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择日期" disabled>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择婚姻状况" disabled>
          <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="户籍地址" prop="registeredResidenceAddress">
        <el-input v-model="form.registeredResidenceAddress" placeholder="请输入户籍地址" />
      </el-form-item>
      <el-form-item label="现居地址" prop="currentAddress">
        <el-input v-model="form.currentAddress" placeholder="请输入现居地址" />
      </el-form-item>
      <el-form-item label="银行类型" prop="bankType">
        <el-select v-model="form.bankType" placeholder="请选择银行类型">
          <el-option v-for="dict in dict.type.bank_type" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行账号" prop="account">
        <el-input v-model="form.account" placeholder="请输入银行账号" />
      </el-form-item>
      <el-form-item label="身高(cm)" prop="height">
        <el-input v-model="form.height" placeholder="请输入身高" />
      </el-form-item>
      <el-form-item label="婚姻" prop="marriage">
        <el-select v-model="form.marriage" placeholder="请选择婚姻状况">
          <el-option v-for="dict in dict.type.marriage" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="民族" prop="nation">
        <el-select v-model="form.nation" placeholder="请选择民族">
          <el-option v-for="dict in dict.type.nation" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文化程度" prop="education">
        <el-select v-model="form.education" placeholder="请选择文化程度">
          <el-option v-for="dict in dict.type.education" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="政治面貌" prop="politicalOutlook">
        <el-select v-model="form.politicalOutlook" placeholder="请选择政治面貌">
          <el-option v-for="dict in dict.type.politicaloutlook" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退伍" prop="discharge">
        <el-select v-model="form.discharge" placeholder="请选择退伍">
          <el-option v-for="dict in dict.type.discharge" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="健康状况" prop="health">
        <el-select v-model="form.health" placeholder="请选健康状况">
          <el-option v-for="dict in dict.type.health" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="户籍性质" prop="domicile">
        <el-select v-model="form.domicile" placeholder="请选择户籍性质">
          <el-option v-for="dict in dict.type.domicile" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资格证" prop="qualification">
        <el-select v-model="form.qualification" placeholder="请选择资格证">
          <el-option v-for="dict in dict.type.qualification" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职业等级" prop="jobLevel" v-if="form.qualification === 0">
        <el-select v-model="form.jobLevel" placeholder="请选择职业等级">
          <el-option v-for="dict in dict.type.joblevel" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保安级别" prop="securityLevel">
        <el-select v-model="form.securityLevel" placeholder="请选择保安级别">
          <el-option v-for="dict in dict.type.securitylevel" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="养老保险" prop="endowmentInsurance">
        <el-select v-model="form.endowmentInsurance" placeholder="请选择养老保险">
          <el-option v-for="dict in dict.type.endowmentinsurance" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="意外险" prop="accidentInsurance">
        <el-select v-model="form.accidentInsurance" placeholder="请选择意外险">
          <el-option v-for="dict in dict.type.accidentinsurance" :key="dict.value" :label="dict.label"
            :value="Number(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item v-if="form.qualification === 0"></el-form-item>
      <el-form-item v-if="form.qualification === 0"></el-form-item>
      <el-form-item label="保安证附件" prop="securityCertificateAnnex">
        <file-upload v-model="form.securityCertificateAnnex" :limit="1" :file-type="fileType" />
      </el-form-item>
      <el-form-item label="证件附件" prop="certificateAnnex">
        <file-upload v-model="form.certificateAnnex" :limit="1" :file-type="fileType" />
      </el-form-item>
      <el-form-item label="资格证附件" prop="qualificationAnnex">
        <file-upload v-model="form.qualificationAnnex" :limit="1" :file-type="fileType" />
      </el-form-item>
    </el-form>

    <div class="gl-form_btns">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { addStaff, updateStaff } from "@/api/SecurityManagement/Security.js";
import { listDept } from "@/api/wage_manage/query";
import { listPost } from '@/api/wage_manage/guard_manage'
import { listGuardDetail } from "@/api/wage_manage/guard_wage";
import searchSelect from '@/views/components/searchSelect.vue';
import area from '@/assets/area'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
const pattern = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/

export default {
  name: 'Security-add',
  dicts: [
    'bank_type',
    'sys_user_sex',
    'marriage',
    'nation',
    'education',
    'politicaloutlook',
    'discharge',
    'health',
    'qualification',
    'securitylevel',
    'domicile',
    'endowmentinsurance',
    'accidentinsurance',
    'joblevel',
    'query_certificate_type'
  ],
  components: { searchSelect },

  data() {
    return {
      // 上传文件类型
      fileType: ['pdf', 'png', 'jpg'],
      // 表单参数
      form: {
        'securityName': null,
        'reportNumber': null,
        'phoneNumber': null,
        'deptId': null,
        // 'groupId': '',
        'positionId': '',
        'reportDate': null,
        'onBoardDate': null,
        'enteringDate': null,
        'contractStartDate': null,
        'contractEndDate': null,
        'trialStartDate': null,
        'trialEndDate': null,
        // 'alias': null,
        'certificateType': 0,
        'certificateNumber': null,
        'birthday': null,
        'sex': 0,
        'registeredResidenceAddress': null,
        'currentAddress': null,
        'bankType': 0,
        'account': null,
        'height': null,
        'marriage': 0,
        'nation': 0,
        'education': 8,
        'politicalOutlook': 2,
        'discharge': 0,
        'health': 0,
        'qualification': 1,
        'securityLevel': 0,
        'domicile': 0,
        'endowmentInsurance': 1,
        'accidentInsurance': 1,
        'jobLevel': null,
        'remark': null,
        'securityCertificateAnnex': null,
        'certificateAnnex': null,
        'qualificationAnnex': null,
      },
      // 表单校验
      rules: {
        'securityName': [
          { required: true, message: '保安姓名不能为空', trigger: 'blur' },
        ],
        'deptId': [
          { required: true, message: '所属大队不能为空', trigger: 'change' },
        ],
        // 'groupId': [
        //   { required: true, message: '所属驻点不能为空', trigger: 'change' },
        // ],
        'positionId': [
          { required: true, message: '所属岗位不能为空', trigger: 'change' },
        ],
        'reportDate': [
          { required: true, message: '报道日期不能为空', trigger: 'blur' },
        ],
        'onBoardDate': [
          { required: true, message: '上岗日期不能为空', trigger: 'blur' },
        ],
        certificateNumber: [
          { required: true, message: '证件号码不能为空', trigger: 'blur' },
          { pattern, message: '请输入正确的身份证号码', trigger: 'blur'  }
        ],
      },
      Squadronlist: [],
      DepartmentList: [],
      listOfResident: [],
      listStaffUnitList: [],
      queryParams: {},
      // 选择器回显数据
      backObj: {
        dept: [],
        post: [],
      },
      info: {},
      // 地区
      area,
      // 是否自动赋值
      flag: false,
    }
  },
  created() {
    this.getinfo()
  },
  watch: {
    'form.certificateNumber': {
      handler(val) {
        if(this.flag) return
        if(pattern.test(val)) {
          this.form.birthday = dayjs(val.slice(6, 14)).format('YYYY-MM-DD')
          this.form.sex = val[16] % 2 === 0 ? 1 : 0
          // const prov = val.slice(0, 2) + '0000'
          // const city = val.slice(0, 4) + '00'
          // const regi = val.slice(0, 6)

          // const provobj = this.area.find(item => item.value === prov)
          // const cityobj = provobj?.children.find(item => item.value === city)
          // const regiobj = cityobj?.children.find(item => item.value === regi)

          // if(!regiobj) return this.$modal.msgError('该身份证号码所在地区编码存在变更，无法自动识别籍贯和户籍地，请手动输入！')

          // const provLab = provobj.label
          // const cityLab = cityobj.label
          // const regiLab = regiobj.label


          // const provName = provLab + (cityLab === '市辖区' ? '市' : '省')
          // const cityName = cityLab === '市辖区' ? '' : cityLab + '市'
          // const regiName = regiLab === '市辖区' ? '' : regiLab
          // this.form.nativePlace = provName + (cityName ? cityName : regiName)

          // this.form.registeredResidence = [prov, city, regi]
          // 户籍地拼接
          // console.log(provName + cityName + regiName)
        }
      }
    },
    // 'form.reportDate': {
    //   handler(val) {
    //     if(this.flag) return
    //     const months = dayjs(val).endOf('month').diff(val, 'day') >= 15 ? 3 : 4

    //     this.form.trialStartDate = val
    //     this.form.trialEndDate = dayjs(val).add(months, 'month').endOf('month').format('YYYY-MM-DD')
    //   }
    // },
    'form.onBoardDate': {
      handler(val) {
        if(this.flag) return
        this.form.enteringDate = val

        const months = dayjs(val).endOf('month').diff(val, 'day') >= 15 ? 2 : 3

        this.form.trialStartDate = val
        this.form.trialEndDate = dayjs(val).add(months, 'month').endOf('month').format('YYYY-MM-DD')
      }
    },
    'form.qualification': {
      handler(val) {
        // 资格证有时，才显示保安级别给默认值
        // this.form.securityLevel = val === 0 ? 0 : null
        this.form.jobLevel = val === 0 ? 0 : null
      }
    }
  },
  methods: {
    async getinfo() {
      if (this.$route.params.securityId == 0) {

      } else {
        this.flag = true
        const { rows } = await listGuardDetail({ securityId: this.$route.params.securityId })
        this.info = rows[0]
        this.setForm()
        this.form = rows[0]

        await this.$nextTick()
        this.flag = false
      }

    },
    setForm() {
      this.backObj.dept = [{ deptName: this.info.deptName, deptId: this.info.deptId }]
      this.backObj.post = [{ positionName: this.info.positionName, groupPositionId: this.info.positionId }]
    },

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

    // 取消按钮
    cancel() {
      this.$router.go(-1);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.securityId != undefined) {
            updateStaff({ ...this.form, status: 0 }).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.$router.go(-1);
              this.$tab.closePage(this.$route)
            });
          } else {
            addStaff({ ...this.form }).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.$router.go(-1);
              this.$tab.closePage(this.$route)
            });
          }
        }
      });
    },
  }
}
</script>

<style></style>