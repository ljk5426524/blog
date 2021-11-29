const { HTTP, MYSQL } = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
require('express-async-errors') // 处理错误情况
const app = express()
const path = require('path')
const jwt = require('./utils/jwt') // json web token
// const wxSdk = require('./utils/wx-miniprogram-sdk') // 微信小程序
const mysql = require('./utils/mysql') // mysql
const common = require('./utils/common')
const { appMiddleware, errorMiddleware, notFoundMiddleware, corsMiddleware, customMethodsMiddleware } = require('./utils/middlewares')
mysql.init({ ...MYSQL }) // mysql数据库初始化连接

// global.$wxSdk = new wxSdk({ ...WXMINIPROGRAM })
global.$common = common
global.$jwt = jwt
global.$mysql = mysql

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public'))) // 静态文件托管 pm2环境下使用这段否则不生效

// 全局中间件测试
app.use(appMiddleware)

// 自定义方法中间件
app.use(customMethodsMiddleware)

// 全局中间件 跨域处理
app.use(corsMiddleware)

// 自定义路由
app.use(require('./routes/index'))

// 找不到路由时(404)的处理方式
app.use(notFoundMiddleware)

// 错误处理
app.use(errorMiddleware);

var server = app.listen(HTTP.port, function () {
    console.log("HttpServer http://" + server.address().address + ":" + server.address().port)
})