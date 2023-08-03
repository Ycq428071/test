import Layout from '@/layout'

export default [
  {
    path: '/wage_manage/guard_wage/wg_enter-add',
    component: Layout,
    hidden: true,
    permissions: ['salary:employee:list'],
    children: [
      {
        path: 'index/:securityId(\\d+)/:id(\\d+)',
        component: () => import('@/views/wage_manage/guard_wage/enter/add'),
        name: 'Wg_enter-add',
        meta: { title: '编辑保安工资信息', activeMenu: '/wage_manage/guard_wage/wg_enter' }
      },
    ]
  },
  {
    path: '/wage_manage/quit_wage/qw_enter-add',
    component: Layout,
    hidden: true,
    permissions: ['affairs:staff:list'],
    children: [
      {
        path: 'index/:securityId(\\d+)/:id(\\d+)',
        component: () => import('@/views/wage_manage/quit_wage/enter/add'),
        name: 'Qw_enter-add',
        meta: { title: '编辑离职工资信息', activeMenu: '/wage_manage/quit_wage/wq_enter' }
      },
    ]
  },
]