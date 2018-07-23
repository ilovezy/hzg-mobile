let protocolRoute = [
  {
    path: '/protocol/register',
    name: 'protocol_register',//注册协议
    meta: {
      title: '长富理财注册协议'
    },
    component: resolve => require(['@/views/protocol/register'], resolve)
  },
  {
    path: '/protocol/borrowing_agreements',
    name: 'protocol_borrowing_agreements',//长富理财网借款协议
    meta: {
      title: '借款协议',
      requireAuth: true
    },
    component: resolve => require(['@/views/protocol/borrowing_agreements'], resolve)
  },
  // {
  //   path: '/protocol/bank_depository',
  //   name: 'protocol_bank_depository',//江西银行网络交易资金账户服务第三方协议
  //   meta:{
  //     title: '江西银行网络交易资金账户服务第三方协议'
  //   },
  //   component: resolve => require(['@/views/protocol/bank_depository'], resolve)
  // },
  // {
  //   path: '/protocol/user_authorization',
  //   name: 'protocol_user_authorization',//用户授权协议
  //   meta:{
  //     title: '用户授权协议'
  //   },
  //   component: resolve => require(['@/views/protocol/user_authorization'], resolve)
  // },
  // {
  //   path: '/protocol/transfer_agreement',
  //   name: 'protocol_transfer_agreement',//保理债权资产转让协议
  //   meta: {
  //     title: '保理债权资产转让协议',
  //     requireAuth: true
  //   },
  //   component: resolve => require(['@/views/protocol/transfer_agreement'], resolve)
  // },
]
export default protocolRoute
