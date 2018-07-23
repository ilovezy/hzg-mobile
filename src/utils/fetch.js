/**
 * Created by ymjdev on 2017/9/20.
 */
import axios from "axios";
import {Toast, Loading, Alert} from '../components/dialog';

//全局API
let baseAPI = null
if (process.env.NODE_ENV === 'localhost') {
  //本地开发构建环境 npm run buildlocal
  baseAPI = '//10.17.13.231:10010/'
} else if (process.env.NODE_ENV === 'uat') {
  //uat构建环境 npm run builduat
  baseAPI = '//10.17.13.231:8088/'
} else if (process.env.NODE_ENV === 'test') {
  //测试构建环境 npm run buildtest
  baseAPI = '//10.17.13.231:10010/'
} else if (process.env.NODE_ENV === 'production') {
  //上线构建环境  npm run buildproduction
  baseAPI = '//api.changfulicai.com/'
} else {
  //热更新开发构建环境 npm run dev
  // baseAPI = '//111.231.119.210:8088/'
  baseAPI = '//10.17.13.231:10010/'
  // baseAPI = '//115.236.28.74:9002'
}

const service = axios.create({
  baseURL: baseAPI,
  timeout: 50000,
});

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

// http request 拦截器
service.interceptors.request.use(
  config => {
    let appToken = urlParse()
    config.headers['x-changfu-app'] = `wap`;
    // console.log(appToken.access_token)
    if (appToken.access_token !== null && appToken.access_token !== '' && appToken.access_token !== undefined) {
      // 判断appToken是否存在，如果存在的话，则每个http header都加上appToken
      config.headers.Authorization = 'Bearer ' + appToken.access_token;
    } else if (localStorage.getItem('token')) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http respone 拦截器
service.interceptors.response.use(
  response => {
    Loading.close();
    return response.data
    // if(response.data.success){
    //   return response.data
    // } else if(response.data.error === 'MEMBER_TOKEN_INVALID_ERROR'){
    //   Alert({
    //     mes: response.data.errorDescription,
    //     callback: () => {
    //       localStorage.clear()
    //       location.href = '/login'
    //     }
    //   });
    //   return response.data
    // } else {
    //   Toast({mes: response.data.errorDescription, icon: 'error'})
    // }
  },

  error => {
    Loading.close();
    // console.log(error)// for debug
    Toast({mes: '系统繁忙，请稍后再试', timeout: 5000, icon: 'error'})
    return Promise.reject(error)
  }
)

export default service
