const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const res = await db.collection('promises')
      .where({
        _openid: wxContext.OPENID
      })
      .orderBy('createdAt', 'desc')
      .get()
    
    return { code: 0, msg: 'success', data: res.data }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
