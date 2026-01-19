const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const { id, status } = event
    
    if (!id || status === undefined) {
        return { code: -1, msg: 'ID and status are required' }
    }

    const res = await db.collection('promises').where({
        _id: id,
        _openid: openid
    }).update({
      data: {
        status: status,
        updatedAt: db.serverDate()
      }
    })

    return {
      code: 0,
      msg: 'success',
      data: res
    }
  } catch (e) {
    return {
      code: -1,
      msg: e.message
    }
  }
}
