// miniprogram/pages/loginPwd/loginPwd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mover: "data animated bounce",
    pwd : ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow:function(options){

  },

  getPwdInfo: function(e) {
    let that = this
    wx.cloud.callFunction({
      name: 'checkPwd',
      data: {
        passwd: e.detail.value.passwd
      },
      success: res => {
        if(res.result.status == "success"){
          console.log("[云函数][checkPwd]执行密码哈希验证方式成功")
          wx.showToast({
            title: '验证成功',
            icon: 'success',
            duration: 800
          })
          app.globalData.hasCheckPwd = true
          app.globalData.refreshCheck = true
          setTimeout(function () { wx.navigateBack() }, 800)
        }
        else {
          console.log("[云函数][checkPwd]执行密码哈希验证方式失败")
          if (that.data.mover == "data animated shake"){
            that.setData({
              mover: "",
            })
            that.setData({
              mover: "data animated shake",
              pwd: ""
            })
          }
          else{
            that.setData({
              mover: "data animated shake",
              pwd: ""
            })
          }
          
          app.globalData.hasCheckPwd = false
        }
      },
      fail: err => {
        console.log(err)
      }
    })
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