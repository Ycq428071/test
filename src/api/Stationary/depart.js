import request from '@/utils/request'

// 查询部门管理列表
export function listStaffDept(query) {
  return request({
    url: '/affairs/staffDept/list',
    method: 'get',
    params: query
  })
}

// 查询部门管理详细
export function getStaffDept(deptId) {
  return request({
    url: '/affairs/staffDept/' + deptId,
    method: 'get'
  })
}

// 新增部门管理
export function addStaffDept(data) {
  return request({
    url: '/affairs/staffDept',
    method: 'post',
    data: data
  })
}

// 修改部门管理
export function updateStaffDept(data) {
  return request({
    url: '/affairs/staffDept',
    method: 'put',
    data: data
  })
}

// 删除部门管理
export function delStaffDept(deptId) {
  return request({
    url: '/affairs/staffDept/' + deptId,
    method: 'delete'
  })
}
