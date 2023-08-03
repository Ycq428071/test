import request from '@/utils/request'

// 查询保安中队管理列表
export function listSquadron(query) {
  return request({
    url: '/affairs/squadron/list',
    method: 'get',
    params: query
  })
}

// 查询保安中队管理详细
export function getSquadron(squadronId) {
  return request({
    url: '/affairs/squadron/' + squadronId,
    method: 'get'
  })
}

// 新增保安中队管理
export function addSquadron(data) {
  return request({
    url: '/affairs/squadron',
    method: 'post',
    data: data
  })
}

// 修改保安中队管理
export function updateSquadron(data) {
  return request({
    url: '/affairs/squadron',
    method: 'put',
    data: data
  })
}

// 删除保安中队管理
export function delSquadron(squadronId) {
  return request({
    url: '/affairs/squadron/' + squadronId,
    method: 'delete'
  })
}


// 查询部门列表
export function Department(query) {
  return request({
    url: '/affairs/staffDept/list',
    method: 'get',
    params: query
  })
}