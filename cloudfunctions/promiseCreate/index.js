const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const { title, content, deadline, images } = event

  if (!title || !content) {
    return {
      code: -1,
      msg: 'Title and content are required'
    }
  }

  try {
    const res = await db.collection('promises').add({
      data: {
        _openid: openid,
        title,
        content,
        status: 0, // 0: 进行中
        deadline: new Date(deadline),
        images: images || [],
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })

    return {
      code: 0,
      msg: 'success',
      data: res
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
