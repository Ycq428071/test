import request from '@/utils/request'

// 查询无账号保安人员
export function listNoAccount(params) {
  return request({
    url: '/affairs/staff/staffByNoAccount',
    method: 'get',
    params
  })
}

// 查询保安信息2
export function listGuard(params) {
  return request({
    url: '/salary/employee/getSecurityStaffList',
    method: 'get',
    params
  })
}

// 查询驻点单位列表
export function listUnit(params) {
  return request({
    url: '/affairs/unit/queryGroupList',
    method: 'get',
    params
  })
}

// 查询岗位列表
export function listPost(params) {
  return request({
    url: '/affairs/position/list',
    method: 'get',
    params
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/affairs/position',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/affairs/position',
    method: 'put',
    data
  })
}

// 注销岗位
export function logoutPost(data) {
  return request({
    url: '/affairs/position/logOffGroupPosition',
    method: 'put',
    data
  })
}

// 删除岗位
export function delPost(groupPositionId) {
  return request({
    url: '/affairs/position/' + groupPositionId,
    method: 'delete',
  })
}

// 岗位补贴列表
export function listPostAllowance(params) {
  return request({
    url: '/affairs/position/groupSubsidySettingsList',
    method: 'get',
    params
  })
}

// 岗位补贴复核消复核
export function reviewGroup(data) {
  return request({
    url: '/affairs/unit/groupReviewed',
    method: 'put',
    data
  })
}

// 保安驻点缺员加班列表
export function listUnderstaff(params) {
  return request({
    url: '/affairs/position/getGroupShortHandedList',
    method: 'get',
    params
  })
}

// 驻点缺员加班设置
export function updateUnderstaff(params) {
  return request({
    url: '/affairs/unit/updateStagnationPointShorthanded',
    method: 'post',
    params
  })
}

// 保安分队长管理人数统计
export function listPeopleCount(params) {
  return request({
    url: '/salary/manage/getUnitHeadCount',
    method: 'get',
    params
  })
}

// 保安当月无工资查询
export function listNoSalary(params) {
  return request({
    url: '/salary/manage/getEmpMonthNoSalary',
    method: 'get',
    params
  })
}

// 保安当月试用到期
export function listTrialPeriod(params) {
  return request({
    url: '/affairs/staff/trialPeriod',
    method: 'get',
    params
  })
}

// 账号设置详情配置表
export const accountConfig = [
  { label: '保安姓名', value: 'securityName' },
  { label: '所属大队', value: 'deptName' },
  { label: '所属驻点', value: 'groupName' },
  { label: '证件类型', value: 'certificateType', dict: 'query_certificate_type' },
  { label: '证件号码', value: 'certificateNumber' },
  { label: '状态', value: 'status', dict: 'query_guard_state' },
  { label: '出生日期', value: 'birthday' },
  { label: '报道日期', value: 'reportDate' },
  { label: '性别', value: 'sex', dict: 'sys_user_sex' },
  { label: '婚姻', value: 'marriage', dict: 'marriage' },
  { label: '民族', value: 'nation', dict: 'nation' },
  { label: '文化程度', value: 'education', dict: 'education' },
  { label: '政治面貌', value: 'politicaloutlook', dict: 'politicaloutlook' },
  { label: '退伍', value: 'discharge', dict: 'discharge' },
  { label: '健康状况', value: 'health', dict: 'health' },
  { label: '资格证', value: 'qualification', dict: 'qualification' },
  { label: '保安级别', value: 'securitylevel', dict: 'securitylevel' },
  { label: '户籍性质', value: 'domicile', dict: 'domicile' },
  { label: '养老保险', value: 'endowmentinsurance', dict: 'endowmentinsurance' },
  { label: '身高（cm）', value: 'height' },
  { label: '手机号码', value: 'phoneNumber' },
  { label: '上岗日期', value: 'onBoardDate' },
  { label: '保安证编号', value: 'reportNumber' },
  { label: '户籍地址', value: 'registeredResidenceAddress' },
  { label: '现住地', value: 'currentResidence' },
  { label: '现住地址', value: 'currentAddress' },
  { label: '合始日期', value: 'contractStartDate' },
  { label: '合止日期', value: 'contractEndDate' },
  { label: '试始日期', value: 'trialStartDate' },
  { label: '试止日期', value: 'trialEndDate' },
  { label: '银行类型', value: 'bankType', dict: 'bank_type' },
  { label: '银行账号', value: 'account' },
  { label: '备注', value: 'remark' },
]

// 试用日期设置详情配置表
export const trialDateConfig = [
  { label: '保安姓名', value: 'securityName' },
  { label: '所属大队', value: 'deptName' },
  { label: '所属驻点', value: 'groupName' },
  { label: '证件类型', value: 'certificateType', dict: 'query_certificate_type' },
  { label: '证件号码', value: 'certificateNumber' },
  { label: '状态', value: 'status', dict: 'query_guard_state' },
  { label: '出生日期', value: 'birthday' },
  { label: '报道日期', value: 'reportDate' },
  { label: '性别', value: 'sex', dict: 'sys_user_sex' },
  { label: '婚姻', value: 'marriage', dict: 'marriage' },
  { label: '民族', value: 'nation', dict: 'nation' },
  { label: '文化程度', value: 'education', dict: 'education' },
  { label: '政治面貌', value: 'politicaloutlook', dict: 'politicaloutlook' },
  { label: '退伍', value: 'discharge', dict: 'discharge' },
  { label: '健康状况', value: 'health', dict: 'health' },
  { label: '资格证', value: 'qualification', dict: 'qualification' },
  { label: '保安级别', value: 'securitylevel', dict: 'securitylevel' },
  { label: '户籍性质', value: 'domicile', dict: 'domicile' },
  { label: '养老保险', value: 'endowmentinsurance', dict: 'endowmentinsurance' },
  { label: '身高（cm）', value: 'height' },
  { label: '手机号码', value: 'phoneNumber' },
  { label: '上岗日期', value: 'onBoardDate' },
  { label: '保安证编号', value: 'reportNumber' },
  { label: '户籍地址', value: 'registeredResidenceAddress' },
  { label: '现住地', value: 'currentResidence' },
  { label: '现住地址', value: 'currentAddress' },
  { label: '试始日期', value: 'trialStartDate' },
  { label: '试止日期', value: 'trialEndDate' },
]

// 保安驻点定义详情配置表
export const guardConfig = [
  { label: '驻点名称', value: '' },
  { label: '合同名称', value: '' },
  { label: '驻点负责人', value: '' },
  { label: '驻点电话', value: '' },
  { label: '所属大队', value: '' },
  { label: '客户联系电话', value: '' },
  { label: '客户联系人', value: '' },
  { label: '地址', value: '' },
  { label: '状态', value: '' },
  { label: '编制人数', value: '' },
  { label: '客户类型', value: '' },
  { label: '工作性质', value: '' },
  { label: '提供住宿', value: '' },
  { label: '住宿地址', value: '' },
  { label: '管理性质', value: '' },
  { label: '修改时间', value: '' },
  { label: '加班工资', value: '' },
  { label: '基本工资', value: '' },
  { label: '节假标准', value: '' },
  { label: '备注', value: '' },
]

// 驻点补贴、复核详情配置表
export const allowanceConfig = [
  { label: '驻点名称', value: '' },
  { label: '驻点电话', value: '' },
  { label: '驻点负责人', value: '' },
  { label: '所属大队', value: '' },
  { label: '客户联系电话', value: '' },
  { label: '客户联系人', value: '' },
  { label: '地址', value: '' },
  { label: '状态', value: '' },
  { label: '编制人数', value: '' },
  { label: '提供住宿', value: '' },
  { label: '住宿地址', value: '' },
  { label: '工作性质', value: '' },
  { label: '管理性质', value: '' },
  { label: '超时补贴', value: '' },
  { label: '餐费', value: '' },
  { label: '考核工资', value: '' },
  { label: '岗位补贴', value: '' },
  { label: '备注', value: '' },
]

// 驻点缺员加班详情配置表
export const understaffConfig = [
  { label: '驻点名称', value: 'groupName' },
  { label: '驻点电话', value: 'phone' },
  { label: '驻点负责人', value: 'head' },
  { label: '所属大队', value: 'deptName' },
  { label: '客户联系电话', value: 'customerTelephone' },
  { label: '客户联系人', value: 'customer' },
  { label: '地址', value: 'address' },
  { label: '状态', value: 'status', dict: 'status' },
  { label: '编制人数', value: 'headCount' },
  { label: '提供住宿', value: 'accommodate', dict: 'query_offer_house' },
  { label: '住宿地址', value: '' },
  { label: '工作性质', value: 'jobNature', dict: 'query_work_nature' },
  { label: '管理性质', value: 'managementNature', dict: 'query_manage_nature' },
  { label: '缺员加班', value: 'shorthandedOvertime' },
  { label: '备注', value: 'remark' },
]

// 保安当月无工资查询、试用到期详情配置表
export const currentConfig = [
  { label: '保安姓名', value: 'securityName' },
  { label: '所属大队', value: 'deptName' },
  { label: '所属驻点', value: 'groupName' },
  { label: '证件类型', value: 'certificateType', dict: 'query_certificate_type' },
  { label: '证件号码', value: 'certificateNumber' },
  { label: '状态', value: 'status', dict: 'query_guard_state' },
  { label: '出生日期', value: 'birthday' },
  { label: '报道日期', value: 'reportDate' },
  { label: '性别', value: 'sex', dict: 'sys_user_sex' },
  { label: '婚姻', value: 'marriage', dict: 'marriage' },
  { label: '民族', value: 'nation', dict: 'nation' },
  { label: '文化程度', value: 'education', dict: 'education' },
  { label: '政治面貌', value: 'politicalOutlook', dict: 'politicaloutlook' },
  { label: '退伍', value: 'discharge', dict: 'discharge' },
  { label: '健康状况', value: 'health', dict: 'health' },
  { label: '资格证', value: 'qualification', dict: 'qualification' },
  { label: '保安级别', value: 'securitylevel', dict: 'securitylevel' },
  { label: '户籍性质', value: 'domicile', dict: 'domicile' },
  { label: '养老保险', value: 'endowmentinsurance', dict: 'endowmentinsurance' },
  { label: '身高（cm）', value: 'height' },
  { label: '手机号码', value: 'phoneNumber' },
  { label: '服装款', value: 'clothingStyle' },
  { label: '上岗日期', value: 'onBoardDate' },
  { label: '保安证编号', value: 'reportNumber' },
  { label: '户籍地址', value: 'registeredResidenceAddress' },
  { label: '现住地', value: 'currentResidence' },
  { label: '现住地址', value: 'currentAddress' },
  { label: '合始日期', value: 'contractStartDate' },
  { label: '合止日期', value: 'contractEndDate' },
  { label: '试始日期', value: 'trialStartDate' },
  { label: '试止日期', value: 'trialEndDate' },
  { label: '银行类型', value: 'bankType', dict: 'bank_type' },
  { label: '银行账号', value: 'account' },
  { label: '是否自补', value: '' },
  { label: '自补备注', value: '' },
]
