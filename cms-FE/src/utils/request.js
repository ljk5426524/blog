/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { getStorage, setStorage } from '@/utils/cookie'

let baseURL = env.api // 环境变量api
if (env.showApiSelect) { // 根据api参数动态更改api 用于对接多个后台开发人员 并自测
  baseURL = getStorage('apiUrl') || baseURL
}
console.info('ApiUrl', baseURL)

const service = axios.create({
  baseURL, // url = base url + request url
  withCredentials: true, // cookie 可跨域配置，需要服务端支持
  timeout: 10000, // 请求超时时间
})

service.baseURL = baseURL

// 请求拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }

    const method = config.method.toLocaleLowerCase()

    config.data = config.data || {}

    config.headers['auth'] = getStorage('auth') // 全局接口添加auth参数

    if (config.data.custom) {
      config.custom = config.data.custom

      delete config.data.custom
    }

    // 自定义 loading、加载文字、传参数据类型与方式 及 状态码等
    const {
      showLoading = true,
      loadingText = '加载中...',
      contentType,
      inParam,
      apiType,
    } = config.custom || {}

    // get: params => query
    // post: data => body
    if (method === 'get') {
      if (inParam) {
        config.params = {
          inParam: config.data,
        }
      } else {
        config.params = config.data
      }

      delete config.data
    } else if (method === 'post') {
      // form data
      if (!contentType) {
        // json格式传参 格式如：{"name":"Jack","age":18}
        config.headers['Content-Type'] = 'application/json'

        // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        // 序列化格式传参 格式如：name=Jack&age=18
        // config.data = qs.stringify(config.data)
      } else if (contentType === 'multipart/form-data') {
        config.headers['Content-Type'] = 'multipart/form-data'

        config.data = config.data.file
      } else {
        config.headers['Content-Type'] = contentType
      }

      if (inParam) {
        config.data = qs.stringify({
          inParam: JSON.stringify(config.data),
        })
      }
    }

    return config
  },
  error => {
    // 网络请求时，出现错误的情况
    // https://github.com/axios/axios/issues/2509
    // https://github.com/axios/axios/issues/1556

    console.log('request error ', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const responseData =
      typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data

    const { code: code, msg: message } = responseData

    // 默认的 成功、登录失效 状态码
    const successCode = 0
    const loginExpiredCode = 99

    // 是否指定了返回的状态码，若指定，则将数据透传给业务函数
    // 若未指定，则判断默认状态码 200
    const { successCode: customCode } = response.config.custom || {}

    // 下载流文件（blob）
    if (response.request.responseType === 'blob') return response

    if (customCode && typeof customCode === 'boolean') return responseData

    if (
      Number(code) !== successCode ||
      (customCode && Number(code) !== customCode)
    ) {
      Message({
        message: message || 'Error',
        type: 'error',
        duration: 3 * 1000,
        onClose() {
          // 拦截登录信息失效
          if (Number(code) === loginExpiredCode) {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }
        },
      })
      return Promise.reject(new Error(message || 'Error'))
    } else {
      return response.data
    }
  },
  error => {
    // 网络请求后，Status Code 不为 2XX 的情况

    console.log('response error', error)
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
