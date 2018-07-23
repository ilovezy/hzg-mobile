let landingRoute = [
  {
    path: '/landing/register',
    name: 'landing_register',//着陆页
    meta: {
      title: '注册即送666元大礼包'
    },
    component: resolve => require(['@/views/landing/landing1'], resolve)
  },
  {
    path: '/landing/register_rebate_first',
    name: 'register_rebate_first',//着陆页
    meta: {
      title: '长富理财-首投返利'
    },
    component: resolve => require(['@/views/landing/landing2'], resolve)
  },
  {
    path: '/landing/register_rebate_repeat',
    name: 'register_rebate_repeat',//着陆页
    meta: {
      title: '长富理财-复投返利'
    },
    component: resolve => require(['@/views/landing/landing3'], resolve)
  },
]
export default landingRoute
