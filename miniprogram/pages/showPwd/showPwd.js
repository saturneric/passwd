// miniprogram/pages/showPwd/showPwd.js
const db = wx.cloud.database()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    handle: '',
    _openid: '',
    _hash: '',
    passwd: '',
    _id: '',
    id: '',
    user: '',
    changPPPWD :"",
    changePwd: false,
    changeId: false,
    changeUser:  false,
    mHidden: true,
    if_changed: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _hash: options.hash,
      _openid: options.openid,
      id: options.id,
      _id: options._id,
      user: options.user,
      handle: options.handle
    })
    //this.showPwd()
  },
  copyPwd: function(){
    wx.setClipboardData({
    data: this.data.passwd,
    success: function(res) {
      wx.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 1000
      })
    }
    })
  },
  onShow: function(){
    if (this.data.changePwd) {
      wx.cloud.callFunction({
        name: "passwd",
        data: {
          method: "deleter",
          argv: {
            handle: this.data._hash,
            openid: this.data._openid
          }
        },
        success: res => {
        }
      })
      wx.cloud.callFunction({
        name: "passwd",
        data: {
          method: "customer",
          argv: {
            handle: this.data._hash,
            openid: this.data._openid,
            tag: this.data.id,
            passwd: this.data.changPPPWD
          }
        }
      })
    }
    if(this.data.if_changed){
      db.collection('gaoziqi_test02').doc(this.data._id).update({
        data: {
          id: this.data.id,
          handle: this.data._hash,
          user: this.data.user
        },
        complete: res => {
          console.log("更新数据库信息成功")
        }
      })
    }
    if (this.data.if_changed || this.data.passwd == ''){
      this.showPwd()
    }
    this.setData({
      if_changed: false
    })
  },
  confirmFunc: function(e){
    this.cancel()
    this.setData({
      mHidden: true
    })
  },
  cancelFunc: function(e){
    this.setData({
      mHidden: true
    })
  },
  clickCancel: function(){
    /*this.setData({
      mHidden: false
    })*/
    let that = this
    wx.showModal({
      title: '你要删除这条标签对吗？',
      content: "“" + "你确定删.除.这.条.标.签" + '”，对吗？',
      success: function (res) {
        if (res.confirm) {
          that.confirmFunc()
        }
        else{

        }
      }
    })
  },
  cancel: function(e){
    wx.cloud.callFunction({
      name: "passwd",
      data: {
        method: "deleter",
        argv: {
          handle: this.data._hash,
          openid: app.globalData.openid
        }
      },
      complete: res=>{
        console.log(res)
        if(res.result.status == "ok"){
          console.log("[云函数][passwd]deleter方法成功删除便签关联密码")
        }
      }
    })
    db.collection('gaoziqi_test02').doc(this.data._id).remove({
      success: res => {
        this.setData({
          handle: '',
          _openid: '',
          passwd: '',
          id: '',
          _id: '',
          user: '',
        })
      },
    })
    wx.navigateBack({
      success: res=>{ 
        wx.showToast({
          title: '删除成功',
          duration: 1000
        })
      }
    })
  },
  showPwd:function(res){
    wx.cloud.callFunction({
      name : "passwd",
      data : {
        method : "decoder",
        argv : {
          handle : this.data._hash,
          openid : this.data._openid
        }
      },
      success: res=>{
        if (res.result.status == "ok") {
          console.log("[云函数][passwd]decoder方法成功解密用户密码")
        }
        this.setData({
          passwd:res.result.passwd
        })
      },
      fail: err=>{
      }
    })

  },
  tapEdit:function(e){
    var content = e.target.id
    var count = e.currentTarget.dataset.experienced
    wx.navigateTo({
      url:'../showEdit/showEdit?content='+content+'&&count='+count,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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