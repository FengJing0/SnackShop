// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getuserInfo (res) {
    // 判断是否获得授权
    if (res.detail.userInfo) {
      wx.navigateBack()
      app.globalData.userInfo = res.detail.userInfo
    }
  },
})