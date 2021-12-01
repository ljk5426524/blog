const { MYSQL } = require("../config")
const commentModel = require("../model/commentModel")

// 获取评论列表
const getCommentList = async (req, res) => {
  const { keyWord, page = 1, size = 10 } = req.query
  const commentList = await commentModel.getCommentList({ keyWord }, page, size)
  const [list, [{ total = 0 }]] = commentList.data
  res.$success({ list, total })
}

const updateComment = async (req, res) => {
  const { id: commentId, state } = req.body

  const commentDetail = await commentModel.getCommentById({ commentId })
  if (commentDetail) {
    // 存在
    await commentModel.updateComment({ commentId, state })
    res.$success()
  } else {
    // 不存在
    res.$fail(1, "评论不存在")
  }
}

module.exports = {
  getCommentList,
  updateComment,
}
