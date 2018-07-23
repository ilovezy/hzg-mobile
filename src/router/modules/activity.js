//活动路由
let Activity = [
  {
    path: '/activity/newbiesem',
    name: 'newbiesem',
    meta:{
      title: '666元新手大礼包'
    },
    component: resolve => require(['@/views/activity/common/newbiesem'], resolve)
  },
  {
    path: '/activity/martial_club',
    name: 'martial_club',
    meta:{
      title: '开武馆'
    },
    component: resolve => require(['@/views/activity/common/martial_club'], resolve)
  },
  {
    path: '/activity/depository_about',
    name: 'depository_about',
    meta:{
      title: '银行存管简介'
    },
    component: resolve => require(['@/views/activity/common/depository_about'], resolve)
  },
  {
    path: '/activity/depository_guide',
    name: 'depository_guide',
    meta:{
      title: '银行存管操作指南'
    },
    component: resolve => require(['@/views/activity/common/depository_guide'], resolve)
  },
  {
    path: '/activity/carnival',
    name: 'carnival',
    meta:{
      title: '长富狂欢节'
    },
    component: resolve => require(['@/views/activity/common/carnival'], resolve),
  },
  {
    path: '/activity/carnival_recharge',
    name: 'carnival_recharge',
    meta:{
      title: '欢乐充值吧'
    },
    component: resolve => require(['@/views/activity/common/carnival/recharge'], resolve)
  },{
    path: '/activity/carnival_hot',
    name: 'carnival_hot',
    meta:{
      title: '火热加息场'
    },
    component: resolve => require(['@/views/activity/common/carnival/hot'], resolve)
  },{
    path: '/activity/carnival_lottery',
    name: 'carnival_lottery',
    meta:{
      title: '幸运大赚盘'
    },
    component: resolve => require(['@/views/activity/common/carnival/lottery'], resolve)
  },{
    path: '/activity/carnival_top',
    name: 'carnival_top',
    meta:{
      title: '巅峰排行榜'
    },
    component: resolve => require(['@/views/activity/common/carnival/top'], resolve)
  },
]
export default Activity
