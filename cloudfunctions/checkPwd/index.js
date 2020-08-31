// 云函数入口文件
const cloud = require('wx-server-sdk')
var crypto = require('crypto')

cloud.init({
  traceUser: true,
  env: "ipasswd-7h7iu"
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return new Promise((resolve, reject) => {
    db.collection('users').where({
      openid: wxContext.OPENID
    }).get().then(res => {
      if (res.data.length > 0) {
        var passwd_key = crypto.createHash('sha256').update(event.passwd).digest('hex')
        if(passwd_key == res.data[0].passwd)
          resolve({
            event,
            openid: wxContext.OPENID,
            status: "success"
          })
        else
          resolve({
            event,
            openid: wxContext.OPENID,
            status: "failed"
          })
      }
      else {
        resolve({
          event,
          openid: wxContext.OPENID,
          status: "failed"
        })
      }
    })

  })

}