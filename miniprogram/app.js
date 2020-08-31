//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: "ipasswd-7h7iu"
      })
    }

    this.globalData = {
      hasCheckPwd : false,
      hasRegister : null,
      openid : null,
      refresh : false,
      refreshCheck: false
    }
  }
})
