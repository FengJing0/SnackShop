// components/category/category.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categoryInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap (e) {
      // console.log(e.currentTarget.dataset)
      var myEventDetail = e.currentTarget.dataset
      // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('handleTap', myEventDetail, myEventOption)
    }
  }
})
