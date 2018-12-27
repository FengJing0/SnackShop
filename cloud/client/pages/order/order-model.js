import { Base } from "../../utils/base";

class Order extends Base {
  constructor () {
    super()
    this._storageKeyName = 'newOrder'
  }

  doOrder (param) {
    const that = this
    let allParams = {
      url: '/order',
      type: 'post',
      data: { products: param }
    }
    return this.request(allParams).then(res => {
      that.execSetStorageSync(true)
      return Promise.resolve(res)
    })
  }

  execSetStorageSync (data) {
    wx.setStorageSync(this._storageKeyName, data)
  }

  /**
   * 0 商品缺货等原因导致订单不能支付，1 支付失败或者支付取消，2 支付成功
   */
  execPay (orderNumber) {
    let allParams = {
      url: '/pay/pre_order',
      type: 'post',
      data: { id: orderNumber }
    }
    return this.request(allParams).then(data => {
      let timeStamp = data.timeStamp
      return new Promise((resolve, reject) => {
        if (timeStamp) {
          wx.requestPayment({
            'timeStamp': timeStamp.toString(),
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            success (res) {
              console.log(res);

              resolve(2)
            },
            fail (err) {
              console.log(err);

              resolve(1)
            }
          })
        } else {
          resolve(0)
        }
      })
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(err))

    })
  }

  getOrderInfoById (id) {
    return this.request({
      url: '/order/' + id
    })
  }

  /*获得所有订单 */
  getOrders (pageIndex) {
    return this.request({
      url: '/order/by_user',
      data: { page: pageIndex },
      type:'get'
    })
  }

  hasNewOrder () {
    const flag = wx.getStorageSync(this._storageKeyName)
    return flag === true
  }
}

export { Order }