// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import * as filters from './filters'
import UI from './components/ui'
import './assets/stylus/base.styl'
import common from './utils/common'
import axios from './utils/fetch'

Vue.use(UI)
Vue.use(common)
Vue.prototype.axios = axios

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// this.$dialog.toast({mes: '系统繁忙，请稍后再试', timeout: 10000, icon: 'error'})

Vue.config.productionTip = false
Vue.config.devtools = false

export function urlParse() {
  //从url获取到参数字符串
  let url = window.location.search;
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g;
  //match() 方法可以在字符串内检索指定的值 或找到一个或多个正则表达式的匹配。
  let arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substr(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let value = decodeURIComponent(tempArr[1])
      obj[key] = value
    })
  }
  return obj
}

//全局路由钩子
router.beforeEach((to, from, next) => {
  //动态修改标题
  if (to.meta.title !== undefined){
    document.title = to.meta.title
  } else {
    document.title = '长富理财'
  }
  //路由切换动画
  let routeLength = store.state.routeChain.length;
  if (routeLength === 0) {
    store.commit('setPageDirection', 'fade');
    if (to.path === from.path && to.path === '/') {
      //当直接打开根路由的时候
      store.commit('addRouteChain', to);
    } else {
      //直接打开非根路由的时候其实生成了两个路径，from其实就是根路由
      store.commit('addRouteChain', from);
      store.commit('addRouteChain', to);
    }
  } else if (routeLength === 1) {
    store.commit('setPageDirection', 'slide-left');
    store.commit('addRouteChain', to);
  } else {
    let lastBeforeRoute = store.state.routeChain[routeLength-2];
    if (lastBeforeRoute.path === to.path) {
      store.commit('popRouteChain');
      store.commit('setPageDirection', 'slide-right');
    } else {
      store.commit('addRouteChain', to);
      store.commit('setPageDirection', 'slide-left');
    }
  }
  //登录验证
  if (to.meta.requireAuth) {
    let appToken = this.urlParse()
    if(appToken.access_token !== undefined){
      localStorage.setItem('token',appToken.access_token)
    }
    // 判断该路由是否需要登录权限
    if (localStorage.getItem('token') !== null) {
      //判断token是否存在
      next()
    } else {
      localStorage.clear()
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

