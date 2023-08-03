import request from '@/utils/request'

// 收款到期提醒
export function reminderOfPaymentDue(query) {
  return request({
    url: '/affairs/payment/expireList',
    method: 'get',
    params: query
  })
}