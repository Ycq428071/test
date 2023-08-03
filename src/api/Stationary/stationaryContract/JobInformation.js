import request from '@/utils/request'

// 查询驻点岗位信息列表
export function listPosition(query) {
  return request({
    url: '/affairs/position/list',
    method: 'get',
    params: query
  })
}

// 查询驻点岗位信息详细
export function getPosition(groupPositionId) {
  return request({
    url: '/affairs/position/' + groupPositionId,
    method: 'get'
  })
}

// 新增驻点岗位信息
export function addPosition(data) {
  return request({
    url: '/affairs/position',
    method: 'post',
    data: data
  })
}

// 修改驻点岗位信息
export function updatePosition(data) {
  return request({
    url: '/affairs/position',
    method: 'put',
    data: data
  })
}

// 删除驻点岗位信息
export function delPosition(groupPositionId) {
  return request({
    url: '/affairs/position/' + groupPositionId,
    method: 'delete'
  })
}
