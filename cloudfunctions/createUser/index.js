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
  var passwd_key = crypto.createHash('sha256').update(event.passwd).digest('hex')
  
  return new Promise((resolve, reject) => {
    db.collection("users").add({
      data : {
        avatarUrl: event.avatarUrl,
        city: event.city,
        gender: event.gender,
        language: event.language,
        nickName: event.nickName,
        openid: wxContext.OPENID,
        passwd: passwd_key,
        date: event.date
      }
    }).then(res=>{
      resolve({
        event,
        openid: wxContext.OPENID,
        status: "ok"
      })
    })
  })
}