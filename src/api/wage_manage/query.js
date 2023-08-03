import request from '@/utils/request'

// 查询大队列表
export function listDept(query) {
  return request({
    url: '/affairs/staffDept/list',
    method: 'get',
    params: query
  })
}

// 查询保安中队列表
export function listSqua(query) {
  return request({
    url: '/affairs/squadron/list',
    method: 'get',
    params: query
  })
}

// 查询保安分队列表
export function listElem(query) {
  return request({
    url: '/affairs/staffUnit/list',
    method: 'get',
    params: query
  })
}

// 查询驻点单位列表
export function listUnit(query) {
  return request({
    url: '/affairs/unit/list',
    method: 'get',
    params: query
  })
}

// 查询驻点负责人列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询保安单位驻点合同列表
export function listCont(query) {
  return request({
    url: '/affairs/contract/list',
    method: 'get',
    params: query
  })
}

// 查询保安人员管理列表
export function listHead(query) {
  return request({
    url: '/affairs/staff/list',
    method: 'get',
    params: query
  })
}
