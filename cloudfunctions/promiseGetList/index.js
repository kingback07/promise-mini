const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 默认查询我创建的
  // 实际上以后可能会有参与者字段，这里先简单实现
  
  try {
    const res = await db.collection('promises')
      .where({
        _openid: openid
      })
      .orderBy('createdAt', 'desc')
      .get()

    return {
      code: 0,
      msg: 'success',
      data: res.data
    }
  } catch (e) {
    console.error(e)
    return {
      code: -1,
      msg: 'Database error',
      error: e
    }
  }
}
