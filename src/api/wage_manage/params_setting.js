import request from '@/utils/request'

// 系统参数查询接口
export function listSysParams(params) {
  return request({
    url: '/affairs/sysParam/list',
    method: 'get',
    params
  })
}

// 系统参数修改接口
export function updateSysParams(data) {
  return request({
    url: '/affairs/sysParam',
    method: 'put',
    data
  })
}

// 查询保安保险补扣列表
export function listDeduction(params) {
  return request({
    url: '/affairs/deduction/list',
    method: 'get',
    params
  })
}

// 删除保安保险补扣
export function delDeduction(insuranceDeductionIds) {
  return request({
    url: '/affairs/deduction/' + insuranceDeductionIds,
    method: 'delete',
  })
}

// 查询保安保险数据导入列表
export function listGuardInsure(params) {
  return request({
    url: '/affairs/insureExport/list',
    method: 'get',
    params
  })
}

// 删除保安保险数据导入
export function delGuardInsure (salaryYear) {
  return request({
    url: '/affairs/insureExport/' + salaryYear,
    method: 'delete',
  })
}
