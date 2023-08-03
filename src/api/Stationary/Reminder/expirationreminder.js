import request from '@/utils/request'

// 查询保安单位驻点到期合同列表
export function listOfExpiredContracts(query) {
  return request({
    url: '/affairs/contract/expireList',
    method: 'get',
    params: query
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

