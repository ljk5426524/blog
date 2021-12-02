const frontModel = require("../model/frontModel")
const commentModel = require("../model/commentModel")
const noteModel = require("../model/noteModel")

// 获取文章列表
const getNoteList = async (req, res) => {
  const { front_user_id: userId } = req.userInfo
  const { page = 1, size = 20 } = req.query
  const noteList = await frontModel.getNoteList({ userId }, page, size)
  const [list, [{ total = 0 }]] = noteList.data
  res.$success({ list, total })
}

// 获取文章详情
const getNoteDeatil = async (req, res) => {
  const { noteId } = req.query
  if (!noteId) {
    return res.$fail(1, "参数错误")
  }
  let noteDetail = await noteModel.getNoteDetailById({ noteId })
  if (noteDetail) {
    // 存在
    const commentList = await commentModel.getCommentList({ noteId }, 1, 1000)
    noteDetail.data["commentList"] = commentList.data[0]
    res.$success(noteDetail.data)
  } else {
    // 不存在
    res.$fail(1, "内容不存在")
  }
}
module.exports = {
  getNoteList,
  getNoteDeatil,
}
