import { login, logout, getInfo } from '@/api/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getCookieJSON, setCookie, removeCookie, getStorageJSON, setStorageJSON, removeStorage, setStorage } from '@/utils/cookie'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  userinfo: {},
  roles: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: userName.trim(), password: password })
        .then(response => {
          const { data } = response
          setStorageJSON('userInfo', data)
          setCookie('username', data.username)
          setStorage('auth', data.token)
          setCookie(
            'avatar',
            'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          )
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  getRoles({ commit, state }) {
    return new Promise((resolve, reject) => {
      const { roleId } = getStorageJSON('userInfo')
      const roles = []

      // 1 管理员 2 超级管理员
      if (roleId === 1) {
        roles.push('admin')
      } else if (roleId === 2) {
        roles.push('super-admin')
      }

      roles.push('super-admin')

      commit('SET_ROLES', roles)
      resolve({ roles })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { name, avatar } = data

          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeStorage('userInfo')
      removeCookie('userName')
      removeCookie('avatar')
      resetRouter()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
