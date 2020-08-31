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
  let passwd_key = crypto.createHash('sha256').update(event.passwd).digest('hex')
  return new Promise((resolve, reject) => {
    db.collection('users').where({
      openid : wxContext.OPENID
    }).update({
      data:{
        passwd : passwd_key
      },
      success:function(){
        resolve({
          status : "ok",
          openid : wxContext.OPENID
        })
      },
      fail: function () {
        resolve({
          status: "fail",
          openid: wxContext.OPENID
        })
      }
    })
  })
}