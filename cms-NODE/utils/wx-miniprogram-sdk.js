/**
 * 微信小程序SDK
 * https://developers.weixin.qq.com/miniprogram/dev/api-backend
 */

const fs = require('fs')
const dayjs = require('dayjs')
const WXBizDataCrypt = require('./WXBizDataCrypt')
const requestModule = require('request');
const request = (config) => {
  return new Promise((res, rej) => {
    requestModule(config, function (error, response) {
      if (error) {
        rej(error)
      } else {
        const { body } = response
        let json = {}
        if (typeof body === 'string') {
          try {
            json = JSON.parse(body)
          } catch (error) {
            json = {}
          }
        } else {
          json = body
        }

        response.json = json
        res(response)
      }
    })
  })
}

const wxRequest = (config) => {
  return new Promise((res, rej) => {
    return request(config).then(response => {
      const { isNoWx } = config
      if (isNoWx) {
        res(response.json)
        return
      }
      const { errcode } = response.json
      if (errcode) {
        return rej(`访问微信接口出错，错误码${errcode} 详情${JSON.stringify(response.body)}`)
      }
      res(response.json)
    }).catch(err => {
      rej(`访问微信接口出错,详情${err.message}`)
    })
  })
}

class WXMINIPROSDK {
  loopTimerId = null // 刷新AccessToken的时钟ID
  loopTimerCycle = 3600 * 1000 // 刷新AccessToken时间，单位：毫秒 微信要求7200秒刷新一次

  constructor(config) {
    const { appid, secret, wxHost, accessToken, autoGetToken = true, autoGetTokenCb } = config || {}
    this.appid = appid
    this.secret = secret
    this.host = wxHost || 'https://api.weixin.qq.com'
    this.accessToken = accessToken || ''
    this.autoGetToken = autoGetToken // 自动获取token
    if (!appid || !secret) {
      throw Error('请配置微信小程序appid和secret')
    }

    // this.autoGetToken && this.getAccessTokenLoop()
    this.local.readToken()

    // 获取token后的回调
    typeof autoGetTokenCb === 'function' ? (this.autoGetTokenCb = autoGetTokenCb) : (this.autoGetTokenCb = () => { })
  }

  // 本地token缓存
  local = {
    fileName: 'access_token.data',
    saveToken: (token) => {
      if (!token) { return }

      const fileData = {
        token,
        time: dayjs().unix()
      }

      fs.writeFileSync(this.local.fileName, JSON.stringify(fileData), 'utf8')
    },
    readToken: () => {
      if (!fs.existsSync(this.local.fileName)) { // 不存在就获取
        this.getAccessTokenLoop()
        return
      }
      const readFileData = fs.readFileSync(this.local.fileName, 'utf8')
      const nowTime = dayjs().unix()
      let tokenJson = {}
      try {
        tokenJson = JSON.parse(readFileData)
      } catch (error) {
        tokenJson = {}
      }

      if (nowTime - tokenJson.time > this.loopTimerCycle / 1000) {
        console.log(`微信小程序 token过期，刷新获取`);
        // token过期 重新获取
        this.getAccessTokenLoop()
      } else { // token有效 计算下一次刷新的时间
        this.accessToken = tokenJson.token
        const nextRefSec = this.loopTimerCycle / 1000 - (nowTime - tokenJson.time)
        console.log(`微信小程序 token有效,${nextRefSec}秒后刷新`);

        setTimeout(() => {
          this.getAccessTokenLoop()
        }, nextRefSec * 1000)
      }
    }
  }

  // 手动配置accessToken
  setAccessToken(accessToken) {
    console.log('微信小程序 刷新token', accessToken);
    this.accessToken = accessToken
    this.autoGetTokenCb(accessToken)
    this.local.saveToken(accessToken)
  }

  // 自动获取token任务
  getAccessTokenLoop() {
    const loopFun = () => {
      this.auth.getAccessToken().then(res => {
        this.setAccessToken(res.access_token)
      })
    }

    loopFun() // 首次执行

    clearInterval(this.loopcTimerId) // 清除时钟

    this.loopTimerId = setInterval(loopFun, this.loopTimerCycle) // 启动时钟

  }

  // 微信信息解密
  decryptData = (sessionKey, iv, encryptedData) => {
    var pc = new WXBizDataCrypt(this.appid, sessionKey)
    var data = pc.decryptData(encryptedData, iv)
    return data
  }

  auth = {
    // 获取接口调用凭证
    getAccessToken: () => {
      return wxRequest(`${this.host}/cgi-bin/token?grant_type=client_credential&appid=${this.appid}&secret=${this.secret}`)
    },

    // 登录
    code2Session: (code) => {
      return wxRequest(`${this.host}/sns/jscode2session?appid=${this.appid}&secret=${this.secret}&js_code=${code}&grant_type=authorization_code`)
    },

    // 获取用户信息
    getPaidUnionId: (openid) => {
      return wxRequest(`${this.host}/wxa/getpaidunionid?access_token=${this.accessToken}&openid=${openid}`)
    }
  }

  // https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=11522142966rk3L2&version=1&lang=zh_CN&platform=2
  wxa = {
    // 文本安全内容检测接口
    msgSecCheck: (content) => {
      return wxRequest({
        url: `${this.host}/wxa/msg_sec_check?access_token=${this.accessToken}`,
        method: 'post',
        json: true,
        isNoWx: true,
        body: {
          content
        }
      }).then(res => {
        const { errcode } = res
        if (errcode === 0) {
          return true
        }
        return false
      })
    },
    // 图片安全内容检测接口
    imgSecCheck: (media) => {
      const tmp = './tmp'
      if (!fs.existsSync(tmp)) { fs.mkdirSync(tmp) }
      let fileName = tmp + '/' + (new Date().getTime() + '') + (Math.ceil(Math.random() * 1000) + '');
      fs.writeFileSync(`${fileName}`, media)

      return wxRequest({
        url: `${this.host}/wxa/img_sec_check?access_token=${this.accessToken}`,
        method: 'post',
        isNoWx: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        formData: { media: fs.createReadStream(`${fileName}`) }
      }).then(res => {
        console.log(res)
        const { errcode } = res
        if (errcode === 0) {
          return true
        }
        return false
      }).finally(() => {
        fs.unlinkSync(fileName)
      })
    }
  }


}

module.exports = WXMINIPROSDK