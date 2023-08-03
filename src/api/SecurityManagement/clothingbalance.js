import request from '@/utils/request'

// 查询保安服装余额列表
export function listOfBalances(query) {
  return request({
    url: '/affairs/residueCost/list',
    method: 'get',
    params: query
  })
}


// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('securityIds', data)
  return request({
    url: '/affairs/residueCost/export',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}