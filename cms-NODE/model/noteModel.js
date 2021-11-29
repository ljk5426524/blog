const mysql = require("../utils/mysql")
const dayjs = require("dayjs")

// Test
async function test() {
  return mysql.queryOne("SELECT 1", [])
}

// 获取上次查询列表的Total
async function getLastSelectTotal() {
  return mysql.queryOne("SELECT FOUND_ROWS() as total", [])
}

// 根据用户名密码获取账户信息
async function getUserInfo(data) {
  const { username, password } = data
  let sql = `select * from user_list where username = ?`
  let vals = [username]

  if (password) {
    sql += ` and password = ?`
    vals.push(password)
  }
  return mysql.queryOne(sql, vals)
}

// 注册
async function registerUser(data) {
  const { username, password } = data
  return mysql.queryOne("insert into user_list set ?", [{ username, password }])
}

// 修改用户信息
async function changePassword(data) {
  const { userId } = data
  delete data.userId
  return mysql.queryOne("update user_list set ? where user_id = ?", [
    data,
    userId,
  ])
}

// 获取内容详情
async function getNoteDetailById(data) {
  const { noteId } = data
  return mysql.queryOne("select * from note_list where note_id = ?", [noteId])
}

// 获取内容列表
async function getNoteListByUserId(data, page = 1, size = 10) {
  const { userId, title, createTime } = data

  let sql = `select * from note_list where user_id = ?`
  let values = [userId]

  if (title) {
    // 标题筛选
    console.log(title)
    sql += " and title like ?"
    values.push(`%${title}%`)
  }

  if (createTime) {
    // 创建日期筛选
    sql += " and create_time like ?"
    values.push(`%${createTime}%`)
  }

  // 排序
  sql += " ORDER BY note_id DESC"

  // 分页
  sql += " limit ?, ?"
  values.push((page - 1) * size || 0, size)

  sql += ";SELECT FOUND_ROWS() as total"

  return $mysql.query(sql, values)
}

// 增加内容
async function addNote(data) {
  const { userId: user_id, title, note } = data
  const createTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
  const updateTime = createTime

  return mysql.queryOne("insert into note_list set ?", [
    { user_id, title, note, update_time: updateTime, create_time: createTime },
  ])
}

// 更新内容
async function updateNote(data) {
  const { noteId, title, note } = data
  const updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss")

  return mysql.queryOne("update note_list set ? where note_id = ?", [
    { title, note, update_time: updateTime },
    noteId,
  ])
}

// 删除内容
async function delNote(data) {
  const { noteId } = data

  return mysql.queryOne("delete from note_list where note_id = ?", [noteId])
}

module.exports = {
  test,
  getLastSelectTotal,
  getUserInfo,
  registerUser,
  changePassword,
  getNoteDetailById,
  getNoteListByUserId,
  addNote,
  updateNote,
  delNote,
}
