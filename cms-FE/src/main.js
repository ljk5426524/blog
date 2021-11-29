/* eslint-disable no-undef */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as api from './api/api'
import * as cookie from '@/utils/cookie'

import '@/icons' // icon
import '@/permission' // permission control
import * as filters from './filters' // 全局过滤器

/**
 * 本地环境，可预先使用 mock 服务进行调试
 */
const currentApi = cookie.getStorage('apiUrl') || env.api
import { mockXHR } from '../mock'
if (env.name === 'local' && ['http://', 'https://'].findIndex(item => currentApi.includes(item)) === -1) {
  mockXHR()
}

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$cookie = cookie

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
