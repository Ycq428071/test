import request from '@/utils/request'

// 查询保安人员管理列表
export function listStaff(query) {
  return request({
    url: '/affairs/staff/over60Staff',
    method: 'get',
    params: query
  })
}

// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('securityIds', data)
  return request({
    url: '/affairs/staff/exportOver60Staff',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}
