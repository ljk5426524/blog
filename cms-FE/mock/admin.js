import Mock from 'mockjs'

const data = Mock.mock({
  'items|10': [
    {
      id: '@id',
      userName: '@cname',
      'phone|1': ['13531544954', '13632250649', '15820292420', '15999905612'],
      'roleId|1': [1, 2],
      'useState|1': [1, 2],
      desc: '@cparagraph(2)',
    },
  ],
})

export default [
  {
    url: '/admin/list',
    type: 'get',
    response: config => {
      const {
        query: { keyword, roleId },
      } = config

      const items = data.items.filter(item => {
        if (keyword && roleId) {
          return (
            item.userName.includes(keyword) && item.roleId === Number(roleId)
          )
        } else {
          if (keyword) {
            return item.userName.includes(keyword)
          }

          if (roleId) {
            return item.roleId === Number(roleId)
          }
        }

        return true
      })

      return {
        code: 200,
        message: '成功',
        data: {
          total: items.length,
          list: items,
        },
      }
    },
  },

  {
    url: '/admin/add',
    type: 'get',
    response: config => {
      return {
        code: 200,
        message: '成功',
      }
    },
  },

  {
    url: '/admin/update',
    type: 'get',
    response: config => {
      return {
        code: 200,
        message: '成功',
      }
    },
  },

  {
    url: '/admin/delete',
    type: 'get',
    response: config => {
      return {
        code: 200,
        message: '成功',
      }
    },
  },
]
