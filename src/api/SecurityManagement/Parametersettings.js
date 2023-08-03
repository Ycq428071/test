import request from '@/utils/request'

// 查询保安参数设置管理列表
export function listSysParam(query) {
  return request({
    url: '/affairs/sysParam/list',
    method: 'get',
    params: query
  })
}

// 查询保安参数设置管理详细
export function getSysParam(paramId) {
  return request({
    url: '/affairs/sysParam/' + paramId,
    method: 'get'
  })
}

// 新增保安参数设置管理
export function addSysParam(data) {
  return request({
    url: '/affairs/sysParam',
    method: 'post',
    data: data
  })
}

// 修改保安参数设置管理
export function updateSysParam(data) {
  return request({
    url: '/affairs/sysParam',
    method: 'put',
    data: data
  })
}

// 删除保安参数设置管理
export function delSysParam(paramId) {
  return request({
    url: '/affairs/sysParam/' + paramId,
    method: 'delete'
  })
}
// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('paramIds', data)
  return request({
    url: '/affairs/sysParam/export',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}