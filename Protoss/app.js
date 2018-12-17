//app.js
import { Token } from "./utils/token";
import { Base } from "./utils/base";
App({
  onLaunch (e) {
    // console.log(e);
    const token = new Token();
    token.verify()
    const base = new Base()
    if (!this.globalData.userInfo) {
      base.checkLogin(this)
    }
    const scene = e.scene
    if (scene == 1044) {
      this.getShareInfo(e)
    }
  },
  globalData: {
    userInfo: null,
    gid:null
  },

  getShareInfo (e) {
    const shareTicket = e.shareTicket
    wx.getShareInfo({
      shareTicket,
      success (e) {
        console.log(e);
        base.request({
          url: '/user',
          type: 'post',
          data: {
            encryptedData: e.encryptedData,
            iv: e.iv
          }
        }).then(res => {
          console.log(res);
        }).catch(err => console.log(err))
      }
    })
  },

  userInfoReadyCallback (userInfo) {
    this.globalData.userInfo = userInfo

  }
})