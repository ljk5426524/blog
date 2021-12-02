const express = require("express")
const router = express.Router()
const noteModule = require("../module/noteModule")
const userModule = require("../module/userModule")
const frontModule = require("../module/frontModule")
const commentModule = require("../module/commentModule")
const { tokenVerification } = require("../utils/middlewares")

// 路由中间件
router.get("/", noteModule.index) // 测试
router.post("/login", noteModule.login) // 登录
router.post("/register", noteModule.register) // 注册

router.put("/changePassword", tokenVerification, noteModule.changePassword) // 修改密码
router.get("/getList", tokenVerification, noteModule.getList) // 获取列表
router.post("/note", tokenVerification, noteModule.addNote) // 增加内容
router.put("/note", tokenVerification, noteModule.updateNote) // 修改内容
router.put("/checkNote", tokenVerification, noteModule.checkNote) // 修改内容
router.delete("/note", tokenVerification, noteModule.delNote) // 删除内容
router.get("/note", tokenVerification, noteModule.getDetail) // 获取内容详情

// 用户
router.get("/getFrontUserList", tokenVerification, userModule.getFrontUserList) // 获取前台用户
router.put("/updateFrontUser", tokenVerification, userModule.updateFrontUser) // 启/禁用前台用户

// 评论
router.get("/getCommentList", tokenVerification, commentModule.getCommentList) // 评论列表
router.put("/updateComment", tokenVerification, commentModule.updateComment) // 评论列表

router.get("/getFrontnoteList", tokenVerification, frontModule.getNoteList)
module.exports = router
