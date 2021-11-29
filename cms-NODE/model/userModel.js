const mysql = require("../utils/mysql")
const dayjs = require("dayjs")

// 获取前台用户
async function getFrontUserList(data, page = 1, size = 10) {
  const { keyWord } = data

  let sql = `select * from front_user_list`
  let values = []
  if (keyWord) {
    // 标题筛选
    sql += " where nick_name like ?"
    values.push(`%${keyWord}%`)
  }

  // 排序
  sql += " ORDER BY front_user_id DESC"

  // 分页
  sql += " limit ?, ?"
  values.push((page - 1) * size || 0, size)

  sql += ";SELECT FOUND_ROWS() as total"
  console.log(sql)
  return $mysql.query(sql, values)
}

// 启/禁用前台用户
async function updateFrontUser(data) {
  const { userId, state } = data
  const updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss")

  return mysql.queryOne(
    "update front_user_list set ? where front_user_id = ?",
    [{ state, update_time: updateTime }, userId]
  )
}

module.exports = {
  getFrontUserList,
  updateFrontUser,
}
