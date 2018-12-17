// pages/category/category.js
import { Category } from "category-model";
var category = new Category();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryTypeArr: [],
    currentCategoryTypeIndex: 0,
    categoryProducts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this._loadData()
  },

  _loadData () {
    category.getCategoryType().then(categoryTypeArr => {
      this.setData({ categoryTypeArr })
      return Promise.resolve(categoryTypeArr[0])
    }).then(categoryType => {
      this.getProducts(categoryType)
    }).catch(err => console.log(err))


  },

  getProducts (categoryType) {
    category.getProductsByCategory(categoryType.id).then(res => {
      let categoryProducts = {
        products: res,
        topImgUrl: categoryType.img.url,
        title: categoryType.name,
      }
      this.setData({ categoryProducts })
    }).catch(err => console.log(err))
  },

  onCategoryTypeTap (e) {
    const index = category.getDataSet(e, 'index')
    if (index !== this.data.currentCategoryTypeIndex) {
      this.setData({
        currentCategoryTypeIndex: index
      })
      this.getProducts(this.data.categoryTypeArr[index])
    }
  },

  onProductsItemTap (e) {
    const id = e.detail.id
    wx.navigateTo({
      url: "../product/product?id=" + id
    })
  },
})