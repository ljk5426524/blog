const crypto = require('crypto')
const { DEBUG } = require('../config')

/**
 * 获取时间戳 10位或13位[默认]
 * @param {Number} type 类型 1=13位
 */
function getTimestamp(type = 1) {
    let timestamp = new Date().getTime()
    if (type == 1) {
        return timestamp
    } else {
        return parseInt(timestamp / 1000)
    }
}

// json格式返回数据
function resJson(code = 0, msg, data = {}, query = {}) {
    if (!msg) { msg = code === 0 ? 'success' : 'error' }
    return {
        code,
        msg,
        data,
        query: DEBUG.debug ? query : undefined
    }
}

// 合并post get的传参
function getBodyData(req = {}) {
    const body = req.body || {}
    const query = req.query || {}
    const params = req.params || {}
    return { ...params, ...query, ...body }
}

//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

/**
 * 判断字符串是否是json数据
 * @param {String} str 
 */
function strIsJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            // console.log('error：' + str + '!!!' + e);
            return false;
        }
    } else {
        return false;
    }
    // console.log('It is not a string!')
}

// md5加密
function md5(content) {
    return crypto.createHash('md5').update(content).digest("hex")
}

module.exports = {
    getTimestamp,
    resJson,
    getBodyData,
    randomNum,
    strIsJSON,
    md5,
};