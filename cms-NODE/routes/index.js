const express = require("express")
const app = express()

/** 自定义路由配置开始 **/
app.get("/test", (req, res) => {
  res.json({ txt: "ddddd" })
})
app.use("/home", require("./homeRouter"))
app.use("/blog", require("./baseRouter"))
/** 自定义路由配置结束 **/

module.exports = app
