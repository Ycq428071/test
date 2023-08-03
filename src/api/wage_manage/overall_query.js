import request from '@/utils/request'

// 保安工资查询
export function listWage(params) {
  return request({
    url: '/salary/employee/queryStaffSalary',
    method: 'get',
    params
  })
}

// 保安工资合计查询
export function listWageTotal(params) {
  return request({
    url: '/salary/employee/queryStaffSalary2',
    method: 'get',
    params
  })
}

// 保安驻点工资明细查询
export function listPointWage(params) {
  return request({
    url: '/salary/employee/queryGroupSalary',
    method: 'get',
    params
  })
}

// 大队工资支出统计
export function listDeptWage(params) {
  return request({
    url: '/salary/employee/queryDeptSalaryDetail',
    method: 'get',
    params
  })
}

// 信用社统计查询
export function listCreditCount(params) {
  return request({
    url: '/salary/employee/queryStaffSalary3',
    method: 'get',
    params
  })
}

// 导入保险保安当月工资无保险查询
export function listNoInsure(params) {
  return request({
    url: '/salary/employee/staffExportInsureByInsuranceType',
    method: 'get',
    params
  })
}

// 薪水信息配置表
export const wageInfoTable = [
  { label: '薪水年月', value: '' },
  { label: '编号', value: '' },
  { label: '姓名', value: 'securityName' },
  { label: '银行账号', value: 'account' },
  { label: '证件号码', value: '' },
  { label: '所属大队', value: 'deptName' },
  { label: '所属驻点', value: 'groupName' },
  { label: '基本工资', value: 'baseSalary' },
  { label: '职务工资', value: 'jobSalary' },
  { label: '服装津贴', value: 'clothesAllowance' },
  { label: '加班费用', value: 'overtimePay' },
  { label: '节日费用', value: 'holidayFee' },
  { label: '补贴', value: '' },
  { label: '其他', value: '' },
  { label: '应发工资', value: 'shouldSalary' },
  { label: '养老金', value: 'pension' },
  { label: '医保', value: 'medicalInsurance' },
  { label: '失业', value: 'unemploymentInsurance' },
  { label: '公积金(原大病)', value: 'seriousIllness' },
  { label: '其他扣款', value: 'otherDeduct1' },
  { label: '其他扣款1', value: 'otherDeduct2' },
  { label: '保险补扣', value: 'insuranceDeduct' },
  { label: '实发工资', value: 'actualSalary' },
  { label: '卡工资', value: 'cardSalary' },
  { label: '制表日期', value: 'createDate' },
  { label: '制表人', value: '' },
  { label: '复核日期', value: '' },
  { label: '复核人', value: '' },
]

// 个人履历信息配置表
export const resumeTable = [
  { label: '起始年月', value: '' },
  { label: '结束年月', value: '' },
  { label: '学校或单位', value: '' },
  { label: '备注', value: '' },
]

// 家庭成员及在杭社会关系信息配置表
export const relationshipTable = [
  { label: '姓名', value: '' },
  { label: '称呼', value: '' },
  { label: '性别', value: '' },
  { label: '年龄', value: '' },
  { label: '单位', value: '' },
  { label: '备注', value: '' },
]
