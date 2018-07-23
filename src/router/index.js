import Vue from 'vue'
import Router from 'vue-router'
import accountRoute from './modules/account'
import articleRoute from './modules/article'
import activityRoute from './modules/activity'
import protocolRoute from './modules/protocol'
import landingRoute from './modules/landing'
import productRoute from './modules/product'
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
    ...productRoute,
    ...demoRoute
  ]
})
