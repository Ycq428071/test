import request from '@/utils/request'

// 查询保安自补管理列表
export function listSupply(query) {
  return request({
    url: '/affairs/supply/list',
    method: 'get',
    params: query
  })
}

// 查询保安自补管理详细
export function getSupply(supplyId) {
  return request({
    url: '/affairs/supply/' + supplyId,
    method: 'get'
  })
}

// 新增保安自补管理
export function addSupply(data) {
  return request({
    url: '/affairs/supply',
    method: 'post',
    data: data
  })
}

// 修改保安自补管理
export function updateSupply(data) {
  return request({
    url: '/affairs/supply',
    method: 'put',
    data: data
  })
}

// 删除保安自补管理
export function delSupply(supplyId) {
  return request({
    url: '/affairs/supply/' + supplyId,
    method: 'delete'
  })
}

// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('securityIds', data)
  return request({
    url: '/affairs/supply/export',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}