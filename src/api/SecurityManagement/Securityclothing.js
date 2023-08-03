import request from '@/utils/request'

// 查询保安服装费用列表
export function listClothingFee(query) {
  return request({
    url: '/affairs/clothingFee/list',
    method: 'get',
    params: query
  })
}

// 查询保安服装费用详细
export function getClothingFee(feeId) {
  return request({
    url: '/affairs/clothingFee/' + feeId,
    method: 'get'
  })
}

// 新增保安服装费用
export function addClothingFee(data) {
  return request({
    url: '/affairs/clothingFee',
    method: 'post',
    data: data
  })
}

// 修改保安服装费用
export function updateClothingFee(data) {
  return request({
    url: '/affairs/clothingFee',
    method: 'put',
    data: data
  })
}

// 删除保安服装费用
export function delClothingFee(feeId) {
  return request({
    url: '/affairs/clothingFee/' + feeId,
    method: 'delete'
  })
}
