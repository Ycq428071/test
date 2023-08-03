import request from '@/utils/request'

// 查询单位负责人列表
export function listLeader(query) {
  return request({
    url: '/affairs/leader/list',
    method: 'get',
    params: query
  })
}

// 查询单位负责人详细
export function getLeader(staffHeadId) {
  return request({
    url: '/affairs/leader/' + staffHeadId,
    method: 'get'
  })
}

// 新增单位负责人
export function addLeader(data) {
  return request({
    url: '/affairs/leader',
    method: 'post',
    data: data
  })
}

// 修改单位负责人
export function updateLeader(data) {
  return request({
    url: '/affairs/leader',
    method: 'put',
    data: data
  })
}

// 删除单位负责人
export function delLeader(staffHeadId) {
  return request({
    url: '/affairs/leader/' + staffHeadId,
    method: 'delete'
  })
}
