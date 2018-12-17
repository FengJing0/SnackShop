// pages/product/product.js
import { Product } from "product-model";
import { Cart } from "../cart/cart-model";
var product = new Product();
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    product: {},
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCount: 1,
    tabsArray: ['商品详情', '产品参数', '售后保障'],
    currentTabsIndex: 0,
    cartTotalCounts: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this._loadData();

  },

  _loadData () {
    product.getDetailInfo(this.data.id).then(product => {
      if (product.stock === 0) {
        this.setData({
          productCount: 0
        })
      } else if (product.stock < 10) {
        let arr = []
        for (let i = 1; i <= product.stock; i++) {
          arr.push(i)
        }
        this.setData({
          countsArray: arr
        })
      }
      this.setData({
        product,
        cartTotalCounts: cart.getCartTotalCounts()
      })

    }).catch(err => console.log(err))
  },

  bindPickerChange (e) {
    const index = e.detail.value;
    this.setData({
      productCount: this.data.countsArray[index]
    })
  },

  onTabsItemTap (e) {
    const index = product.getDataSet(e, 'index')
    this.setData({
      currentTabsIndex: index
    })
  },

  onAddingTocartTap (e) {
    this.addToCart()
    this.setData({
      cartTotalCounts: this.data.cartTotalCounts + this.data.productCount
    })
  },

  addToCart () {
    let tempObj = {}
    let keys = ['id', 'name', 'main_img_url', 'price']

    for (let key in this.data.product) {
      if (keys.indexOf(key) !== -1) {
        tempObj[key] = this.data.product[key]
      }
    }

    cart.add(tempObj, this.data.productCount)
  },

  onCartTap () {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },

  onShareAppMessage () {
    return {
      title: '转发',
      path: '/pages/product/product?id='+this.data.product.id,
      imageUrl: this.data.product.main_img_url,
      success (e) {
        wx.showShareMenu({
          withShareTicket: true
        })
      }
    }
  }

})