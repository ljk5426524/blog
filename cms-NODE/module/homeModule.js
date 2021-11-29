const indexModel = require('../model/indexModel')

const index = (req, res) => {
  res.$success({ msg: 'success' })
}

const name = (req, res) => {
  const { name = '', age = '' } = req.query
  if (!(name && age)) {
    return res.$fail('参数错误')
  }
  res.$success({ msg: `你是${name},今年${age}岁` })
}

const error = (req, res) => {
  throw new Error('错误测试')
}

module.exports = {
  index,
  name,
  error,
}