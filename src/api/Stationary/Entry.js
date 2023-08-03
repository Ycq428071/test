import request from '@/utils/request'

// 查询驻点合同收款信息列表
export function listPayment(query) {
  return request({
    url: '/affairs/payment/list',
    method: 'get',
    params: query
  })
}

// 查询驻点合同收款信息详细
export function getPayment(groupPaymentId) {
  return request({
    url: '/affairs/payment/' + groupPaymentId,
    method: 'get'
  })
}

// 新增驻点合同收款信息
export function addPayment(data) {
  return request({
    url: '/affairs/payment',
    method: 'post',
    data: data
  })
}

// 修改驻点合同收款信息
export function updatePayment(data) {
  return request({
    url: '/affairs/payment',
    method: 'put',
    data: data
  })
}

// 删除驻点合同收款信息
export function delPayment(groupPaymentId) {
  return request({
    url: '/affairs/payment/' + groupPaymentId,
    method: 'delete'
  })
}

export const detailConfig = [
  { label: '合同名称', value: 'contractName' },
  { label: '合同编号', value: 'contractNumber' },
  { label: '签约人', value: 'signatory' },
  { label: '负责人', value: 'headName' },
  { label: '所属大队', value: 'deptName' },
  { label: '合同状态', value: 'contractState', dict: 'contractstate' },
  { label: '单位类别', value: 'unitCategory', dict: 'un' },
  { label: '合同上交', value: 'contractSubmission', dict: 'contractsubmission' },
  { label: '缴费方式', value: 'paymentMethod', dict: 'paymentmethod' },
  { label: '缴费周期', value: 'paymentCycle', dict: 'paymentcycle' },
  { label: '签约日期', value: 'signingDate' },
  { label: '生效日期', value: 'effectiveDate' },
  { label: '终止日期', value: 'endDate' },
  { label: '保安人数', value: 'staffNumber' },
  { label: '保安费用', value: 'staffCosts' },
  { label: '消控人数', value: 'fireControlNum' },
  { label: '消控单价', value: 'fireControlCosts' },
  { label: '餐费补贴', value: 'mealAllowance' },
  { label: '小队长补贴', value: 'leaderAllowance' },
  { label: '超时补贴', value: 'overTimeAllowance' },
  { label: '其他费', value: 'otherCost' },
  { label: '月费用', value: 'mouthCost' },
  { label: '年人费用', value: 'annualPeopleCost' },
  { label: '年总费用', value: 'annualTotalCost' },
  { label: '备注', value: 'remark' },
]
