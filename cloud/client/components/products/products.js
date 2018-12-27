// components/products/products.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productsArr: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
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
