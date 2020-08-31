var app = getApp()
Page({
  data: {
    user : ""
  },
  onLoad: function(option){
    this.setData({
      user: option.textdata,
    })
  },
  inputSaver: function(e){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  
    prevPage.setData({
      user : e.detail.value
    })
  }

})