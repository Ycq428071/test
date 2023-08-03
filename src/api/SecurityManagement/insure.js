import request from '@/utils/request'

// 查询保安保险管理列表
export function listInsure(query) {
  return request({
    url: '/affairs/insure/list',
    method: 'get',
    params: query
  })
}

// 查询保安保险管理详细
export function getInsure(insureId) {
  return request({
    url: '/affairs/insure/' + insureId,
    method: 'get'
  })
}

// 新增保安保险管理
export function addInsure(data) {
  return request({
    url: '/affairs/insure',
    method: 'post',
    data: data
  })
}

// 修改保安保险管理
export function updateInsure(data) {
  return request({
    url: '/affairs/insure',
    method: 'put',
    data: data
  })
}

// 删除保安保险管理
export function delInsure(insureId) {
  return request({
    url: '/affairs/insure/' + insureId,
    method: 'delete'
  })
}
// 查询保安保险信息变更列表
export function changeHistory(query) {
  return request({
    url: '/affairs/insureLog/list',
    method: 'get',
    params: query
  })
}


// 保险基数调整
export function insuranceBaseAdjustments(query) {
  return request({
    url: '/affairs/insure/baseEdit',
    method: 'get',
    params: query
  })
}

// 保险类型不一致查询
export function inconsistentInsuranceTypes(query) {
  return request({
    url: '/affairs/staff/inconsistentType',
    method: 'get',
    params: query
  })
}


// 保安当月试用到期
export function theCurrentMonthsTrialExpires(query) {
  return request({
    url: '/affairs/staff/trialPeriod',
    method: 'get',
    params: query
  })
}

// 获取保安保险信息
export function getInsureInfo() {
  return request({
    url: '/affairs/insure/getInsureInfo',
    method: 'get',
  })
}

// 批量填报保险信息
export function writeInsure(data) {
  return request({
    url: '/affairs/insure/batchFilling',
    method: 'post',
    data: data
  })
}

// 批量消填报保险信息
export function unwriteInsure (insureIds) {
  const fm = new FormData()
  fm.append('insureIds', insureIds)
  return request({
    url: '/affairs/insure/batchCancelFilling',
    method: 'post',
    data: fm
  })
}
