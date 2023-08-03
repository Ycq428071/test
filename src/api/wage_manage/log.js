import request from '@/utils/request'

// 查询保安人员信息变更记录列表
export function staffLog(params) {
  return request({
    url: '/affairs/staffLog/list',
    method: 'get',
    params
  })
}

// 查询驻点单位变更信息列表
export function gorupLog(params) {
  return request({
    url: '/affairs/gorupLog/list',
    method: 'get',
    params
  })
}

// 查询驻点单位合同信息变更记录列表
export function contractLog(params) {
  return request({
    url: '/affairs/contractLog/list',
    method: 'get',
    params
  })
}

// 保安人员信息变更记录列表
export const staffLogColumns = [
  { label: '报道日期', prop: 'reportDate', },
  { label: '进驻日期', prop: '', },
  { label: '保安姓名', prop: 'securityName', },
  { label: '证件号码', prop: 'certificateNumber', },
  { label: '银行账号', prop: 'account', },
  { label: '所属大队', prop: 'deptName', showTip: true },
  { label: '所属驻点', prop: 'groupName', showTip: true },
  { label: '户籍地址', prop: 'registeredResidenceAddress', showTip: true },
  { label: '变更内容', prop: '', },
  { label: '变更时间', prop: 'createTime', showTip: true },
]
