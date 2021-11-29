module.exports = {
    DEBUG: {
        debug: true,
    },

    /**
     * 程序信息
     */
    VERSION: {
        text: '1.0.0',
        num: 10000
    },

    /**
     * http服务配置
     */
    HTTP: {
        host: '0.0.0.0',
        port: 5000
    },

    /**
     * mysql数据库配置
     */
    MYSQL: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'note_demo',
        charset: 'utf8mb4',
    },

    /**
     * 微信小程序配置
     */
    WXMINIPROGRAM: {
        // 测试号
        appid: 'wx8a540b80f0abc426',
        secret: 'e077fa74d00fe391a664f04f2ad5946b',
    },

    /**
     * Json Web Token配置
     */
    JWT: {
        secret: 'gcq#662j%qvkbx4rw7c15o$l6898w7e1',
    },

};