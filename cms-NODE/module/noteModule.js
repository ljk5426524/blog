const noteModel = require("../model/noteModel")
const { md5 } = require("../utils/common")

const index = (req, res) => {
  res.$json({ msg: "success" })
}

// 登录
const login = async (req, res) => {
  const { username, password } = req.body
  if (!(username && password)) {
    return res.$fail(1, "参数错误")
  }

  let md5Password = md5(password)
  const userInfo = await noteModel.getUserInfo({
    username,
    password: md5Password,
  })
  if (userInfo) {
    // 用户名密码正确
    let token = $jwt.sign(userInfo.data || {})
    res.$success({ ...userInfo.data, token })
  } else {
    // 用户不存在
    res.$fail(1, `密码不正确`)
  }
}

// 注册
const register = async (req, res) => {
  const { username, password } = req.body
  if (!(username && password)) {
    return res.$fail(1, "参数错误")
  }

  let md5Password = md5(password)
  const userInfo = await noteModel.getUserInfo({ username })
  if (userInfo) {
    // 已存在
    res.$fail(1, `用户${username}已存在`)
  } else {
    // 不存在 注册
    await noteModel.registerUser({ username, password: md5Password }) // 注册
    res.$success()
  }
}

// 修改密码
const changePassword = async (req, res) => {
  const { password } = req.body
  const { username, user_id: userId } = req.userInfo
  if (!password) {
    return res.$fail(1, "参数错误")
  }

  let md5Password = md5(password)

  const userInfo = await noteModel.getUserInfo({ username })
  if (userInfo) {
    // 已存在
    await noteModel.changePassword({ username, password: md5Password, userId }) // 修改密码
    res.$success()
  } else {
    // 不存在
    res.$fail(1, `用户${username}不存在`)
  }
}

// 获取内容列表
const getList = async (req, res) => {
  const { user_id: userId } = req.userInfo
  const { title, create_time: createTime, page = 1, size = 20 } = req.query
  const noteList = await noteModel.getNoteListByUserId(
    { userId, title, createTime },
    page,
    size
  )
  const [list, [{ total = 0 }]] = noteList.data
  res.$success({ list, total })
}

// 新增内容
const addNote = async (req, res) => {
  const { title, note } = req.body
  const { user_id: userId } = req.userInfo

  if (!title) {
    return res.$fail(1, "参数错误")
  }

  await noteModel.addNote({ userId, title, note })
  res.$success()
}

// 更新内容
const updateNote = async (req, res) => {
  const { title, note, note_id: noteId } = req.body
  const { user_id: userId } = req.userInfo

  if (!(title && noteId)) {
    return res.$fail(1, "参数错误")
  }

  const noteDetail = await noteModel.getNoteDetailById({ noteId })
  if (noteDetail) {
    // 存在
    const noteDetailData = noteDetail.data
    if (noteDetailData.user_id === userId) {
      await noteModel.updateNote({ noteId, title, note })
      res.$success()
    } else {
      res.$fail(1, "您没有操作权限")
    }
  } else {
    // 不存在
    res.$fail(1, "内容不存在")
  }
}

// 删除内容
const delNote = async (req, res) => {
  const { note_id: noteId } = req.body
  const { user_id: userId } = req.userInfo
  if (!noteId) {
    return res.$fail(1, "参数错误")
  }

  const noteDetail = await noteModel.getNoteDetailById({ noteId })
  if (noteDetail) {
    // 存在
    const noteDetailData = noteDetail.data
    if (noteDetailData.user_id === userId) {
      await noteModel.delNote({ noteId })
      res.$success()
    } else {
      res.$fail(1, "您没有操作权限")
    }
  } else {
    // 不存在
    res.$fail(1, "内容不存在")
  }
}

// 获取内容详情
const getDetail = async (req, res) => {
  const { note_id: noteId } = req.query
  if (!noteId) {
    return res.$fail(1, "参数错误")
  }

  const noteDetail = await noteModel.getNoteDetailById({ noteId })
  if (noteDetail) {
    // 存在
    res.$success(noteDetail.data)
  } else {
    // 不存在
    res.$fail(1, "内容不存在")
  }
}

// 获取内容列表
const getFrontUserList = async (req, res) => {
  // const { user_id: userId } = req.userInfo
  const { keyWord, page = 1, size = 20 } = req.query
  const frontUserList = await noteModel.getFrontUserList(
    { keyWord },
    page,
    size
  )
  const [list, [{ total = 0 }]] = frontUserList.data
  res.$success({ list, total })
}

module.exports = {
  index,
  login,
  register,
  changePassword,
  getList,
  addNote,
  updateNote,
  delNote,
  getDetail,
  getFrontUserList,
}
