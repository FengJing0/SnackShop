// pages/theme/theme.js
import {Theme} from 'theme-model';
var theme = new Theme()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    name:'',
    themeInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      name:options.name
    })
    this._loadData()
  },

  onReady(){
    wx.setNavigationBarTitle({
      title:this.data.name
    })
  },

  _loadData(){
    theme.getProductsData(this.data.id).then(themeInfo=>this.setData({themeInfo})).catch(err=>console.log(err));
  },

  onProductsItemTap(e){
    const id = e.detail.id
    wx.navigateTo({
      url:"../product/product?id="+id
    })
  }
})