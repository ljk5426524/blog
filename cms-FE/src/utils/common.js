/**
 * [工具类方法]
 * @type {Object}
 */

export default {

  // 获取唯一的ID
  uuid(long) {
    let uuid = ''
    const max = long || 32

    for (let i = 0; i < max; i++) {
      const random = Math.random() * 16 | 0
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
    }

    return uuid
  },

  // 获取文件夹大小
  getFolderSize() {

  },

  // 获取文件大小
  getFileSize() {

  },

  // 格式化文件大小
  formatFileSize(size) {
    const sizeK = 1024
    const sizeM = 1024 * 1024
    const sizeG = 1024 * 1024 * 1024
    if (size / sizeG >= 1) {
      return this.formatFloatSize(size / sizeG) + ' GB'
    } else if (size / sizeM >= 1) {
      return this.formatFloatSize(size / sizeM) + ' MB'
    } else if (size / sizeK >= 1) {
      return this.formatFloatSize(size / sizeK) + ' KB'
    } else {
      return size + ' 字节'
    }
  },

  formatFloatSize(number) {
    return Math.round(number * 100) / 100
  },

  // 时间格式化
  formatTime(timestamp = new Date()) {
    const date = new Date(timestamp / 1)

    const YYYY = date.getFullYear()
    const MM = date.getMonth() + 1
    const DD = date.getDate()
    const hh = date.getHours()
    const mm = date.getMinutes()
    const ss = date.getSeconds()

    return [YYYY, MM, DD].map(this.padZero).join('-') + ' ' + [hh, mm, ss].map(this.padZero).join(':')
  },

  formatDate(timestamp = new Date()) {
    const date = new Date(timestamp / 1)

    const YYYY = date.getFullYear()
    const MM = date.getMonth() + 1
    const DD = date.getDate()

    return [YYYY, MM, DD].map(this.padZero).join('-')
  },

  // 补零
  padZero(str, dig = 2) {
    str = '' + str

    while (str.length < dig) {
      str = '0' + str
    }

    return str
  },

  getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  },

  // 深拷贝
  deepCopy(origin) {
    // Basic data types or aviod `null` to `{}`
    if (typeof origin !== 'object' || origin === null) {
      return origin
    }

    const copy = Array.isArray(origin) ? [] : {}

    for (const prop in origin) {
      if (origin.hasOwnProperty(prop)) {
        copy[prop] = typeof origin[prop] === 'object' ? this.deepCopy(origin[prop]) : origin[prop]
      }
    }

    return copy
  },

  formatFileName(fileName = '', length = 12) {
    const dotLastIndex = fileName.lastIndexOf('.')
    let filePrefix = ''
    let fileExtension = ''
    let newFileName = fileName

    if (dotLastIndex !== -1) {
      filePrefix = fileName.substr(0, dotLastIndex)
      fileExtension = fileName.substr(dotLastIndex, fileName.length)

      newFileName = (filePrefix.length > length ? (filePrefix.substr(0, length) + '...') : filePrefix) + fileExtension
    }

    return newFileName
  },

  parseMs(ms) {
    if (typeof ms !== 'number') {
      throw new TypeError('Expected a number')
    }

    const roundTowardsZero = ms > 0 ? Math.floor : Math.ceil

    return {
      days: roundTowardsZero(ms / 86400000),
      hours: roundTowardsZero(ms / 3600000) % 24,
      minutes: roundTowardsZero(ms / 60000) % 60,
      seconds: roundTowardsZero(ms / 1000) % 60,
      milliseconds: roundTowardsZero(ms) % 1000,
      microseconds: roundTowardsZero(ms * 1000) % 1000,
      nanoseconds: roundTowardsZero(ms * 1e6) % 1000
    }
  },

  /**
   * 保留两位小数
   * @param {Number} num
   */
  numKeep2Decimal(_value) {
    var value = Math.round(parseFloat(_value) * 100) / 100
    var xsd = value.toString().split('.')
    if (xsd.length === 1) {
      value = value.toString() + '.00'
      return value
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + '0'
      }
      return value
    }
  },

  env() {
    const detect = function(agent) {
      const ua = navigator.userAgent.toLowerCase()

      return ua.indexOf(agent) !== -1
    }

    return {
      ios: detect('iphone') || detect('ipad') || detect('ipod'),
      android: detect('android'),
      wechat: detect('micromessenger'),
    }
  },

  /**
   * 防抖
   *
   * function handle() {
   * console.log(Math.random());
   * }
   * // 滚动事件
   * window.addEventListener('scroll', debounce(handle));
   *
   */
  debounce(fn) {
    let timeout = null // 创建一个标记用来存放定时器的返回值
    return function() {
      // 每当用户输入的时候把前一个 setTimeout clear 掉
      clearTimeout(timeout)
      // 然后又创建一个新的 setTimeout, 这样就能保证interval 间隔内如果时间持续触发，就不会执行 fn 函数
      timeout = setTimeout(() => {
        fn.apply(this, arguments)
      }, 500)
    }
  },

  /**
   * 节流
   *
   * function sayHi(e) {
   *    console.log(e.target.innerWidth, e.target.innerHeight);
   * }
   *
   * window.addEventListener('resize', throttle(sayHi));
   */
  throttle(fn) {
    let canRun = true // 通过闭包保存一个标记
    return function() {
      // 在函数开头判断标记是否为true，不为true则return
      if (!canRun) return
      // 立即设置为false
      canRun = false
      // 将外部传入的函数的执行放在setTimeout中
      setTimeout(() => {
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。
      // 当定时器没有执行的时候标记永远是false，在开头被return掉
        fn.apply(this, arguments)
        canRun = true
      }, 500)
    }
  }

}
