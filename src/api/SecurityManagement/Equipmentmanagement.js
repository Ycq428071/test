import request from '@/utils/request'

// 查询驻点装备配发管理列表
export function listGroupEquip(query) {
  return request({
    url: '/affairs/groupEquip/list',
    method: 'get',
    params: query
  })
}

// 查询驻点装备配发管理详细
export function getGroupEquip(id) {
  return request({
    url: '/affairs/groupEquip/' + id,
    method: 'get'
  })
}

// 新增驻点装备配发管理
export function addGroupEquip(data) {
  return request({
    url: '/affairs/groupEquip',
    method: 'post',
    data: data
  })
}

// 修改驻点装备配发管理
export function updateGroupEquip(data) {
  return request({
    url: '/affairs/groupEquip',
    method: 'put',
    data: data
  })
}

// 删除驻点装备配发管理
export function delGroupEquip(id) {
  return request({
    url: '/affairs/groupEquip/' + id,
    method: 'delete'
  })
}
