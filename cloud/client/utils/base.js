import { Config } from './config';
import { Token } from "./token";

class Base {
  constructor () {
    this.baseRequestUrl = Config.restUrl
    this.refetchCount = 0
  }


  // 当noRefetch为true时，不做未授权重试机制
  request (params, noRefetch) {
    const token = wx.getStorageSync('token')
    const that = this
    let url = this.baseRequestUrl + params.url
    if (!params.type) {
      params.type = 'GET'
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data: params.data,
        method: params.type,
        header: {
          'content-type': 'application/json',
          token
        },
        success (res) {
          const code = res.statusCode.toString();
          const startChar = code.charAt(0)
          if (startChar === '2') {
            resolve(res.data)
          } else {
            if (code == '401') {
              if (!noRefetch) {
                that._refetch(params)
                  .then(res => resolve(res))
                  .catch(err => reject(err))
              }
            }
            noRefetch && reject(res)
          }
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }

  _refetch (params) {
    const token = new Token()
    return token.getTokenFromServer()
      .then(token => {
        return this.request(params, true)
          .then(res => Promise.resolve(res))
          .catch(err => Promise.reject(err))
      }).catch(err => Promise.reject(err))
  }

  getDataSet (e, key) {
    return e.currentTarget.dataset[key]
  }


  /**
   * @param title 标题
   * @param content 内容
   * @param flag 是否需要跳转
   * @param url
   * @param tab 是否是tabUrl
   */
  showTips (title, content, flag, url, tab) {
    wx.showModal({
      title,
      content,
      showCancel: false,
      success (res) {
        if (flag) {
          if (tab) {
            wx.switchTab({
              url
            })
          } else {
            wx.navigateTo({
              url
            })
          }

        }
      }
    })
  }

  checkLogin (app, flag) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res.userInfo)
              }
            }
          })
        } else if (flag) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
}

export { Base }