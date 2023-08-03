import request from '@/utils/request'

// 查询收款发票信息列表
export function listInvoice(query) {
  return request({
    url: '/affairs/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询收款发票信息详细
export function getInvoice(invoiceId) {
  return request({
    url: '/affairs/invoice/' + invoiceId,
    method: 'get'
  })
}

// 新增收款发票信息
export function addInvoice(data) {
  return request({
    url: '/affairs/invoice',
    method: 'post',
    data: data
  })
}

// 修改收款发票信息
export function updateInvoice(data) {
  return request({
    url: '/affairs/invoice',
    method: 'put',
    data: data
  })
}

// 删除收款发票信息
export function delInvoice(invoiceId) {
  return request({
    url: '/affairs/invoice/' + invoiceId,
    method: 'delete'
  })
}
