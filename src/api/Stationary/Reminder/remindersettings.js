import request from '@/utils/request'

// 查询提醒设置列表
export function listReminder(query) {
  return request({
    url: '/affairs/reminder/list',
    method: 'get',
    params: query
  })
}

// 查询提醒设置详细
export function getReminder(id) {
  return request({
    url: '/affairs/reminder/' + id,
    method: 'get'
  })
}

// 新增提醒设置
export function addReminder(data) {
  return request({
    url: '/affairs/reminder',
    method: 'post',
    data: data
  })
}

// 修改提醒设置
export function updateReminder(data) {
  return request({
    url: '/affairs/reminder',
    method: 'put',
    data: data
  })
}

// 删除提醒设置
export function delReminder(id) {
  return request({
    url: '/affairs/reminder/' + id,
    method: 'delete'
  })
}
// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('contractIds', data)
  return request({
    url: '/affairs/contract/exportExpireList',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}