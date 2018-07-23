let accountRoute = [{
  path: '/account',
  name: 'account',//账户首页
  meta: {
    title: '我的'
  },
  component: resolve => require(['@/views/account'], resolve)
},
  {
    path: '/account/certification',
    name: 'certification',//实名认证
    meta: {
      title: '存管账户',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/certification'], resolve)
  },
  {
    path: '/account/my_fund',
    name: 'my_fund',//我的资产
    meta: {
      title: '总资产',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/my_fund'], resolve)
  },
  {
    path: '/account/my_profit',
    name: 'my_profit',//我的收益
    meta: {
      title: '我的收益',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/my_profit'], resolve)
  },
  {
    path: '/account/recharge',
    name: 'recharge',//快捷充值
    meta: {
      title: '快捷充值',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/recharge'], resolve)
  },
  {
    path: '/account/bank_transfer_recharge',
    name: 'bank_transfer_recharge',//快捷充值
    meta: {
      title: '银行转账',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/recharge/bank_transfer'], resolve)
  },
  // {
  //   path: '/account/alipay_recharge',
  //   name: 'alipay_recharge',//支付宝充值
  //   meta: {
  //     title:'支付宝充值',
  //     requireAuth: true
  //   },
  //   component: resolve => require(['@/views/account/recharge/alipay'], resolve)
  // },
  // {
  //   path: '/account/offline_recharge',
  //   name: 'offline_recharge',//线下充值
  //   meta: {
  //     title:'线下充值',
  //     requireAuth: true
  //   },
  //   component: resolve => require(['@/views/account/recharge/offline'], resolve)
  // },
  {
    path: '/account/cash',
    name: 'cash',//实时提现
    meta: {
      title: '提现',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/cash'], resolve)
  },
  // {
  //   path: '/account/large_cash',
  //   name: 'large_cash',//大额提现
  //   meta: {
  //     title:'大额提现',
  //     requireAuth: true
  //   },
  //   component: resolve => require(['@/views/account/cash/large'], resolve)
  // },
  {
    path: '/account/wait_establish_invests',
    name: 'wait_establish_invests',//我的投资投资中
    meta: {
      title: '我的投资',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/invest_record/wait_establish_invests'], resolve)
  },
  {
    path: '/account/hold_invests',
    name: 'hold_invests',//我的投资持有中
    meta: {
      title: '我的投资',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/invest_record/hold_invests'], resolve)
  },
  {
    path: '/account/repay_invests',
    name: 'repay_invests',//我的投资已还款
    meta: {
      title: '我的投资',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/invest_record/repay_invests'], resolve)
  },
  {
    path: '/account/other_invests',
    name: 'other_invests',//我的投资其他
    meta: {
      title: '我的投资',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/invest_record/other_invests'], resolve)
  },
  {
    path: '/account/transaction_interests',
    name: 'transaction_interests',//我的投资收益表
    meta: {
      title: '收益表',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/invest_record/transaction_interests'], resolve)
  },
  {
    path: '/account/fund_record',
    name: 'fund_record',//资金记录
    meta: {
      title: '资金记录',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/fund_record/fund'], resolve)
  },
  {
    path: '/account/recharge_record',
    name: 'recharge_record',//充值记录
    meta: {
      title: '充值记录',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/fund_record/recharge'], resolve)
  },
  {
    path: '/account/cash_record',
    name: 'cash_record',//提现记录
    meta: {
      title: '提现记录',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/fund_record/cash'], resolve)
  },
  {
    path: '/account/cash_reward',
    name: 'cash_reward',//红包
    meta: {
      title: '红包',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/reward/cash'], resolve)
  },
  {
    path: '/account/profit_reward',
    name: 'profit_reward',//加息券
    meta: {
      title: '加息券',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/reward/profit'], resolve)
  },
  {
    path: '/account/depository',
    name: 'depository',//存管账户
    meta: {
      title: '存管账户',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/depository'], resolve)
  },
  // {
  //   path: '/account/bankcard',
  //   name: 'bankcard',//银行卡
  //   meta: {
  //     title:'银行卡',
  //     requireAuth: true
  //   },
  //   component: resolve => require(['@/views/account/bankcard'], resolve)
  // },
  // {
  //   path: '/account/bankcard/bind_card',
  //   name: 'bind_card',//银行卡-绑定中
  //   meta: {
  //     title:'绑定银行卡',
  //     requireAuth: true
  //   },
  //   component: resolve => require(['@/views/account/bankcard/bind_card'], resolve)
  // },
  {
    path: '/account/settings',
    name: 'settings',//账号设置
    meta: {
      title: '账号设置',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/settings'], resolve)
  },
  {
    path: '/account/change_password',
    name: 'change_password',//登录密码管理
    meta: {
      title: '修改登录密码',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/settings/change_password'], resolve)
  },
  {
    path: '/account/pay_password_manage',
    name: 'pay_password_manage',//登录密码管理
    meta: {
      title: '存管密码管理',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/settings/pay_password_manage'], resolve)
  },
  {
    path: '/account/personal_data',
    name: 'personal_data',//个人资料
    meta: {
      title: '个人资料',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/settings/personal_data'], resolve)
  },
  {
    path: '/account/edit_username',
    name: 'edit_username',//设置昵称
    meta: {
      title: '设置昵称',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/settings/edit_username'], resolve)
  },
  {
    path: '/account/friends/list',
    name: 'friends_list',//好友列表
    meta: {
      title: '好友列表',
      requireAuth: true
    },
    component: resolve => require(['@/views/account/friends/list'], resolve)
  },
  {
    path: '/account/questionnaire',
    name: 'questionnaire',//风险评测
    meta: {
      title: '投资风险评测'
    },
    component: resolve => require(['@/views/article/questionnaire'], resolve)
  },
]
export default accountRoute
