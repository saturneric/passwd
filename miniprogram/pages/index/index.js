//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    test: "Hello",
    passwd_num : 0,
    ifGetUser : null,
    ifCheckPwd: false,
    ifgetdays: false,
    days : 0,
    ifchangecode: false,
    ifchangecode1: false,
    button1: true,
  },

goChange: function(e){
  this.setData({
    ifchangecode: true
  })
},

cancelChange: function(){
  this.setData({
    ifchangecode: false,
    ifchangecode1: false,
    button1: true,
  })
},

changecode: function (e) {
    if(app.globalData.hasCheckPwd&&app.globalData.hasRegister){
    var old = null

    let that = this
    db.collection("users").where({
      openid: app.globalData.openid
    }).limit(1).get().then(res => {
      if (res.data.length > 0) {
        let that=this
        wx.showToast({
          title: '正在验证密码',
          icon: 'loading',
          duration: 600
        })
        wx.cloud.callFunction({
          name: 'checkPwd',
          data: {
            passwd: e.detail.value.wxml_oldcode 
          },
          complete:res=>{
            if (res.result.status == "success" && e.detail.value.wxml_oldcode.length) {
            this.setData({
              ifchangecode1: true,
              ifchangecode: false,
              button1: false,
            })
          wx.showToast({
            title: '请输入您的新密码',
            icon: 'none',
            duration: 1500
          })

          }
            else if (e.detail.value.wxml_oldcode.length){
                wx.showToast({
                title: '密码错误',
                icon: 'none',
                duration: 1500
                  })
              }
        
          },
        })
        }
      else {
        wx.showToast({
          title: '请注册',
          icon: 'none',
          duration: 1500
          })
        }
    })
  } 
  else{
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 1500

      })
  }
},
changecode1: function (e) {   
  if (e.detail.value.wxml_newcode == e.detail.value.wxml_newcode1 && e.detail.value.wxml_newcode.length > 5 && this.data.ifchangecode1 == true) {
      wx.showToast({
        title: '成功更改密码',
        icon: 'success',
        duration: 1500
      })
      let that = this
      wx.cloud.callFunction({
        name: 'changePwd',
        data: {
          passwd: e.detail.value.wxml_newcode
        },
      })
        this.setData({
        ifchangecode1: false,
        ifchangecode: false,
        button1: true,
      })

    }
    else if (e.detail.value.wxml_newcode != e.detail.value.wxml_newcode1) {
      wx.showToast({
        title: '两次输入需相同！',
        icon: 'none',
        duration: 1500
      })

    }
    else if (e.detail.value.wxml_newcode.length <= 5) {
      wx.showToast({
        title: '密码需要六位',
        icon: 'none',
        duration: 1500
      })

    }
    else {
      wx.showToast({
        title: '未知错误',
        icon: 'none',
        duration: 1500
      })
    }
},
  goRegister: function(){
    if (app.globalData.hasRegister == false) {
      wx.navigateTo({
        url: '../checkPwd/checkPwd',
      })
    }
  },

  goCheck:function(){
    if(app.globalData.hasCheckPwd == false){
      wx.navigateTo({
        url: '../loginPwd/loginPwd',
      })
    }
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
   }
    this.onGetOpenid() 
    
  },

  onShow: function() {
    if(app.globalData.refresh == true){
      this.onGetOpenid()
      app.globalData.refresh == false
      if(app.globalData.hasCheckPwd){
        this.setData({
          ifCheckPwd : true
        })
      }
    }
    if (app.globalData.refreshCheck == true) {
      if (app.globalData.hasCheckPwd) {
        this.setData({
          ifCheckPwd: true
        })
      }
      app.globalData.refreshCheck = false
    }
    if (app.globalData.hasRegister == true){
      db.collection("gaoziqi_test02").where({
        _openid: app.globalData.openid
      }).get().then(res => {
        var that = this
        db.collection('gaoziqi_test02').where({
          _openid: app.globalData.openid
        }).count({success: function(res){
          that.setData({
            passwd_num: res.total
          })
        }})
        
      })
      var cdate = app.globalData.userInfo.date
      var ndate = Date.parse(new Date())
      var fdate = new Date(ndate - cdate)
      this.setData({
        days: fdate.getDate(),
        ifgetdays : true
      })
    }
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数][login]获得用户的openid成功：', res.result.openid)
        app.globalData.openid = res.result.openid
        let that = this;
        wx.cloud.callFunction({
          name: 'check',
          data: {},
          success : res=>{
            console.log('[云函数] [check] 获取用户数据云函数调用成功')
            if (res.result.status == "UserNotFound") {
              console.log("[状态]未获得用户注册数据")
              app.globalData.hasRegister = false
              this.setData({
                ifGetUser: false
              })
            }
            else {
              console.log("[应用状态]成功获取用户注册数据")
              app.globalData.userInfo = res.result.userInfo
              app.globalData.hasRegister = true

              that.setData({
                ifGetUser: true
              })
              if(app.globalData.hasRegister)
              db.collection('gaoziqi_test02').where({
                _openid: app.globalData.openid
              }).count({
                success: function (res) {
                  that.setData({
                    passwd_num: res.total
                  })
                }
              })

            }
            if (app.globalData.hasRegister == false) {
              wx.navigateTo({
                url: '../checkPwd/checkPwd',
              })
            }
            else {
              if (app.globalData.hasCheckPwd == false) {
                wx.navigateTo({
                  url: '../loginPwd/loginPwd',
                })
              }
            }
          },
          fail : err=>{

          }
        })
      },
      fail: err => {
        console.error('[云函数][login]调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  clickMe : function (){
    db.collection("users").where({
      name: "time"
    }).limit(1).get({
      success : function(res){
        console.log(res.data)
      },
      fail : function(err){
        console.log(err)
      }
    })
  },

})
