/* eslint-disable no-unused-vars */
import request from '@/utils/request'
import { Message } from 'element-ui'

/**
 * custom: Custom request and response. It contains the following properties
 * showLoading: Is display loading indicator? default is `true`
 * loadingText: Loading indicator. text default is `加载中...`
 * contentType: Post request method dataType
 * inParam: params is need to be wrapped by `inParam`? default is `false`
 * successCode: custom the return successCode code(Boolean or Number). default is `200`
 */

/**
 * example
 */
export function getPost(data) {
  return request({
    url: '/posts',
    method: 'get',
    data,
  })
}

export function post(data) {
  return request({
    url: '/posts',
    method: 'post',
    data: {
      ...data,
      custom: {
        showLoading: false,
      },
    },
  })
}

export function getPostById(data) {
  return request({
    url: '/posts',
    method: 'get',
    data: {
      ...data,
      custom: {
        loadingText: 'loading...',
      },
    },
  })
}

export function getCommentListById(data) {
  return request({
    url: '/comments',
    method: 'get',
    data: {
      ...data,
      custom: {
        inParam: true,
        successCode: 204,
      },
    },
  })
}

// 图片上传(导入同理)
export const uploadPicUrl = request.baseURL + '/eb-banner/uploadPic.do'
export function uploadPic(file, data = {}) {
  // if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
  //   return new Promise(function(reslove, reject) {
  //     // reslove('成功')  //状态由等待变为成功，传的参数作为then函数中成功函数的实参
  //     Message.error('只支持JPG、PNG格式的图片')
  //     reject(new Error('只支持JPG、PNG格式的图片')) // 状态由等待变为失败，传的参数作为then函数中失败函数的实参
  //   })
  // }

  // if (file.size > 1024 * 300) {
  //   return this.$message.error('图片应小于300k')
  // }

  const formData = new FormData()
  formData.append('file', file)
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  }) // 加入额外参数
  return request({
    url: uploadPicUrl,
    method: 'post',
    data: {
      file: formData,
      ...data,
      custom: {
        contentType: 'multipart/form-data',
      },
    },
  })
}

/**
 * project
 */

// 登录前获取公钥
export function getPublicKey(data) {
  return request({
    url: '/user/getPublicKey',
    method: 'get',
    data,
  })
}

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

// 注册
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}

// 密码重置
export function changePassword(data) {
  return request({
    url: '/changePassword',
    method: 'put',
    data,
  })
}

// 获取记事本列表
export function getList(data) {
  return request({
    url: '/getList',
    method: 'get',
    data,
  })
}

// 新增记事
export function addNote(data) {
  return request({
    url: '/note',
    method: 'post',
    data,
  })
}

// 更新记事
export function updateNote(data) {
  return request({
    url: '/note',
    method: 'put',
    data,
  })
}

// 删除记事
export function delNote(data) {
  return request({
    url: '/note',
    method: 'delete',
    data,
  })
}

// 获取记事详情
export function getNoteDetail(data) {
  return request({
    url: '/note',
    method: 'get',
    data,
  })
}

// 获取记事详情
export function getFrontUserList(data) {
  return request({
    url: '/getFrontUserList',
    method: 'get',
    data,
  })
}
