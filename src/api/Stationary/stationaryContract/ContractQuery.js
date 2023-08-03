import request from '@/utils/request'

// 查询保安单位驻点合同列表
export function listContract(query) {
  return request({
    url: '/affairs/contract/list',
    method: 'get',
    params: query
  })
}

// 查询保安单位驻点合同详细
export function getContract(contractId) {
  return request({
    url: '/affairs/contract/' + contractId,
    method: 'get'
  })
}

// 新增保安单位驻点合同
export function addContract(data) {
  return request({
    url: '/affairs/contract',
    method: 'post',
    data: data
  })
}

// 修改保安单位驻点合同
export function updateContract(data) {
  return request({
    url: '/affairs/contract',
    method: 'put',
    data: data
  })
}

// 删除保安单位驻点合同
export function delContract(contractId) {
  return request({
    url: '/affairs/contract/' + contractId,
    method: 'delete'
  })
}
// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('contractIds', data)
  return request({
    url: '/affairs/contract/export',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}

// 查询驻点单位变更信息列表
export function changeInformation(query) {
  return request({
    url: '/affairs/contractLog/list',
    method: 'get',
    params: query
  })
}

// 查询合同下的驻点单位
export function residentUnitAPI(query) {
  return request({
    url: '/affairs/unit/groupList',
    method: 'get',
    params: query
  })
}


// 查询驻点签订的合同列表

export function signedAPI(query) {
  return request({
    url: '/affairs/contract/contractList',
    method: 'get',
    params: query
  })
}

// 批量复核合同
export function checkCont(ids) {
  return request({
    url: '/affairs/contract/checkContracts/' + ids,
    method: 'put',
  })
}

// 终止合同
export function endContract(query) {
  return request({
    url: '/affairs/contract/terminationContract',
    method: 'get',
    params: query
  })
}

// 查询合同费用记录列表
export function listLog(query) {
  return request({
    url: '/contractCostLog/contractCostLog/list',
    method: 'get',
    params: query
  })
}

// 新增合同费用记录
export function addLog(data) {
  return request({
    url: '/contractCostLog/contractCostLog',
    method: 'post',
    data
  })
}

// 修改合同费用记录
export function updateLog(data) {
  return request({
    url: '/contractCostLog/contractCostLog',
    method: 'put',
    data
  })
}

// 删除合同费用记录
export function delLog(ids) {
  return request({
    url: '/contractCostLog/contractCostLog/' + ids,
    method: 'delete',
  })
}

// 查看续签历史合同
export function listHistory(query) {
  return request({
    url: '/affairs/contract/noPagingList',
    method: 'get',
    params: query
  })
}

export const contConfig = [
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
