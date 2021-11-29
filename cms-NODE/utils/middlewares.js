// token验证中间件
function tokenVerification(req, res, next) {
  const authToken = req.headers['auth']
  if (authToken) {
    let userInfo = $jwt.verify(authToken)
    if (userInfo) { // 认证成功
      req.userInfo = userInfo // 记录当前用户信息
      next()
      return
    }
  }
  res.$fail(99, '请先登录')
}

// 错误处理中间件
function errorMiddleware(err, req, res, next) {
  console.error('错误', err);
  res.status(500).json(
    $common.resJson(
      err.infoCode || 500,
      err.message || '系统错误，请联系管理员',
      err
    )
  );
}

// 404处理中间件
function notFoundMiddleware(req, res) {
  res.status(404).json({
    code: 404,
    msg: "Not Found",
    data: {}
  })
}

// 跨域处理中间件
function corsMiddleware(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers['origin'] || req.headers['host'] || '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type,auth');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
}

// 自定义方法中间件
function customMethodsMiddleware(req, res, next) {
  // 设置指定json格式返回数据
  res.$json = function (...args) {
    res.json($common.resJson(args[0], args[1], args[2], args[3] || $common.getBodyData(req), args[4]))
  }

  // 自定义成功处理方法 
  res.$success = function (args) {
    res.$json(0, 'ok', args)
  }

  // 自定义失败处理方法
  res.$fail = function (code, info, args) {
    res.$json(code, info, args)
  }
  next()
}

// 路由中间件
function routerMiddleware(req, res, next) {
  const time = new Date();
  console.log(`路由中间件-[${time.toLocaleString()}] ${req.method} ${req.url}`);
  next();
}

// 全局中间件
function appMiddleware(req, res, next) {
  const time = new Date();
  console.log(`全局中间件-[${time.toLocaleString()}] ${req.method} ${req.url}`);
  next();
}

module.exports = {
  tokenVerification,
  notFoundMiddleware,
  errorMiddleware,
  corsMiddleware,
  customMethodsMiddleware,
  routerMiddleware,
  appMiddleware,
}
