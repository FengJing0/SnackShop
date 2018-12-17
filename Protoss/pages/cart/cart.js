// pages/cart/cart.js
import { Cart } from "cart-model";
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartData: null,
    selectedCounts: 0,
    selectedTypeCounts: 0,
    account: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
  },

  onHide () {
    cart.execSetStorageSync(this.data.cartData)
  },

  onShow () {
    this._loadData()
  },

  _loadData () {
    let cartData = cart.getCartDataFromLocal()
    let cal = this._calcTotalAccountAndCounts(cartData)
    this.setData({
      cartData,
      ...cal
    })
  },

  toggleSelect (e) {
    const id = cart.getDataSet(e, 'id')
    const status = cart.getDataSet(e, 'status')
    const index = this._getProductIndexById(id)
    this.data.cartData[index].selectStatus = !status
    this._resetCartData()
  },

  toggleSelectAll (e) {
    const status = cart.getDataSet(e, 'status')
    this.data.cartData.forEach(e => {
      e.selectStatus = !status
    });
    this._resetCartData()
  },

  changeCounts (e) {
    const id = cart.getDataSet(e, 'id')
    const type = cart.getDataSet(e, 'type')
    const index = this._getProductIndexById(id)
    let counts = 1

    if (type === 'add') {
      cart.addCounts(id)
    } else {
      if (this.data.cartData[index].counts === 1) {
        return
      }
      counts = -1
      cart.cutCounts(id)
    }

    this.data.cartData[index].counts += counts
    this._resetCartData()
  },

  delete (e) {
    const id = cart.getDataSet(e, 'id')
    const index = this._getProductIndexById(id)

    this.data.cartData.splice(index, 1)

    this._resetCartData()

    cart.delete(id);  //内存中删除该商品

  },

  submitOrder () {
    wx.navigateTo({
      url: `../order/order?account=${this.data.account}&from=cart`
    })
  },

  _resetCartData () {
    let newData = this._calcTotalAccountAndCounts(this.data.cartData)
    this.setData({
      cartData: this.data.cartData,
      ...newData
    })
  },

  _getProductIndexById (id) {
    const data = this.data.cartData
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return i
      }
    }
  },

  _calcTotalAccountAndCounts (data) {
    let account = 0,
      multiple = 100,
      selectedCounts = 0,
      selectedTypeCounts = 0

    for (let item of data) {
      if (item.selectStatus) {
        account = item.price * multiple * item.counts * multiple + account
        selectedTypeCounts++
        selectedCounts += item.counts
      }
    }
    return {
      account: (account / multiple / multiple).toFixed(2),
      selectedCounts,
      selectedTypeCounts
    }
  }
})