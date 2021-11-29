const express = require('express')
const app = express()
const fs = require('fs')

app.get('/', (req, res) => {
  res.json({ msg: 'success' })
})

// app.get('/api1', (request, response) => {
//   request.headers // 客户端请求协议头
//   request.query // 客户端请求 Url 中的查询参数
//   request.params // 客户端请求 Url 中的路径参数
//   request.body // 客户端请求体的数据，可能是表单或 JSON 数据
//   request.cookies //客户端的 cookies
//   // ...

//   response.send('HTML String') // 发送一串 HTML 代码
//   response.sendFile(fs.readFileSync('file.zip')) // 发送一个文件
//   response.json({ msg: 'Hello World' }) // 发送json
//   // ...

//   res.status(404).send('Page Not Found'); // 支持链式调用
// })

// const express = require('express')
// const app = express()
// app.METHOD(PATH, HANDLER)
// // app 就是一个 express 服务器对象
// // METHOD 可以是任何小写的 HTTP 请求方法，包括 get、post、put、delete 等等
// // PATH 是客户端访问的 URI，例如 / 或 /about
// // HANDLER 是路由被触发时的回调函数，在函数中可以执行相应的业务逻辑


function someMiddleware(req, res, next) {
  // 自定义逻辑
  next();
}

// 全局中间件
// 通过 app.use 函数就可以注册中间件，并且此中间件会在用户发起任何请求都可能会执行，例如：
app.use(someMiddleware);

// 复制代码路由中间件
// 通过在路由定义时注册中间件，此中间件只会在用户访问该路由对应的 URI 时执行，例如：
app.get('/middleware', someMiddleware, (req, res) => {
  res.send('Hello World');
});

// 自定义中间件
const app = express();
function loggingMiddleware(req, res, next) {
  const time = new Date();
  console.log(`[${time.toLocaleString()}] ${req.method} ${req.url}`);
  next();
}

app.use(loggingMiddleware);
app.get('/', (req, res) => {
  res.send('Hello World');
});


const server = app.listen(3001, function () {
  console.log(`HTTP启动成功 http://${server.address().address}:${server.address().port}`)
})