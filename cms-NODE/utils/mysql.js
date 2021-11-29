// 数据库模块
const mysql = require('mysql')
let pool
let timer = 0

// 初始化Mysql
const init = function (config) {
    pool = mysql.createPool({
        host: config.host || '127.0.0.1',
        user: config.user || 'root',
        password: config.password,
        database: config.database,
        port: config.port || '3306',
        charset: config.charset || 'utf8',
        multipleStatements: true
    });

    query("SELECT 1", [], (err, vals, fields) => {
        if (err) {
            console.log("MYSQL", "连接失败", err)
        } else {
            keepAlive()
            console.log("MYSQL", "连接成功")
        }
    })
};

// 执行sql语句
function query(sql, sqlParams = [], cb) {
    return new Promise((res, rej) => {
        pool.getConnection(function (err, conn) {
            if (err) {
                typeof cb == 'function' && cb(err, null, null);
                rej(err)
            } else {
                conn.query(sql, sqlParams, function (qerr, vals, fields) {
                    typeof cb == 'function' && cb(qerr, vals, fields);
                    if (qerr) {
                        rej(qerr)
                    } else {
                        res({ success: true, data: vals, fields })
                    }
                });
                pool.releaseConnection(conn);
            }
        });
    })
};

// 单条数据查询
function queryOne(sql, sqlParams = []) {
    return new Promise((res, rej) => {
        query(sql, sqlParams).then(sqlRes => {
            const { data } = sqlRes || {}
            if (data.length > 0) {
                sqlRes.data = data[0]
                res(sqlRes)
            } else {
                res(false)
            }
        }).catch(sqlErr => {
            rej(sqlErr)
        })
    })
};

function keepAlive() {
    clearInterval(timer)
    timer = setInterval(() => {
        query("SELECT 1", [])
    }, 30 * 1000)
}


module.exports = {
    init,
    query,
    queryOne,
}