import request from '@/utils/request'

// 查询保安信息
export function listGuard(params) {
  return request({
    url: '/salary/employee/getSecurityStaffList',
    method: 'get',
    params
  })
}

// 查询单个保安信息
export function listGuardDetail(params) {
  return request({
    url: '/affairs/staff/list',
    method: 'get',
    params
  })
}

// 获取用户的工资流水
export function listStream(empId, params) {
  return request({
    url: '/salary/employee/list/' + empId,
    method: 'get',
    params
  })
}

// 查询保安工资列表
export function listSalary(query) {
  return request({
    url: '/salary/employee/list',
    method: 'get',
    params: query
  })
}

// 查询保安工资列表
export function getVariousCosts(query) {
  return request({
    url: '/salary/employee/getVariousCosts',
    method: 'get',
    params: query
  })
}

// 保安工资录入
export function addSalary(data) {
  return request({
    url: '/salary/employee',
    method: 'post',
    data: data
  })
}

// 修改保安工资
export function updateSalary(data) {
  return request({
    url: '/salary/employee',
    method: 'put',
    data: data
  })
}

// 删除保安工资
export function delSalary(id) {
  return request({
    url: '/salary/employee/' + id,
    method: 'DELETE',
  })
}

// 复核
export function checkSalary(ids) {
  return request({
    url: '/salary/employee/check/' + ids,
    method: 'put',
  })
}

// 消复核
export function uncheckSalary(ids) {
  return request({
    url: '/salary/employee/unCheck/' + ids,
    method: 'put',
  })
}

// 录入详情配置表
export const enterConfig = [
  { label: '工资年月', value: 'payday' },
  { label: '保安姓名', value: 'securityName' },
  { label: '所属大队', value: 'deptName' },
  { label: '所属驻点', value: 'groupName' },
  { label: '工龄工资', value: 'seniorityPay' },
  { label: '超时补贴', value: 'overtimeAllowance' },
  { label: '餐费', value: 'mealAllowance' },
  { label: '考核工资', value: 'probationSalary' },
  { label: '岗位补贴', value: 'situationAllowance' },
  { label: '补足工资', value: 'repaySalary' },
  { label: '缺员加班', value: 'shorthandedOvertime' },
  { label: '出勤天数', value: 'attendanceDays' },
  { label: '出勤标准', value: 'attendanceStandard' },
  { label: '基本工资', value: 'baseSalary' },
  { label: '职务工资', value: 'jobSalary' },
  { label: '服装津贴', value: 'clothesAllowance' },
  { label: '加班天数', value: 'overtimeDays' },
  { label: '加班标准', value: 'overtimeStandard' },
  { label: '加班费用', value: 'overtimePay' },
  { label: '节日天数', value: 'holidayDays' },
  { label: '节日标准', value: 'holidayStandard' },
  { label: '节日费用', value: 'holidayFee' },
  { label: '低保补贴', value: 'subsistenceAllowance' },
  { label: '其他1', value: 'otherAllowance1' },
  { label: '其他2', value: 'otherAllowance2' },
  { label: '应发工资', value: 'shouldSalary' },
  { label: '请假扣划', value: 'offWorkDeduct' },
  { label: '养老金', value: 'pension' },
  { label: '医保', value: 'medicalInsurance' },
  { label: '失业', value: 'unemploymentInsurance' },
  { label: '公积金(原大病)', value: 'seriousIllness' },
  { label: '意外险', value: 'accidentInsurance1' },
  { label: '意外险2', value: 'accidentInsurance2' },
  { label: '违纪工资', value: 'breachPrinciple' },
  { label: '不上班扣款', value: 'absenteeism' },
  { label: '其他扣款1', value: 'otherDeduct1' },
  { label: '其他扣款2', value: 'otherDeduct2' },
  { label: '保险补扣', value: 'insuranceDeduct' },
  { label: '个税', value: 'incomeTax' },
  { label: '实发工资', value: 'actualSalary' },
  { label: '卡工资', value: 'cardSalary' },
  { label: '制表日期', value: 'createDate' },
  { label: '备注', value: 'remark' },
]
// 复核、查询详情配置表
export const queryConfig = [
  { label: '工资年月', value: 'payday' },
  { label: '保安姓名', value: 'securityName' },
  { label: '银行账号', value: 'account' },
  { label: '证件号码', value: 'certificateNumber' },
  { label: '所属大队', value: 'deptName' },
  { label: '所属驻点', value: 'groupName' },
  { label: '工龄工资', value: 'seniorityPay' },
  { label: '超时补贴', value: 'overtimeAllowance' },
  { label: '餐费', value: 'mealAllowance' },
  { label: '考核工资', value: 'probationSalary' },
  { label: '岗位补贴', value: 'situationAllowance' },
  { label: '补足工资', value: 'repaySalary' },
  { label: '缺员加班', value: 'shorthandedOvertime' },
  { label: '出勤天数', value: 'attendanceDays' },
  { label: '出勤标准', value: 'attendanceStandard' },
  { label: '基本工资', value: 'baseSalary' },
  { label: '职务工资', value: 'jobSalary' },
  { label: '服装津贴', value: 'clothesAllowance' },
  { label: '加班天数', value: 'overtimeDays' },
  { label: '加班标准', value: 'overtimeStandard' },
  { label: '加班费用', value: 'overtimePay' },
  { label: '节日天数', value: 'holidayDays' },
  { label: '节日标准', value: 'holidayStandard' },
  { label: '节日费用', value: 'holidayFee' },
  { label: '低保补贴', value: 'subsistenceAllowance' },
  { label: '其他1', value: 'otherAllowance1' },
  { label: '其他2', value: 'otherAllowance2' },
  { label: '应发工资', value: 'shouldSalary' },
  { label: '请假扣划', value: 'offWorkDeduct' },
  { label: '养老金', value: 'pension' },
  { label: '医保', value: 'medicalInsurance' },
  { label: '失业', value: 'unemploymentInsurance' },
  { label: '公积金(原大病)', value: 'seriousIllness' },
  { label: '意外险', value: 'accidentInsurance1' },
  { label: '意外险2', value: 'accidentInsurance2' },
  { label: '违纪工资', value: 'breachPrinciple' },
  { label: '不上班扣款', value: 'absenteeism' },
  { label: '其他扣款1', value: 'otherDeduct1' },
  { label: '其他扣款2', value: 'otherDeduct2' },
  { label: '保险补扣', value: 'insuranceDeduct' },
  { label: '个税', value: 'incomeTax' },
  { label: '实发工资', value: 'actualSalary' },
  { label: '卡工资', value: 'cardSalary' },
  { label: '制表日期', value: 'createDate' },
  { label: '制表人', value: 'createBy' },
  { label: '复核日期', value: 'checkDate' },
  { label: '复核人', value: 'checkBy' },
  { label: '备注', value: 'remark' },
]

// 应发工资应加的 key
// 模式 1
export const addKeys1 = [
  'seniorityPay',
  // ---------区别------------
  'overtimeAllowance',
  'mealAllowance',
  'probationSalary',
  'situationAllowance',
  'repaySalary',
  'shorthandedOvertime',
  'baseSalary',
  // ---------区别------------
  'jobSalary',
  'clothesAllowance',
  'subsistenceAllowance',
  'otherAllowance1',
  'otherAllowance2',
]
// 模式2
export const addKeys2 = [
  'seniorityPay',
  'jobSalary',
  'clothesAllowance',
  'subsistenceAllowance',
  'otherAllowance1',
  'otherAllowance2',
]

// 实发工资应减的 key
export const subKeys = [
  'offWorkDeduct',
  'pension',
  'medicalInsurance',
  'unemploymentInsurance',
  'seriousIllness',
  'accidentInsurance1',
  'accidentInsurance2',
  'breachPrinciple',
  'absenteeism',
  'otherDeduct1',
  'otherDeduct2',
  'insuranceDeduct',
  'incomeTax',
]
