const users = {
  'admin1-admin': {
    roles: ['admin'],
    roleId: 1,
    roleDesc: '管理员',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    userName: 'admin1',
    phone: '131xxxxxxxx',
  },
  'admin2-super-admin': {
    roles: ['super-admin'],
    roleId: 2,
    roleDesc: '超级管理员',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    userName: 'admin2',
    phone: '132xxxxxxxx',
  },
}

export default [
  // get publickey
  {
    url: '/user/getPublicKey',
    type: 'get',
    response: config => {
      const {
        query: { userName },
      } = config

      if (userName !== 'admin1' && userName !== 'admin2') {
        return {
          code: 400,
          message: '用户名或密码错误',
        }
      }

      return {
        code: 200,
        message: '成功',
        data: {
          token: userName === 'admin1' ? 'admin' : 'super-admin',
        },
      }
    },
  },

  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const {
        body: { userName, password },
      } = config

      if (
        (userName === 'admin1' && password !== 'admin1-admin') ||
        (userName === 'admin2' && password !== 'admin2-super-admin')
      ) {
        return {
          code: 400,
          message: '用户名或密码错误',
        }
      }

      return {
        code: 200,
        message: '成功',
        data: users[password],
      }
    },
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        message: '成功',
      }
    },
  },

  // changePassword
  {
    url: '/user/changePassword',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        message: '成功',
      }
    },
  },
]
