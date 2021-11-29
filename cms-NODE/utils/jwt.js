const jsonwebtoken = require('jsonwebtoken');
const { JWT } = require('../config')
const secret = JWT.secret;

module.exports = {
  sign(obj, expires = '1000 days') { // value 为传入值， expires为过期时间，这两者都会在token字符串中题先
    try {
      return jsonwebtoken.sign({ ...obj }, secret, { expiresIn: expires });
    } catch (e) {
      console.error('jwt sign error --->', e);
      return '';
    }

    return ''
  },

  verify(token) {
    if (!token) return false

    try {
      const resValue = jsonwebtoken.verify(token, secret); // 如果过期将返回false
      return resValue
    } catch (e) {
      console.error('jwt verify error --->', e);
      return false;
    }
  }
}