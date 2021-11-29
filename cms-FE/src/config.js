const baseUrlList = {
  // 服务器环境
  local: 'http://127.0.0.1:5000/note',
  dev: 'http://dev.xxx.com/interface-manager', // 开发
  test: 'http://test.xxx.com/interface-manager', // 测试
  production: 'http://production.xxx.com/interface-manager', // 生产
}

module.exports = {
  port: '9528',

  projectName: '后台管理',

  // h5 or cms web
  projectPlatform: 'cms',

  baseUrlList,

  env: {
    local: {
      name: 'local',
      api: baseUrlList['local'],
      publicPath: '/cms',
      routerPath: '/cms',
      showApiSelect: false, // 是否展示api选择浮窗
      compileTime: new Date().getTime(), // 编译时间
    },
    development: {
      name: 'development',
      api: baseUrlList['dev'],
      publicPath: '/cms',
      routerPath: '/cms',
      showApiSelect: true, // 是否展示api选择浮窗
      compileTime: new Date().getTime(), // 编译时间
    },
    test: {
      name: 'test',
      api: baseUrlList['test'],
      publicPath: '/cms',
      routerPath: '/cms',
      showApiSelect: false, // 是否展示api选择浮窗
      compileTime: new Date().getTime(), // 编译时间
    },
    production: {
      name: 'production',
      api: baseUrlList['production'],
      publicPath: '/cms',
      routerPath: '/cms',
      showApiSelect: false, // 是否展示api选择浮窗
      compileTime: new Date().getTime(), // 编译时间
    },
  },
}
