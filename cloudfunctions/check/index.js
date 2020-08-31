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
    }).get().then(res=>{
      if(res.data.length > 0){
        resolve({
          event,
          openid: wxContext.OPENID,
          userInfo : {
            avatarUrl:res.data[0].avatarUrl,
            city: res.data[0].city,
            date : res.data[0].date,
            nickName : res.data[0].nickName,
            language : res.data[0].language,
            gender : res.data[0].gender,
          },
          status: "UserFound"
        })
      }
      else{
        resolve({
          event,
          openid: wxContext.OPENID,
          userInfo: {},
          status:"UserNotFound"
        })
      }
    })
  })
}