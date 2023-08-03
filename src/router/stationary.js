import Layout from '@/layout'

export default [
  {
    path: '/SecurityManagement/Security-add',
    component: Layout,
    hidden: true,
    permissions: ['affairs:staff:list'],
    children: [
      {
        path: 'index/:securityId(\\d+)',
        component: () => import('@/views/SecurityManagement/Securityadd.vue'),
        name: 'Security-add',
        meta: { title: '保安人员', activeMenu: '/securitymanagement/Security' }
      }
    ]
  },
  {
    path: '/stationaryContract/ContractQuery-add',
    component: Layout,
    hidden: true,
    permissions: ['affairs:contract:list'],
    children: [
      { 
        // flag 标识场景 0 新增、1 续签、2 修改、3 新增合同费用记录、4 修改合同费用记录
        path: 'index/:flag(\\d+)/:contractId(\\d+)',
        component: () => import('@/views/Stationary/stationaryContract/ContractQueryAdd.vue'),
        name: 'ContractQuery-add',
        meta: {
          title: '编辑驻点合同信息', activeMenu: '/Stationary/stationaryContract/ContractQuery'
        }
      }
    ]
  },

  {
    path: '/Stationary/paymentstationarycontract/Entry',
    component: Layout,
    hidden: true,
    permissions: ['affairs:contract:list'],
    children: [
      {
        path: 'index/:renewalId(\\d+)',
        component: () => import('@/views/Stationary/paymentstationarycontract/Entry.vue'),
        name: 'SpEntry',
        meta: {
          title: '收款信息', activeMenu: '/Stationary/stationaryContract/ContractQuery',
          // noCache: true
        }
      }
    ]
  },

  {
    path: '/Stationary/stationaryContract/ContractQuery-history',
    component: Layout,
    hidden: true,
    permissions: ['affairs:contract:list'],
    children: [
      {
        path: 'index/:renewalId(\\d+)',
        component: () => import('@/views/Stationary/stationaryContract/history.vue'),
        name: 'Cq_history',
        meta: {
          title: '续签历史',
          noCache: true,
          activeMenu: '/Stationary/stationaryContract/ContractQuery',
        }
      }
    ]
  },
  {
    path: '/Stationary/stationaryContract/cost_profit-point',
    component: Layout,
    hidden: true,
    permissions: ['affairs:costProfit:list'],
    children: [
      {
        path: 'index/:contractId(\\d+)',
        component: () => import('@/views/Stationary/stationaryContract/cost_profit/point'),
        name: 'Cost_profit-point',
        meta: { title: '驻点成本利润', activeMenu: '/Stationary/stationaryContract/cost_profit' }
      }
    ]
  },
]