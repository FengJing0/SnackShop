import { Config } from './config';
class Token {
  constructor () {
    this.baseRequestUrl = Config.restUrl
  }

  verify () {
    let token = wx.getStorageSync('token')
    if (!token) {
      this.getTokenFromServer()
    } else {
      this._veirfyFromServer(token)
    }
  }

  getTokenFromServer () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: this.baseRequestUrl + '/token/user',
            data: {
              code: res.code
            },
            method: 'post',
            header: {
              'content-type': 'application/json'
            },
            success (res) {
              if (res.statusCode === 200) {
                const token = res.data.token
                wx.setStorageSync('token', token)
                resolve(token)
              } else {
                reject(res)
              }
            },
            fail (err) {
              console.log(err)
              reject(err)
            }
          })

        }
      })
    })
    
  }

  _veirfyFromServer (token) {
    const that = this
    wx.request({
      url: this.baseRequestUrl + '/token/verify',
      data: {token},
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        let valid = res.data.isValid
        if (!valid) {
          that.getTokenFromServer()
        }
      },
      fail (err) {
        console.log(err)
      }
    })
  }
}

export { Token }