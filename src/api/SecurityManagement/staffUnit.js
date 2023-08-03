import request from '@/utils/request'

// 查询保安分队管理列表
export function listStaffUnit(query) {
  return request({
    url: '/affairs/staffUnit/list',
    method: 'get',
    params: query
  })
}

// 查询保安分队管理详细
export function getStaffUnit(unitId) {
  return request({
    url: '/affairs/staffUnit/' + unitId,
    method: 'get'
  })
}

// 新增保安分队管理
export function addStaffUnit(data) {
  return request({
    url: '/affairs/staffUnit',
    method: 'post',
    data: data
  })
}

// 修改保安分队管理
export function updateStaffUnit(data) {
  return request({
    url: '/affairs/staffUnit',
    method: 'put',
    data: data
  })
}

// 删除保安分队管理
export function delStaffUnit(unitId) {
  return request({
    url: '/affairs/staffUnit/' + unitId,
    method: 'delete'
  })
}

// 查询部门列表
export function Department(params) {
  return request({
    url: '/affairs/staffDept/list',
    method: 'get',
    params
  })
}
