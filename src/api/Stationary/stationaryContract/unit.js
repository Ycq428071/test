import request from '@/utils/request'

// 查询驻点单位列表
export function listOfResidentUnits(query) {
  return request({
    url: '/affairs/unit/list',
    method: 'get',
    params: query
  })
}

// 新增驻点单位
export function Addstationaryunit(data) {
  return request({
    url: '/affairs/unit',
    method: 'post',
    data
  })
}

// 删除驻点单位
export function DeleteStationaryUnits(groupId) {
  return request({
    url: '/affairs/unit/' + groupId,
    method: 'DELETE',
  })
}

// 修改部门
export function ModifyDepartment(data) {
  return request({
    url: '/affairs/unit',
    method: 'put',
    data: data
  })
}

// 导出
export function exportAPI(data) {
  const prve = new FormData()
  prve.append('groupIds', data)
  return request({
    url: '/affairs/unit/export',
    method: 'post',
    responseType: 'blob',
    data: prve
  })
}

// 查询驻点单位变更信息列表
export function changeInformation(query) {
  return request({
    url: '/affairs/gorupLog/list',
    method: 'get',
    params: query
  })
}

export const unitConfig = [
  { label: '驻点单位', value: 'groupName' },
  { label: '签订合同', value: 'contractName' },
  { label: '所属大队', value: 'deptName' },
  { label: '负责人', value: 'headName' },
  { label: '单位类别', value: 'unitCategory', dict: 'un' },
  { label: '状态', value: 'status', dict: 'status' },
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
