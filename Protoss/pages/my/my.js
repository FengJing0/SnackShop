// pages/my/my.js
import { My } from "my-model";
import { Address } from "../../utils/address";
import { Order } from "../order/order-model";
const my = new My()
const address = new Address()
const order = new Order()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndexs: 1,
    userInfo: {
      avatarUrl: '../../imgs/icon/user@default.png',
      nickName: '零食小贩',
      default: true
    },
    orderArr: [],
    isLoadedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
    this._getAddressInfo()
  },

  onShow () {
    this._setUserInfo()
    const newOrderFlag = order.hasNewOrder()
    if (newOrderFlag) {
      this.refresh()
    }
  },

  _loadData () {
    this._checkUserInfo()
    this._getOrders()
  },

  _getOrders (cb) {
    order.getOrders(this.data.pageIndexs).then(res => {
      let data = res.data
      if (data.length > 0) {
        let orderArr = this.data.orderArr
        orderArr.push(...data)
        this.setData({ orderArr })
      } else {
        this.setData({
          isLoadedAll: true
        })
      }
      cb && cb()
    }).catch(err => console.log(err))
  },

  _getAddressInfo () {
    address.getAddressInfo().then(res => {
      this._bindAddressInfo(res)
    }).catch(err => console.log(err))
  },

  _bindAddressInfo (addressInfo) {
    this.setData({ addressInfo })
  },

  checkUserInfo () {
    if (this.data.userInfo.default) {
      this._checkUserInfo()
    }
  },

  _setUserInfo () {
    if (this.data.userInfo.default && app.globalData.userInfo) {
      this.setData({
        userInfo: {
          default: false,
          ...app.globalData.userInfo
        }
      })
    }
  },

  _checkUserInfo () {
    if (!app.globalData.userInfo) {
      my.checkLogin(getApp(), true)
    }
    this._setUserInfo()
  },

  onReachBottom () {
    if (!this.data.isLoadedAll) {
      this.setData({
        pageIndexs: this.data.pageIndexs + 1
      })
      this._getOrders()
    }
  },

  showOrderDetailInfo (e) {
    const id = order.getDataSet(e, 'id')
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    })
  },

  rePay (e) {
    const id = order.getDataSet(e, 'id')
    const index = order.getDataSet(e, 'index')
    this._execPay(id, index)
  },

  _execPay (id, index) {
    const that = this

    order.execPay(id).then(statusCode => {
      if (statusCode > 0) {
        const flag = statusCode === 2

        if (flag) {
          that.data.orderArr[index].status = 2
          that.setData({
            orderArr: that.data.orderArr
          })
        }

        wx.navigateTo({
          url: `../pay-result/pay-result?id=${id}&flag=${flag}&from=my`
        })
      } else {
        order.showTips('支付失败', '商品下架或库存不足')
      }
    }).catch(err => console.log(err))
  },

  refresh () {
    const that = this
    this._getOrders(() => {
      that.setData({
        orderArr: [],
        pageIndexs: 1,
        isLoadedAll: false
      })
      
      order.execSetStorageSync(false)
    })
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
  }
})