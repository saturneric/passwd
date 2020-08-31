//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
//assciated with <scroll-view> in wxml;
var arryHeight = 0;
Page({
  data: {
    flag: '',
    focusKey: true,
    viewlist: [],
    showViewList:[],
    inputValue: '',
    bindlist: [],
    hideScroll: true,
    check1:false,
    check2:false
    
  },
  
  login: function () { 
    this.setData({ check1: app.globalData.hasCheckPwd,
      check2: app.globalData.hasRegister
     })
     if(this.data.check1&&this.data.check2){
       wx.showToast({
         title: '验证成功',
         icon: 'none',
         duration: 1500
       })
      
     }
     else {
       wx.showToast({
         title: '请验证六位密码',
         icon: 'none',
         duration: 1500
       })

     }
    },
  onShow:function(){
    this.setData({ check1: app.globalData.hasCheckPwd, check2: app.globalData.hasRegister })
    var that = this
    var keyId = app.globalData.openid
    var list = []
    db.collection('gaoziqi_test02').where({
      _openid: keyId
    }).get().then(res => {
      list.push(res.data)
      this.setData({
        viewlist: list[0]
      })
      var tshowViewList = []
      for (let i = 0; i < this.data.viewlist.length; i++) {
        let show_user = this.data.viewlist[i].user.substr(0, 12)
        if (this.data.viewlist[i].user.length > 15) {
          show_user += "..."
        }
        tshowViewList.push({
          id : "[ "+this.data.viewlist[i].id+" ]",
          user : show_user
        })
      }
      this.setData({
        showViewList: tshowViewList
      })
    })
    
  },
  onLoad: function(options) {
    
    var that = this;
    var keyId = app.globalData.openid;
    var list = [];
    
    db.collection('gaoziqi_test02').where({
      _openid: keyId
    }).get().then(res => {
      list.push(res.data)
      this.setData({
        viewlist: list[0]
      })
    })
  },
  clickEvent: function (e) {
    var ind = parseInt(e.target.id)
    wx.navigateTo({
      url: '../showPwd/showPwd?hash='+this.data.viewlist[ind].handle+"&&openid="+this.data.viewlist[ind]._openid+"&&user="+this.data.viewlist[ind].user+"&&id="+this.data.viewlist[ind].id+"&&_id="+this.data.viewlist[ind]._id+"&&handle="+this.data.viewlist[ind].handle,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //失焦
  searchBlur: function (e) {
    this.setData({
      focusKey: false
    })
  },
  //聚焦
  searchFocus: function (e) {
  },
  //输入联想，模糊搜索
  inputsearch: function (event) {
    var prefix = event.detail.value
    var newSource=[]
    if (prefix != "") {
      this.data.viewlist.forEach(function (e) {
        if (e.id.indexOf(prefix) != -1) {
          newSource.push(e.id)
        }
      })
    }
    //匹配结果存在，将其返回，否则返回空数组
    if (newSource.length != 0) {
      this.setData({
        //匹配结果存在，显示自动联想词下拉列表
        hideScroll: false,
        bindlist: newSource,
        arrayHeight: newSource.length * 71
      })
    }
    else {
      this.setData({
        //匹配无结果，不显示下拉列表
        hideScroll: true,
        bindlist: []
      })
    }
  },
  itemtap: function(e){
    var item=e.currentTarget.id
    for (let i=0;i<this.data.viewlist.length;i++){
      if(this.data.viewlist[i].id == item){
        item = this.data.viewlist[i]
        break
      }
    }
    this.setData({
      hideScroll: true,
    }),
      console.log("CS", item.handle)
    wx.navigateTo({
        url: '../showPwd/showPwd?hash=' + item.handle + "&&openid=" + item._openid + "&&user=" + item.user + "&&id=" + item.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
  },
  gosearch: function (event) {
    if (event.detail.value) {
      this.setData({
        flag: event.detail.value,
        focusKey: true
      });
      const db = wx.cloud.database();
      db.collection('passwd_saved').where({
        id: event.detail.value
      }).get().then(res => {
      })
    }
    else {
      focusKey: false
    }
  },
  searchButton: function (event) {
    if (this.data.flag) {
    }
    else {
      wx.showToast({
        title: '请输入索引',
        icon: none,
        duration: 1500
      })
    }
  }
})