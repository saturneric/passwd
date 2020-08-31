//index.js
//获取应用实例
const app = getApp()
const db=wx.cloud.database()

Page({
  data: {
      id:"",
      user:"",
      scode:"",
      handle:"",
      usershow:"",
      tagclass: "pass-ipt-plus",
      ifusershow : false,
      passwdclass : "pass-ipt",
      isscode:false,   //是否为系统生成密码
      scode_0:"" ,   //复制
        argv:{ 
          length: 8,
          hasUpper: true,
          hasSpecial: false,
          specialChar: ["@", "#", "!"]
        },
      len_array: ['短密码（6位）', '中等长度密码（8位）', '长密码（12位）','超长密码（16位）'],
      len_objectArray: [
        {
          id: 0,
          name: '短密码（6位）'
        },
        {
          id: 1,
          name: '中等长度密码（8位）'
        },
        {
          id: 2,
          name: '长密码（12位）'
        },
        {
          id: 3,
          name: '超长密码（16位）'
        },
      ],
      len_index : 1,
      upper_array: ['可以有大写字母', '没有大写字母'],
      upper_objectArray: [
        {
          id: 0,
          name: '可以有大写字母'
        },
        {
          id: 1,
          name: '没有大写字母'
        },
      ],
      upper_index: 0,
      special_array: ['可以有特殊字符', '没有特殊字符'],
      special_objectArray: [
        {
          id: 0,
          name: '可以有特殊字符'
        },
        {
          id: 1,
          name: '没有特殊字符'
        },
       ],
      special_index: 1,
      if_generate : false,
      id_tag : ""
  }, 

  onShow: function(){
    if(this.data.user.length > 12){
      let user = this.data.user
      user = user.substr(0,12)
      user += "..."
      this.setData({
        usershow: user,
      })
    }
    else{
      this.setData({
        usershow: this.data.user
      })
    }
  },

  goShow: function(){
    wx.navigateTo({
      url: '../show/show?textdata='+this.data.user,
    })
  },

  buttonShow: function(){

  },
  
  bindLenPickerChange: function (e) {
    var targv = this.data.argv
    if (e.detail.value == 0) targv.length = 6
    else if (e.detail.value == 1) targv.length = 8
    else if (e.detail.value == 2) targv.length = 12
    else if (e.detail.value == 3) targv.length = 16
    this.setData({
      argv: targv,
      len_index: e.detail.value
    })
  },
  bindUpperPickerChange: function (e) {
    var targv = this.data.argv
    if (e.detail.value == 0) targv.hasUpper = true
    else targv.hasUpper = false
    this.setData({
      argv : targv,
      upper_index: e.detail.value
    })
  },
  bindSpecialPickerChange: function (e) {
    var targv = this.data.argv
    if (e.detail.value == 0) targv.hasSpecial = true
    else targv.hasSpecial = false
    this.setData({
      argv: targv,
      special_index: e.detail.value
    })
  },

  
  scan : function(){
    const that = this
    wx.scanCode({
      success: (res) => {
        this.data.user = res.result
        if (this.data.user.length > 18) {
            let user = this.data.user
            user = user.substr(0, 16)
            user += "..."
            this.setData({
              usershow: user,
            })
          }
          else {
            this.setData({
              usershow: this.data.user
            })
          }
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
       },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  
  confirm:function(e){
    if (app.globalData.hasCheckPwd == true && app.globalData.hasRegister == true) {
      
      if (e.detail.value.wxml_id.length == 0){
        this.setData({id_tag : "请填写密码标签"})
        let that = this
        setTimeout(function (){that.setData({
          tagclass: "pass-ipt-plus animated bounceIn",
          id_tag: ""
        })},2000)
        return;
      }
      else{
        this.setData({
          id_tag: ""
        })
      }
      this.setData({
        id: e.detail.value.wxml_id,
        user: this.data.user,
        scode: e.detail.value.wxml_scode
      })
      if (this.data.scode_0 != this.data.scode)
        this.setData({
          isscode: false
        })

      //上传上传上传上传上传上传上传上传上传上传上传
      var ifhave=false
      let that=this
      db.collection('gaoziqi_test02').limit(1).where({
        _openid: app.globalData.openid,
        id:this.data.id
      })
        .get().then(res => {
          if(res.data.length>0){
            ifhave=true
            wx.showToast({
              title: '标题和已有标题重复，请重新输入',
               icon: 'none',
              duration: 2000
            })
            
          }
          else {
            db.collection('gaoziqi_test02').add({
              data: {
                id: this.data.id,
                handle: this.data.handle,
                user: this.data.user,
                argv: this.data.argv,
                isscode: this.data.isscode
              },
            })
          }
          if(ifhave==false){
            if (this.data.isscode == false) {
            wx.cloud.callFunction({
              name: "passwd",
              data: {
                method: "customer",
                argv: {
                  handle: this.data.handle,
                  openid: app.globalData.openid,
                  tag: this.data.id,
                  passwd:this.data.scode
                }

              },
              complete: res => {
                console.log(res)
                if (res.result.status == "ok") {
                  console.log("[云函数][passwd]customer方法执行密码参数绑定成功")
                }
              }
            })
           }
          else {
            wx.cloud.callFunction({
              name: "passwd",
              data: {
                method: "saver",
                argv: {
                  handle: this.data.handle,
                  openid: app.globalData.openid,
                  tag: this.data.id
                }
              },
              complete: res => {
                if (res.result.status == "ok") {
                  console.log("[云函数][passwd]saver方法执行密码参数绑定成功")
                }
              }
            })
          }
          this.setData({
            id : "",
            user : "",
            scode : "",
            usershow : "",
            if_generate: false
          })
          wx.showToast({
            title: '密码添加成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  else {
      wx.showToast({
        title: '认证六位独立密码',
        icon: 'none',
        duration: 1500
      })
  }
  
},

give_scode: function () {
    if (app.globalData.hasCheckPwd == true && app.globalData.hasRegister == true){
      wx.showToast({
        title: '努力生成密码',
        icon: 'loading',
        duration: 1000
      })
      if (this.data.passwdclass == "pass-ipt animated bounceIn") {
        this.setData({
          passwdclass: "pass-ipt",
          scode: "",
          scode_0: ""
        })
      }
      wx.cloud.callFunction({
        name: 'passwd',
        data: {
          method : "encoder",
          argv: this.data.argv
        },
        complete:res=>{
          console.log("[云函数][passwd]encoder方法调用成功")
          this.setData({
            scode: res.result.passwd,
            scode_0: res.result.passwd,
            handle: res.result.handle,
            isscode: true,
            if_generate : true
            })
            this.setData({
              passwdclass: "pass-ipt animated bounceIn",
            })
        },
      })
    }
    else{
      wx.showToast({
        title: '未认证六位密码',
        icon: 'none',
        duration: 1500
      })
    }
  },
  onShareAppMessage: function () {

  }
})

