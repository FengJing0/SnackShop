const BaseUrl = 'http://z.cn/api/v1'

let commonParam = {}

let errCode = {

}



function setCommonParam (param) {
  param = param instanceof Object ? param : {};
  commonParam = Object.assign(commonParam, param);
}

function request (options = {}) {
  let _opt = {
    url: '',
    method: '',
    param: ''
  }
  _opt.param = _opt.param instanceof Object ? _opt.param : {}
  // setCommonParam()
  _opt = Object.assign({}, _opt, options)

  return new Promise((resolve, reject) => {
    // if (!token) {
    //   reject('未获取token')
    // }
    wx.request({
      url: BaseUrl + _opt.url,
      method: _opt.method,
      data: _opt.param,
      header: {
        token:_opt.token
      },
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

module.exports = {
  request
}