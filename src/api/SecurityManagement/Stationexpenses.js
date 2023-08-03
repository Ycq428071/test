import request from '@/utils/request'

// 查询驻点费用列表
export function listGroupCost(query) {
  return request({
    url: '/affairs/groupCost/list',
    method: 'get',
    params: query
  })
}

// 查询驻点费用详细
export function getGroupCost(id) {
  return request({
    url: '/affairs/groupCost/' + id,
    method: 'get'
  })
}

// 新增驻点费用
export function addGroupCost(data) {
  return request({
    url: '/affairs/groupCost',
    method: 'post',
    data: data
  })
}

// 修改驻点费用
export function updateGroupCost(data) {
  return request({
    url: '/affairs/groupCost',
    method: 'put',
    data: data
  })
}

// 删除驻点费用
export function delGroupCost(id) {
  return request({
    url: '/affairs/groupCost/' + id,
    method: 'delete'
  })
}
// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('groupIds', data)
  return request({
    url: '/affairs/groupCost/export',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}