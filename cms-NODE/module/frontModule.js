const frontModel = require("../model/frontModel")

// 获取文章列表
const getNoteList = async (req, res) => {
  const { user_id: userId } = req.userInfo
  const { page = 1, size = 20 } = req.query
  const noteList = await frontModel.getNoteList({ userId }, page, size)
  const [list, [{ total = 0 }]] = noteList.data
  res.$success({ list, total })
}

// 获取文章详情
const getNoteDeatil = async (req, res) => {}
module.exports = {
  getNoteList,
}
