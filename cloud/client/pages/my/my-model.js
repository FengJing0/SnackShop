import { Base } from "../../utils/base";

class My extends Base {
  constructor () {
    super()
  }

  getUserInfo () {
    const that = this
    wx.login({
      success () {
        wx.getUserInfo({
          success (res) {
            console.log(res);

          }
        })
      }
    })
  }
}

export { My }