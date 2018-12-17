//index.js
//获取应用实例
const app = getApp()

import { request } from "../../utils/http";

Page({
  data: {
  },
  onLoad: function () {
  },
  getToken () {
    wx.login({
      success (res) {
        if (res.code) {
          let code = res.code
          console.log('code:' + code)
          request({
            url: '/token/user',
            method: 'post',
            param: {
              code
            }
          }).then(res => {
            wx.setStorageSync('token', res.token);
            console.log(res)
          })
          //发起网络请求
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },
  order () {
    let that = this
    let token = wx.getStorageSync('token')
    request({
      url: '/order',
      method: 'post',
      param: {
        products: [
          { product_id: 2, count: 2 },
          { product_id: 3, count: 3 },
        ]
      },
      token
    }).then(res => {
      console.log(res)
      if (res.pass) {
        wx.setStorageSync('order_id', res.order_id)
        that.getPreOrder(token, res.order_id)
      } else {
        console.log('订单未创建成功');

      }
    })
  },
  getPreOrder (token, orderID) {
    if (token) {
      request({
        url: '/pay/pre_order',
        method: 'post',
        param: {
          id: orderID
        },
        token
      }).then(res => {
        console.log(res);
        if (!res['errorCode']) {
          wx.requestPayment({
            timeStamp: res.timeStamp.toString(),
            nonceStar: res.nonceStar,
            package: res.package,
            SingType: res.SingType,
            paySign: res.paySign,
            success (res) {
              console.log(res)
            },
            fail (err) {
              console.log(err);
            }
          })
        }
      })
    }
  }
})
