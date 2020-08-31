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
  var hash_value = crypto.createHash('sha256').update(event.text).digest('hex')
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    hash : hash_value
  }
}