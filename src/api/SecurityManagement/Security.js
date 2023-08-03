import request from '@/utils/request'

// 查询保安人员管理列表
export function listStaff(query) {
  return request({
    url: '/affairs/staff/list',
    method: 'get',
    params: query
  })
}

// 查询保安人员管理详细
export function getStaff(securityId) {
  return request({
    url: '/affairs/staff/' + securityId,
    method: 'get'
  })
}

// 新增保安人员管理
export function addStaff(data) {
  return request({
    url: '/affairs/staff',
    method: 'post',
    data: data
  })
}

// 修改保安人员管理
export function updateStaff(data) {
  return request({
    url: '/affairs/staff',
    method: 'put',
    data: data
  })
}

// 离职
export function departStaff(data) {
  return request({
    url: '/affairs/staff/staffDepart',
    method: 'put',
    data: data
  })
}

// 删除保安人员管理
export function delStaff(securityId) {
  return request({
    url: '/affairs/staff/' + securityId,
    method: 'delete'
  })
}
// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('securityIds', data)
  return request({
    url: '/affairs/staff/export',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}

// 查询保安人员信息变更记录列表
export function changeHistory(query) {
  return request({
    url: '/affairs/staffLog/list',
    method: 'get',
    params: query
  })
}

export function exportprobationPeriodAPI(data) {
  const prve = new FormData()
  prve.append('securityIds', data)
  return request({
    url: '/affairs/staff/exportTrialPeriod',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}

export const secuConfig = [
  { label: '保安姓名', value: 'securityName' },
  { label: '保安证编号', value: 'reportNumber' },
  { label: '手机号码', value: 'phoneNumber' },
  { label: '所属大队', value: 'deptName' },
  { label: '所属岗位', value: 'positionName' },
  { label: '状态', value: 'status', dict: 'query_guard_state' },
  { label: '报道日期', value: 'reportDate' },
  { label: '上岗日期', value: 'onBoardDate' },
  { label: '进驻日期', value: 'enteringDate' },
  { label: '合同开始日期', value: 'contractStartDate' },
  { label: '合同截止日期', value: 'contractEndDate' },
  { label: '试用开始日期', value: 'trialStartDate' },
  { label: '试用截止日期', value: 'trialEndDate' },
  { label: '证件类型', value: 'certificateType', dict: 'query_certificate_type' },
  { label: '证件号码', value: 'certificateNumber' },
  { label: '出生日期', value: 'birthday' },
  { label: '性别', value: 'sex', dict: 'sys_user_sex' },
  { label: '户籍地址', value: 'registeredResidenceAddress' },
  { label: '现居地址', value: 'currentAddress' },
  { label: '银行类型', value: 'bankType', dict: 'bank_type' },
  { label: '银行账号', value: 'account' },
  { label: '身高(cm)', value: 'height' },
  { label: '婚姻', value: 'marriage', dict: 'marriage' },
  { label: '民族', value: 'nation', dict: 'nation' },
  { label: '文化程度', value: 'education', dict: 'education' },
  { label: '政治面貌', value: 'politicalOutlook', dict: 'politicaloutlook' },
  { label: '退伍', value: 'discharge', dict: 'discharge' },
  { label: '健康状况', value: 'health', dict: 'health' },
  { label: '资格证', value: 'qualification', dict: 'qualification' },
  { label: '保安级别', value: 'securityLevel', dict: 'securitylevel' },
  { label: '户籍性质', value: 'domicile', dict: 'domicile' },
  { label: '养老保险', value: 'endowmentInsurance', dict: 'endowmentinsurance' },
  { label: '意外险', value: 'accidentInsurance', dict: 'accidentinsurance' },
  { label: '职业等级', value: 'jobLevel', dict: 'joblevel' },
  { label: '备注', value: 'remark' },
  { label: '保安证附件', value: 'securityCertificateAnnex', isUpload: true },
  { label: '证件附件', value: 'certificateAnnex', isUpload: true },
  { label: '资格证附件', value: 'qualificationAnnex', isUpload: true },
]

export const secuColumns = [
  { label: '保安姓名', prop: 'securityName', showTip: true },
  { label: '保安证编号', prop: 'reportNumber', width: '90', showTip: true },
  { label: '手机号码', prop: 'phoneNumber', width: '100', showTip: true },
  { label: '所属大队', prop: 'deptName', showTip: true },
  { label: '所属岗位', prop: 'positionName', showTip: true },
  { label: '状态', prop: 'status', dict: 'query_guard_state', showTip: true },
  { label: '报道日期', prop: 'reportDate', showTip: true, width: '100' },
  { label: '上岗日期', prop: 'onBoardDate', showTip: true, width: '100' },
  { label: '进驻日期', prop: 'enteringDate', showTip: true, width: '100' },
  { label: '合同开始日期', prop: 'contractStartDate', showTip: true, width: '100' },
  { label: '合同截止日期', prop: 'contractEndDate', showTip: true, width: '100' },
  { label: '试用开始日期', prop: 'trialStartDate', showTip: true, width: '100' },
  { label: '试用截止日期', prop: 'trialEndDate', showTip: true, width: '100' },
  { label: '证件类型', prop: 'certificateType', dict: 'query_certificate_type', showTip: true },
  { label: '证件号码', prop: 'certificateNumber', showTip: true, width: '150' },
  { label: '出生日期', prop: 'birthday', showTip: true, width: '100' },
  { label: '性别', prop: 'sex', dict: 'sys_user_sex', showTip: true },
  { label: '户籍地址', prop: 'registeredResidenceAddress', showTip: true },
  { label: '现居地址', prop: 'currentAddress', showTip: true },
  { label: '银行类型', prop: 'bankType', dict: 'bank_type', showTip: true },
  { label: '银行账号', prop: 'account', showTip: true },
  { label: '身高(cm)', prop: 'height', showTip: true },
  { label: '婚姻', prop: 'marriage', dict: 'marriage', showTip: true },
  { label: '民族', prop: 'nation', dict: 'nation', showTip: true },
  { label: '文化程度', prop: 'education', dict: 'education', showTip: true },
  { label: '政治面貌', prop: 'politicalOutlook', dict: 'politicaloutlook', showTip: true },
  { label: '退伍', prop: 'discharge', dict: 'discharge', showTip: true },
  { label: '健康状况', prop: 'health', dict: 'health', showTip: true },
  { label: '资格证', prop: 'qualification', dict: 'qualification', showTip: true },
  { label: '保安级别', prop: 'securityLevel', dict: 'securitylevel', showTip: true },
  { label: '户籍性质', prop: 'domicile', dict: 'domicile', width: '90', showTip: true },
  { label: '养老保险', prop: 'endowmentInsurance', dict: 'endowmentinsurance', showTip: true },
  { label: '意外险', prop: 'accidentInsurance', dict: 'accidentinsurance', showTip: true },
  { label: '职业等级', prop: 'jobLevel', dict: 'joblevel', showTip: true },
  { label: '备注', prop: 'remark', showTip: true },
  { label: '保安证附件', prop: 'securityCertificateAnnex', isUpload: true, width: '200' },
  { label: '证件附件', prop: 'certificateAnnex', isUpload: true, width: '200' },
  { label: '资格证附件', prop: 'qualificationAnnex', isUpload: true, width: '200' },
]
