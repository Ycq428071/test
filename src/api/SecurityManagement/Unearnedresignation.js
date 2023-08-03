import request from '@/utils/request'

// 试用期未到离职查询
export function didntArriveAt(query) {
  return request({
    url: '/affairs/staff/depart',
    method: 'get',
    params: query
  })
}
// import { didntArriveAt } from '@/api/SecurityManagement/Unearnedresignation.js'