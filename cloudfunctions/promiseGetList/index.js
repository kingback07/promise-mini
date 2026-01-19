// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 查询我创建的承诺
    // 按创建时间倒序排列
    const result = await db.collection('Promises')
      .where({
        _openid: openid
      })
      .orderBy('createdAt', 'desc')
      .get()

    return {
      success: true,
      data: result.data,
      msg: '查询成功'
    }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      msg: e.message
    }
  }
}
