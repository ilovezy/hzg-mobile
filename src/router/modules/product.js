let demoRoute = [

  {
    path: '/product',
    name: 'product',//理财
    meta: {
      title: '理财'
    },
    component: resolve => require(['@/views/product'], resolve)
  },
  {
    path: '/product/collection_end',
    name: 'product_collection_end',//项目列表已成立
    meta: {
      title: '理财'
    },
    component: resolve => require(['@/views/product/collection_end'], resolve)
  },
  {
    path: '/product/payed',
    name: 'product_payed',//项目列表已完结
    meta: {
      title: '理财'
    },
    component: resolve => require(['@/views/product/payed'], resolve)
  },
  {
    path: '/product/:productId',
    name: 'product_detail',//项目详情
    meta: {
      title: '项目详情'
    },
    component: resolve => require(['@/views/product/detail'], resolve)
  },
  {
    path: '/product/invest_success',
    name: 'product_invest_success',//项目详情
    meta: {
      title: '投资成功'
    },
    component: resolve => require(['@/views/product/invest_success'], resolve)
  },
]
export default demoRoute
