let demoRoute = [{
    path: '/demo/demo',
    name: 'demo',//首页
    meta:{
      title: '测试用'
    },
    component: resolve => require(['@/views/demo/demo.vue'], resolve)
}]
export default demoRoute
