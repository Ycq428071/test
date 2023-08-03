import request from '@/utils/request'

// 查询保安奖惩信息列表
export function listRewardPunish(query) {
  return request({
    url: '/affairs/rewardPunish/list',
    method: 'get',
    params: query
  })
}

// 查询保安奖惩信息详细
export function getRewardPunish(id) {
  return request({
    url: '/affairs/rewardPunish/' + id,
    method: 'get'
  })
}

// 新增保安奖惩信息
export function addRewardPunish(data) {
  return request({
    url: '/affairs/rewardPunish',
    method: 'post',
    data: data
  })
}

// 修改保安奖惩信息
export function updateRewardPunish(data) {
  return request({
    url: '/affairs/rewardPunish',
    method: 'put',
    data: data
  })
}

// 删除保安奖惩信息
export function delRewardPunish(id) {
  return request({
    url: '/affairs/rewardPunish/' + id,
    method: 'delete'
  })
}
