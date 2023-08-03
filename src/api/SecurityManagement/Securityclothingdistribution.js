import request from '@/utils/request'

// 查询保安服装配发管理列表
export function listEcurityEquip(query) {
  return request({
    url: '/affairs/ecurityEquip/list',
    method: 'get',
    params: query
  })
}

// 查询保安服装配发管理详细
export function getEcurityEquip(id) {
  return request({
    url: '/affairs/ecurityEquip/' + id,
    method: 'get'
  })
}

// 新增保安服装配发管理
export function addEcurityEquip(data) {
  return request({
    url: '/affairs/ecurityEquip',
    method: 'post',
    data: data
  })
}

// 修改保安服装配发管理
export function updateEcurityEquip(data) {
  return request({
    url: '/affairs/ecurityEquip',
    method: 'put',
    data: data
  })
}

// 删除保安服装配发管理
export function delEcurityEquip(id) {
  return request({
    url: '/affairs/ecurityEquip/' + id,
    method: 'delete'
  })
}
