// pages/order/order.js
import { Cart } from "../cart/cart-model";
import { Address } from "../../utils/address"
import { Order } from "order-model";
const cart = new Cart()
const address = new Address()
const order = new Order()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: null,
    productsArr: [],
    orderStatus: 0,
    id: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    const from = options.from

    switch (from) {
      case 'cart':
        this._fromCart(options.account)
        break;
      case 'order':
        this._fromOrder(options.id)
        break;
    }
  },

  _fromCart (account) {
    this.setData({
      account,
      productsArr: cart.getCartDataFromLocal(true)
    })
    address.getAddressInfo().then(res => {
      res.totalDetail = address.setAddressInfo(res)
      this._bindAddressInfo(res)
    }).catch(err => console.log(err))
  },

  _fromOrder (id) {
    if (id > 0) {
      const that = this
      // const id = this.data.id
      order.getOrderInfoById(id)
        .then(data => {
          that.setData({
            orderStatus: data.status,
            productsArr: data.snap_items,
            account: data.total_price,
            basicInfo: {
              orderTime: data.create_time,
              orderNo: data.order_no
            }
          })
          let addressInfo = data.snap_address
          addressInfo.totalDetail = address.setAddressInfo(addressInfo)
          that._bindAddressInfo(addressInfo)
        }).catch(err => console.log(err))

    }
  },

  onShow () {
    if (this.data.id > 0) {
      this._fromOrder(this.data.id)
    }
  },

  editAddress (e) {
    const that = this
    wx.chooseAddress({
      success (res) {
        let addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }

        that._bindAddressInfo(addressInfo)

        address.submitAddress(res).then(res => {
          console.log(res)

        }).catch(err => {
          if (err.data.errorCode !== 0) {
            let msg = err.data.msg
            if (msg instanceof Object) {
              msg = Object.values(msg).join(',')
            }
            address.showTips('操作提示', msg)
          }
        })

      }
    })
  },

  _bindAddressInfo (addressInfo) {
    this.setData({ addressInfo })
  },

  pay () {
    const app = getApp()
    if (!this.data.addressInfo) {
      address.showTips('下单提示', '请填写您的收货地址')
      return
    }
    if (!app.globalData.userInfo) {
      order.checkLogin(app, true)
      return
    }
    if (this.data.orderStatus === 0) {
      this._firstTimePay()
    } else {
      this._oneMoresTimePay()
    }
  },

  _firstTimePay () {
    let orderInfo = [],
      productInfo = this.data.productsArr

    for (let i = 0; i < productInfo.length; i++) {
      orderInfo.push({
        product_id: productInfo[i].id,
        count: productInfo[i].counts
      })
    }

    const that = this

    order.doOrder(orderInfo).then(data => {
      // console.log(data)   
      if (data.pass) {
        const id = data.order_id
        that.setData({ id })
        that._execPay(id)
      } else {
        that._orderFail(data)
      }
    }).catch(err => console.log(err))
  },

  _execPay (id) {
    const that = this
    order.execPay(id)
      .then(statusCode => {
        if (statusCode !== 0) {
          that.deleteProducts()
          let flag = statusCode === 2
          wx.navigateTo({
            url: `../pay-result/pay-result?id=${id}&flag=${flag}&from=order`
          })
        }
      })
      .catch(err => console.log(err))
  },


  //将已经下单的商品从购物车删除
  deleteProducts () {
    var ids = [], arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  },

  /*
        *下单失败
        * params:
        * data - {obj} 订单结果信息
        * */
  _orderFail (data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success (res) {

      }
    });
  },

})