const mysql = require('../utils/mysql')

// Test
async function test() {
  return mysql.queryOne("SELECT 1", [])
}

// 获取上次查询列表的Total
async function getLastSelectTotal() {
  return mysql.queryOne("SELECT FOUND_ROWS() as total", [])
}

// 根据用户名密码获取账户信息
async function getUserInfoByLogin(data) {
  const { user, password } = data
  return mysql.queryOne("select * from admin where user = ? and password = ?", [user, password])
}

module.exports = {
  test,
  getLastSelectTotal,
  getUserInfoByLogin,
}