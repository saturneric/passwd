// miniprogram/pages/checkPwd/checkPwd.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo : false,
    confirmUserInfo : false,
    userInfo : null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getPwdInfo: function(e){
    console.log(e)
    if(e.detail.value.passwd.length < 6){
      wx.showToast({
        title: '独立密码长度要为6位',
        icon: 'none',
        duration: 2000
        })
    }
    else{
      const that = this;
      wx.showModal({
        title: '确认你刚刚输入的密码',
        content: "“"+e.detail.value.passwd+'”，对吗？',
        success: function (res) {
          if (res.confirm) {
            var nowdate = Date.parse(new Date())
            console.log("[云函数]调用createUser")
            wx.cloud.callFunction({
              name: 'createUser',
              data: {
                avatarUrl: that.data.userInfo.avatarUrl,
                city: that.data.userInfo.city,
                gender: that.data.userInfo.gender,
                language: that.data.userInfo.language,
                nickName: that.data.userInfo.nickName,
                openid: app.globalData.openid,
                passwd: String(e.detail.value.passwd),
                date: nowdate
              },
              success: res => {
                wx.showToast({
                  title: '注册成功',
                  icon: 'success',
                  duration: 1500
                })
                app.globalData.hasRegister = true
                app.globalData.refresh = true
                setTimeout(function () { wx.navigateBack() }, 1500)
              },
              fail :err =>{
                console.log(err)
              }
            })
          } 
          else if (res.cancel) {
            wx.showToast({
              title: '我愿意等你',
              icon: 'none',
              duration: 800
            })
          }
        }
      })
      
    }
  },

  confirmUserInfo: function (e) {
    this.setData({
      confirmUserInfo: true,
    })
  },

  userInfoHandler: function (e) { 
    if(e.detail.errMsg == "getUserInfo:ok"){
      this.setData({
        hasUserInfo : true,
        userInfo : e.detail.userInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})