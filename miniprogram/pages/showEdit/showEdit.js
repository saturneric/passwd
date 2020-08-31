// miniprogram/pages/showEdit/showEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    count: 0,
    tmaxlength : 140
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.count == 1){
      this.setData({
        tmaxlength: 14
      })
    }
    this.setData({
      content: options.content,
      count: options.count
    })
  },
  inputSaver: function (e) {
    let pages = getCurrentPages();
    console.log("aaaaa", pages.length)
    let prevPage = pages[pages.length - 2];
    if(this.data.count == 1)
      prevPage.setData({
        id: e.detail.value,
        changeId: true,
        if_changed: true,

      })
    else if(this.data.count == 2)
      prevPage.setData({
        user: e.detail.value,
        changeUser: true,
        if_changed: true,
      })
    else if(this.data.count == 3)
      prevPage.setData({
        changPPPWD: e.detail.value,
        passwd: e.detail.value,
        changePwd: true
      })
  },
  confirmFunc: function(){
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    wx.navigateBack({
      success: res=>{
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