const mysql = require("../utils/mysql")
const dayjs = require("dayjs")

async function getCommentList(data, page = 1, size = 10) {
  const { keyWord } = data
  let sql = `SELECT c.id,c.content,c.state,c.create_time,n.title from comment_list c LEFT JOIN note_list n on c.note_id = n.note_id `
  let values = []

  if (keyWord) {
    sql += " where title like ?"
    values.push(`%${keyWord}%`)
  }
  // 分页
  sql += " limit ?, ?"
  values.push((page - 1) * size || 0, size)

  sql += ";SELECT FOUND_ROWS() as total"
  return $mysql.query(sql, values)
}

async function getCommentById(data) {
  const { commentId } = data
  return mysql.queryOne("select * from comment_list where id = ?", [commentId])
}

async function updateComment(data) {
  const { commentId, state } = data
  return mysql.queryOne("update comment_list set ? where id = ?", [
    { state },
    commentId,
  ])
}

module.exports = {
  getCommentList,
  getCommentById,
  updateComment,
}
