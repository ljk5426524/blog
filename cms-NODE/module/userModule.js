const userModel = require("../model/userModel")
const { md5 } = require("../utils/common")

// 获取前台用户列表
const getFrontUserList = async (req, res) => {
  // const { user_id: userId } = req.userInfo
  const { keyWord, page = 1, size = 20 } = req.query
  const frontUserList = await userModel.getFrontUserList(
    { keyWord },
    page,
    size
  )
  const [list, [{ total = 0 }]] = frontUserList.data
  res.$success({ list, total })
}

// 启/禁用前台用户
const updateFrontUser = async (req, res) => {
  const { userId, state } = req.body
  if (!userId || !state) {
    return res.$fail(1, "参数错误")
  }
  const userDetail = await userModel.getFrontUserList({ userId })
  console.log(userDetail)
  if (userDetail) {
    // 存在
    await userModel.updateFrontUser({ userId, state })
    res.$success()
  } else {
    // 不存在
    res.$fail(1, "用户不存在")
  }
}

module.exports = {
  getFrontUserList,
  updateFrontUser,
}
