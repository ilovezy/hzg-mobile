import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',//首页
      meta:{
        title: '长富理财'
      },
      component: resolve => require(['../views/home.vue'], resolve)
    },
    {
      path: '/activity',
      name: 'activity',//活动
      meta:{
        title: '活动中心'
      },
      component: resolve => require(['../views/activity'], resolve)
    },
    //全局活动路由
    {
      path: '/activity/newbiesem',
      name: 'newbiesem',
      meta:{
        title: '666元新手大礼包'
      },
      component: resolve => require(['../views/activity/common/newbiesem'], resolve)
    },
    {
      path: '/activity/martial_club',
      name: 'martial_club',
      meta:{
        title: '开武馆'
      },
      component: resolve => require(['../views/activity/common/martial_club'], resolve)
    },
    {
        path: '/activity/depository_about',
      name: 'depository_about',
      meta:{
        title: '银行存管简介'
      },
      component: resolve => require(['../views/activity/common/depository_about'], resolve)
    },
    {
      path: '/activity/depository_guide',
      name: 'depository_guide',
      meta:{
        title: '银行存管操作指南'
      },
      component: resolve => require(['../views/activity/common/depository_guide'], resolve)
    },
    {
      path: '/activity/carnival',
      name: 'carnival',
      meta:{
        title: '长富狂欢节'
      },
      component: resolve => require(['../views/activity/common/carnival'], resolve),
    },
    {
      path: '/activity/carnival_recharge',
      name: 'carnival_recharge',
      meta:{
        title: '欢乐充值吧'
      },
      component: resolve => require(['../views/activity/common/carnival/recharge'], resolve)
    },{
      path: '/activity/carnival_hot',
      name: 'carnival_hot',
      meta:{
        title: '火热加息场'
      },
      component: resolve => require(['../views/activity/common/carnival/hot'], resolve)
    },{
      path: '/activity/carnival_lottery',
      name: 'carnival_lottery',
      meta:{
        title: '幸运大转盘'
      },
      component: resolve => require(['../views/activity/common/carnival/lottery'], resolve)
    },{
      path: '/activity/carnival_lottery_log',
      name: 'carnival_lottery_log',
      meta:{
        title: '中奖记录',
        requireAuth: true
      },
      component: resolve => require(['../views/activity/common/carnival/lottery_log'], resolve)
    },{
      path: '/activity/carnival_ranking',
      name: 'carnival_top',
      meta:{
        title: '巅峰排位赛'
      },
      component: resolve => require(['../views/activity/common/carnival/ranking'], resolve)
    },
    {
      path: '/login',
      name: 'login',//登录
      meta:{
        title: '登录'
      },
      component: resolve => require(['../views/login.vue'], resolve)
    },
    {
      path: '/register',
      name: 'register',//注册
      meta:{
        title: '注册'
      },
      component: resolve => require(['../views/register'], resolve)
    },
    {
      path: '/landing/register',
      name: 'landing_register',//着陆页
      meta:{
        title: '注册即送666元大礼包'
      },
      component: resolve => require(['../views/landing/landing1'], resolve)
    },
    {
      path: '/landing/register_rebate_first',
      name: 'register_rebate_first',//着陆页
      meta:{
        title: '长富理财-首投返利'
      },
      component: resolve => require(['../views/landing/landing2'], resolve)
    },
    {
      path: '/landing/register_rebate_repeat',
      name: 'register_rebate_repeat',//着陆页
      meta:{
        title: '长富理财-复投返利'
      },
      component: resolve => require(['../views/landing/landing3'], resolve)
    },
    {
      path: '/protocol/register',
      name: 'protocol_register',//注册协议
      meta:{
        title: '长富理财注册协议'
      },
      component: resolve => require(['../views/protocol/register'], resolve)
    },
    {
      path: '/forget',
      name: 'forget',//找回密码
      meta:{
        title: '找回密码'
      },
      component: resolve => require(['../views/forget'], resolve)
    },
    // {
    //   path: '/protocol/bank_depository',
    //   name: 'protocol_bank_depository',//江西银行网络交易资金账户服务第三方协议
    //   meta:{
    //     title: '江西银行网络交易资金账户服务第三方协议'
    //   },
    //   component: resolve => require(['../views/protocol/bank_depository'], resolve)
    // },
    // {
    //   path: '/protocol/user_authorization',
    //   name: 'protocol_user_authorization',//用户授权协议
    //   meta:{
    //     title: '用户授权协议'
    //   },
    //   component: resolve => require(['../views/protocol/user_authorization'], resolve)
    // },
    // {
    //   path: '/protocol/transfer_agreement',
    //   name: 'protocol_transfer_agreement',//保理债权资产转让协议
    //   meta: {
    //     title: '保理债权资产转让协议',
    //     requireAuth: true
    //   },
    //   component: resolve => require(['../views/protocol/transfer_agreement'], resolve)
    // },
    {
      path: '/protocol/borrowing_agreements',
      name: 'protocol_borrowing_agreements',//长富理财网借款协议
      meta: {
        title: '借款协议',
        requireAuth: true
      },
      component: resolve => require(['../views/protocol/borrowing_agreements'], resolve)
    },
    {
      path: '/product',
      name: 'product',//理财
      meta:{
        title: '理财'
      },
      component: resolve => require(['../views/product'], resolve)
    },
    {
      path: '/product/collection_end',
      name: 'product_collection_end',//项目列表已成立
      meta:{
        title: '理财'
      },
      component: resolve => require(['../views/product/collection_end'], resolve)
    },
    {
      path: '/product/payed',
      name: 'product_payed',//项目列表已完结
      meta:{
        title: '理财'
      },
      component: resolve => require(['../views/product/payed'], resolve)
    },
    {
      path: '/product/:productId',
      name: 'product_detail',//项目详情
      meta:{
        title: '项目详情'
      },
      component: resolve => require(['../views/product/detail'], resolve)
    },
    {
      path: '/invest_success',
      name: 'invest_success',//项目详情
      meta:{
        title: '投资成功'
      },
      component: resolve => require(['../views/product/invest_success'], resolve)
    },
    // {
    //   path: '/integral',
    //   name: 'integral',//积分
    //   meta: {
    //     title: '积分'
    //   },
    //   component: resolve => require(['../views/integral'], resolve)
    // },
    {
      path: '/account',
      name: 'account',//账户首页
      meta: {
        title: '我的'
      },
      component: resolve => require(['../views/account'], resolve)
    },
    {
      path: '/account/certification',
      name: 'certification',//实名认证
      meta: {
        title: '存管账户',
        requireAuth: true
      },
      component: resolve => require(['../views/account/certification'], resolve)
    },
    {
      path: '/account/my_fund',
      name: 'my_fund',//我的资产
      meta: {
        title:'总资产',
        requireAuth: true
      },
      component: resolve => require(['../views/account/my_fund'], resolve)
    },
    {
      path: '/account/my_profit',
      name: 'my_profit',//我的收益
      meta: {
        title:'我的收益',
        requireAuth: true
      },
      component: resolve => require(['../views/account/my_profit'], resolve)
    },
    {
      path: '/account/recharge',
      name: 'recharge',//快捷充值
      meta: {
        title:'快捷充值',
        requireAuth: true
      },
      component: resolve => require(['../views/account/recharge'], resolve)
    },
    {
      path: '/account/bank_transfer_recharge',
      name: 'bank_transfer_recharge',//快捷充值
      meta: {
        title:'银行转账',
        requireAuth: true
      },
      component: resolve => require(['../views/account/recharge/bank_transfer'], resolve)
    },
    // {
    //   path: '/account/alipay_recharge',
    //   name: 'alipay_recharge',//支付宝充值
    //   meta: {
    //     title:'支付宝充值',
    //     requireAuth: true
    //   },
    //   component: resolve => require(['../views/account/recharge/alipay'], resolve)
    // },
    // {
    //   path: '/account/offline_recharge',
    //   name: 'offline_recharge',//线下充值
    //   meta: {
    //     title:'线下充值',
    //     requireAuth: true
    //   },
    //   component: resolve => require(['../views/account/recharge/offline'], resolve)
    // },
    {
      path: '/account/cash',
      name: 'cash',//实时提现
      meta: {
        title:'提现',
        requireAuth: true
      },
      component: resolve => require(['../views/account/cash'], resolve)
    },
    // {
    //   path: '/account/large_cash',
    //   name: 'large_cash',//大额提现
    //   meta: {
    //     title:'大额提现',
    //     requireAuth: true
    //   },
    //   component: resolve => require(['../views/account/cash/large'], resolve)
    // },
    {
      path: '/account/wait_establish_invests',
      name: 'wait_establish_invests',//我的投资投资中
      meta: {
        title:'我的投资',
        requireAuth: true
      },
      component: resolve => require(['../views/account/invest_record/wait_establish_invests'], resolve)
    },
    {
      path: '/account/hold_invests',
      name: 'hold_invests',//我的投资持有中
      meta: {
        title:'我的投资',
        requireAuth: true
      },
      component: resolve => require(['../views/account/invest_record/hold_invests'], resolve)
    },
    {
      path: '/account/repay_invests',
      name: 'repay_invests',//我的投资已还款
      meta: {
        title:'我的投资',
        requireAuth: true
      },
      component: resolve => require(['../views/account/invest_record/repay_invests'], resolve)
    },
    {
      path: '/account/other_invests',
      name: 'other_invests',//我的投资其他
      meta: {
        title:'我的投资',
        requireAuth: true
      },
      component: resolve => require(['../views/account/invest_record/other_invests'], resolve)
    },
    {
      path: '/account/transaction_interests',
      name: 'transaction_interests',//我的投资收益表
      meta: {
        title:'收益表',
        requireAuth: true
      },
      component: resolve => require(['../views/account/invest_record/transaction_interests'], resolve)
    },
    {
      path: '/account/fund_record',
      name: 'fund_record',//资金记录
      meta: {
        title:'资金记录',
        requireAuth: true
      },
      component: resolve => require(['../views/account/fund_record/fund'], resolve)
    },
    {
      path: '/account/recharge_record',
      name: 'recharge_record',//充值记录
      meta: {
        title:'充值记录',
        requireAuth: true
      },
      component: resolve => require(['../views/account/fund_record/recharge'], resolve)
    },
    {
      path: '/account/cash_record',
      name: 'cash_record',//提现记录
      meta: {
        title:'提现记录',
        requireAuth: true
      },
      component: resolve => require(['../views/account/fund_record/cash'], resolve)
    },
    {
      path: '/account/cash_reward',
      name: 'cash_reward',//红包
      meta: {
        title:'红包',
        requireAuth: true
      },
      component: resolve => require(['../views/account/reward/cash'], resolve)
    },
    {
      path: '/account/profit_reward',
      name: 'profit_reward',//加息券
      meta: {
        title:'加息券',
        requireAuth: true
      },
      component: resolve => require(['../views/account/reward/profit'], resolve)
    },
    {
      path: '/account/depository',
      name: 'depository',//存管账户
      meta: {
        title:'存管账户',
        requireAuth: true
      },
      component: resolve => require(['../views/account/depository'], resolve)
    },
    // {
    //   path: '/account/bankcard',
    //   name: 'bankcard',//银行卡
    //   meta: {
    //     title:'银行卡',
    //     requireAuth: true
    //   },
    //   component: resolve => require(['../views/account/bankcard'], resolve)
    // },
    // {
    //   path: '/account/bankcard/bind_card',
    //   name: 'bind_card',//银行卡-绑定中
    //   meta: {
    //     title:'绑定银行卡',
    //     requireAuth: true
    //   },
    //   component: resolve => require(['../views/account/bankcard/bind_card'], resolve)
    // },
    {
      path: '/account/settings',
      name: 'settings',//账号设置
      meta: {
        title:'账号设置',
        requireAuth: true
      },
      component: resolve => require(['../views/account/settings'], resolve)
    },
    {
      path: '/account/change_password',
      name: 'change_password',//登录密码管理
      meta: {
        title:'修改登录密码',
        requireAuth: true
      },
      component: resolve => require(['../views/account/settings/change_password'], resolve)
    },
    {
      path: '/account/pay_password_manage',
      name: 'pay_password_manage',//登录密码管理
      meta: {
        title:'存管密码管理',
        requireAuth: true
      },
      component: resolve => require(['../views/account/settings/pay_password_manage'], resolve)
    },
    {
      path: '/account/personal_data',
      name: 'personal_data',//个人资料
      meta: {
        title:'个人资料',
        requireAuth: true
      },
      component: resolve => require(['../views/account/settings/personal_data'], resolve)
    },
    {
      path: '/account/edit_username',
      name: 'edit_username',//设置昵称
      meta: {
        title:'设置昵称',
        requireAuth: true
      },
      component: resolve => require(['../views/account/settings/edit_username'], resolve)
    },
    {
      path: '/account/friends/list',
      name: 'friends_list',//好友列表
      meta: {
        title:'好友列表',
        requireAuth: true
      },
      component: resolve => require(['../views/account/friends/list'], resolve)
    },
    {
      path: '/article/more',
      name: 'more',//更多
      meta: {
        title:'更多'
      },
      component: resolve => require(['../views/article/more'], resolve)
    },
    {
      path: '/account/questionnaire',
      name: 'questionnaire',//风险评测
      meta: {
        title:'投资风险评测'
      },
      component: resolve => require(['../views/article/questionnaire'], resolve)
    },
    {
      path: '/article/about',
      name: 'about',//关于我们
      meta: {
        title: '关于长富理财'
      },
      component: resolve => require(['../views/article/about'], resolve)
    },
    {
      path: '/article/notice',
      name: 'notice',//网站公告
      meta: {
        title: '平台公告'
      },
      component: resolve => require(['../views/article/notice/list'], resolve)
    },
    {
      path: '/article/notice/:noticeId',
      name: 'notice_detail',//公告详情
      meta: {
        title: '平台公告详情'
      },
      component: resolve => require(['../views/article/notice/detail'], resolve)
    },
    {
      path: '/article/message',
      name: 'message',//我的消息
      meta: {
        title:'我的消息',
        requireAuth: true
      },
      component: resolve => require(['../views/article/message/list'], resolve)
    },
    {
      path: '/article/help',
      name: 'help',//帮助中心
      meta: {
        title: '帮助中心'
      },
      component: resolve => require(['../views/article/help'], resolve)
    },
    {
      path: '/article/help_detail',
      name: 'help_detail',//帮助中心详情
      meta: {
        title: '帮助详情'
      },
      component: resolve => require(['../views/article/help/detail'], resolve)
    },
    {
      path: '*',
      name: '404',//404错误
      meta: {
        title: '404错误'
      },
      component: resolve => require(['../views/error.vue'], resolve)
    }
  ]
})
