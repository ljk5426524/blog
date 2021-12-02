const mysql = require("../utils/mysql")
const dayjs = require("dayjs")

async function getNoteList(data, page = 1, size = 10) {
  const { userId } = data
  let values = []
  let sql = `SELECT
	n.front_user_id,
	n.title,
	n.note_id,
	n.note,
	n.create_time,
	CONCAT( '[', d.comments, ']' ) AS comment
FROM
	note_list n
	LEFT JOIN (
SELECT
	GROUP_CONCAT( CONCAT( '{"content":"', c.content, '","nickName":"', f.nick_name, '","createTime":"', c.create_time, '"}' ) SEPARATOR ',' ) AS comments,
	c.note_id 
FROM
	comment_list c
	LEFT JOIN front_user_list f ON f.front_user_id = c.user_id 
GROUP BY
	c.note_id 
	) d ON d.note_id = n.note_id 
WHERE
	n.front_user_id = ${userId}
GROUP BY
	n.note_id`

  // 分页
  sql += " limit ?, ?"
  values.push((page - 1) * size || 0, size)

  sql += ";SELECT FOUND_ROWS() as total"
  return $mysql.query(sql, values)
}

async function getCommentList() {}

module.exports = {
  getNoteList,
}
