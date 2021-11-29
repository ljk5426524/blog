/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {Object} params
 */
export function downloadBlob(params) {
  let { response, fileName, isConvertToCn = true } = params

  let blob
  const isBlob = response instanceof Blob

  // response can be response or response.data(blob)
  if (!isBlob) {
    const type = response.headers['content-type']
    const disposition = response.headers['content-disposition']
    blob = new Blob([response.data], {
      type: type || 'application/octet-stream',
    })

    // you can use custom download file name like xx.xlsx(file name + suffix name)
    // or you can get download file name from backend
    // But by default, files downloaded by firefox and ie do not have a suffix name
    // So, you must get download file name and suffix name from backend(access attribute content-disposition)
    if (!fileName) {
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = fileNameRegex.exec(disposition)
        if (matches != null && matches[1])
          fileName = matches[1].replace(/['"]/g, '')
      }
    }
  } else {
    blob = response

    if (!fileName) {
      throw Error('You must define a downloaded file name')
    }
  }

  // Converting to Chinese(if need)
  if (isConvertToCn) {
    fileName = decodeURI(fileName)
  }

  // chrome firefox: navigator.msSaveBlob => undefined
  // ie: navigator.msSaveBlob => function
  // or you can use navigator.msSaveOrOpenBlob(In the download prompt box, will contain "open" and "save" option)
  if (typeof navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing the URL has been freed."
    navigator.msSaveBlob(blob, fileName)
  } else {
    const URL = window.URL || window.webkitURL
    const downloadUrl = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')

    // use HTML5 a[download] attribute to specify fileName
    // ie and safari doesn't support this yet
    // chrome firefox: typeof downloadLink.download => 'string'
    // ie safari: typeof downloadLink.download => 'undefined'
    if (typeof downloadLink.download === 'undefined') {
      window.open(downloadUrl)
    } else {
      downloadLink.href = downloadUrl
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      window.URL.revokeObjectURL(downloadUrl)
    }
  }
}
