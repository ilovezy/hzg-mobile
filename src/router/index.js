import Vue from 'vue'
import Router from 'vue-router'
import accountRoute from './modules/account'
import articleRoute from './modules/article'
import activityRoute from './modules/activity'
import protocolRoute from './modules/protocol'
import landingRoute from './modules/landing'
import demoRoute from './modules/demo'

Vue.use(Router)

let basicRoute = [
  {
    path: '/',
    name: 'home',//首页
    meta: {
      title: '长富理财'
    },
    component: resolve => require(['@/views/home.vue'], resolve)
  },
  {
    path: '/login',
    name: 'login',//登录
    meta: {
      title: '登录'
    },
    component: resolve => require(['@/views/login.vue'], resolve)
  },
  {
    path: '/register',
    name: 'register',//注册
    meta: {
      title: '注册'
    },
    component: resolve => require(['@/views/register'], resolve)
  },
  {
    path: '/forget',
    name: 'forget',//找回密码
    meta: {
      title: '找回密码'
    },
    component: resolve => require(['@/views/forget'], resolve)
  },

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
    path: '/invest_success',
    name: 'invest_success',//项目详情
    meta: {
      title: '投资成功'
    },
    component: resolve => require(['@/views/product/invest_success'], resolve)
  },
  // {
  //   path: '/integral',
  //   name: 'integral',//积分
  //   meta: {
  //     title: '积分'
  //   },
  //   component: resolve => require(['@/views/integral'], resolve)
  // },
  {
    path: '*',
    name: '404',//404错误
    meta: {
      title: '404错误'
    },
    component: resolve => require(['@/views/error.vue'], resolve)
  }
]

export default new Router({
  mode: 'history',
  routes: [
    ...basicRoute,
    ...accountRoute,
    ...articleRoute,
    ...activityRoute,
    ...protocolRoute,
    ...landingRoute,
    ...demoRoute
  ]
})
