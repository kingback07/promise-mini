const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const { status } = event // Optional filter by status

    let query = {
        _openid: openid
    }
    
    if (status !== undefined && status !== null) {
        query.status = status
    }

    const res = await db.collection('promises')
      .where(query)
      .orderBy('createdAt', 'desc')
      .get()

    return {
      code: 0,
      msg: 'success',
      data: res.data
    }
  } catch (e) {
    return {
      code: -1,
      msg: e.message
    }
  }
}
