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

// 删除保安人员管理
export function delStaff(securityId) {
  return request({
    url: '/affairs/staff/' + securityId,
    method: 'delete'
  })
}
