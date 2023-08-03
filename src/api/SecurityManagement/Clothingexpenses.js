import request from '@/utils/request'

// 查询服装装备管理列表
export function listEquip(query) {
  return request({
    url: '/affairs/equip/list',
    method: 'get',
    params: query
  })
}

// 查询服装装备管理详细
export function getEquip(equipId) {
  return request({
    url: '/affairs/equip/' + equipId,
    method: 'get'
  })
}

// 新增服装装备管理
export function addEquip(data) {
  return request({
    url: '/affairs/equip',
    method: 'post',
    data: data
  })
}

// 修改服装装备管理
export function updateEquip(data) {
  return request({
    url: '/affairs/equip',
    method: 'put',
    data: data
  })
}

// 删除服装装备管理
export function delEquip(equipId) {
  return request({
    url: '/affairs/equip/' + equipId,
    method: 'delete'
  })
}
// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('equipIds', data)
  return request({
    url: '/affairs/equip/export',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}
