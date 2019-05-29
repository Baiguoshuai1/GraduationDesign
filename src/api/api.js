import axios from 'axios';
import qs from 'qs'
import router from '../router/index'
import store from '../store/store.js'
import {Message} from 'element-ui'
//公共url
let baseUrl = 'http://47.103.9.9:18023'
const http = axios.create({
  baseURL: baseUrl,
  withCredentials: true
  // transformRequest: [function (data) {
  //   let newData = '';
  //   for (let k in data) {
  //     if (data.hasOwnProperty(k) === true) {
  //       newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
  //     }
  //   }
  //   return newData;
  // }]
});
//POST传参序列化(添加请求拦截器)
http.interceptors.request.use((config) => {
  //在发送请求之前做某件事

  if (config.method === 'post') {
    //修改数据
    config.headers = {...config.data.headers}
    config.responseType = config.data.responseType
    config.data = config.data.json
   // config.data = qs.stringify(config.data);

  }
  if (config.method === 'get') {

    if(config.params.query==undefined||config.params.query=={}){
      return config
    }
    config.headers = {...config.params.headers}
    config.responseType = config.params.responseType
    config.params=config.params.query

  }

  return config;

}, (error) => {
  console.log('错误的传参')
  return error
});

//返回状态判断(添加响应拦截器)
http.interceptors.response.use((res) => {
  //对响应数据做些事
  if (!res.data.status) {
    if(res.data.code==102){
      sessionStorage.removeItem('number')
      store.state.FirstData.Data.isLogin=false
      //store.mutations.save({isLogin:false})
      Message({message:'登录超时',duration:2000,type:'warning'})
      router.push({
        name:'regist',
        query: { redirect: location.hostname }
      })
    }
    return {data:{erro:true,message:res.data.message}}
  }
  return res.data;
}, (error) => {
  Message({message:'服务器异常',duration:2000,type:'error'})
  console.log('网络异常', error)
  return error
});

async function apiAxios(method, url, params) {
  let res = await http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
  })
  return res.data
}

export default {
  get: function (url, params={}) {
    if (url.includes('http')) {
      baseUrl = url
    }
    return apiAxios('GET', url, params)
  },
  post: function (url, params={}) {
    if (url.includes('http')) {
      baseUrl = url
    }
    return apiAxios('POST', url, params)
  },
  put: function (url, params={}) {
    if (url.includes('http')) {
      baseUrl = url
    }
    return apiAxios('PUT', url, params)
  },
  delete: function (url, params={}) {
    if (url.includes('http')) {
      baseUrl = url
    }
    return apiAxios('DELETE', url, params)
  },
  patch: function (url, params={}) {
    if (url.includes('http')) {
      baseUrl = url
    }
    return apiAxios('PATCH', url, params)
  }
}

