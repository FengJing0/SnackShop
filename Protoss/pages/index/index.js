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
    home.getBannerData(id).then(bannerArr => {
      this.setData({ bannerArr })
    }).catch(err => {
      console.log(err)
    })

    home.getThemeData().then(themeArr =>
      this.setData({ themeArr })
    ).catch(err => {
      console.log(err)
    })

    home.getProductsData().then(productsArr =>
      this.setData({ productsArr })
    ).catch(err => {
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
