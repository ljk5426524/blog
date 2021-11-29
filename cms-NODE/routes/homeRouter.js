const express = require('express')
const router = express.Router()
const { routerMiddleware } = require('../utils/middlewares')
const homeModule = require('../module/homeModule')

// 路由中间件
router.get("/", homeModule.index) // 首页
router.get("/name",routerMiddleware, homeModule.name) // 测试
router.get("/error", homeModule.error) // 测试

module.exports = router;