import { getBannerData, getThemeData,getProductsData } from '../../lib/api'

import { Home } from "index-model";
var home = new Home();
Page({
  data: {
    bannerArr: [],
    themeArr: [],
    productsArr: []
  },
  //事件处理函数
  onLoad: function () {
    this._loadData();
  },

  _loadData () {
    var id = 1;
    getBannerData(id).then(res => {
      this.setData({ bannerArr: res.result })
    }).catch(err => {
      console.log(err)
    })

    getThemeData().then(res => {
      this.setData({ themeArr: res.result })
    }
    ).catch(err => {
      console.log(err)
    })

    getProductsData().then(res =>{
      this.setData({ productsArr: res.result })
    }).catch(err => {
      console.log(err)
    })
  },

  onProductsItemTap (e) {
    const id = e.detail.id ? e.detail.id : home.getDataSet(e, 'id')
    wx.navigateTo({
      url: "../product/product?id=" + id
    })
  },

  onThemesItemTap (e) {
    const id = home.getDataSet(e, 'id')
    const name = home.getDataSet(e, 'name')
    wx.navigateTo({
      url: `../theme/theme?id=${id}&name=${name}`
    })
  }
})
