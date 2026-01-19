const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { title, content, deadline } = event

  if (!title) {
    return { code: -1, msg: 'Title is required' }
  }

  try {
    const res = await db.collection('promises').add({
      data: {
        _openid: wxContext.OPENID,
        title,
        content: content || '',
        status: 0, // 0: Doing, 1: Done, 2: Failed
        deadline: deadline ? new Date(deadline) : null,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
    return { code: 0, msg: 'success', data: res }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
