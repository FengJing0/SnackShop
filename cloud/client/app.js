//app.js
import { Token } from "./utils/token";
import { Base } from "./utils/base";
App({
  onLaunch: function() {
    wx.cloud.init({
      env: 'cloudminiapp-579a16', // 前往云控制台获取环境id
      traceUser: true //是否要捕捉每个用户的访问记录。设置为true，用户可在管理端看到用户访问记录
    })

    const token = new Token();
    token.verify()
    const base = new Base()
    if (!this.globalData.userInfo) {
      base.checkLogin(this)
    }
  },
  globalData: {
    userInfo: null
  }
})
