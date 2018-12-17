import { Base } from '../../utils/base'

class Cart extends Base {
  constructor () {
    super()
    this._storageKeyName = 'cart'
  }

  add (item, counts) {
    let cartData = this.getCartDataFromLocal()
    let isHasInfo = this._isHasThatOne(item.id, cartData)

    if (isHasInfo.index === -1) {
      item.counts = counts
      item.selectStatus = true
      cartData.push(item)
    } else {
      cartData[isHasInfo.index].counts += counts
    }

    wx.setStorageSync(this._storageKeyName, cartData)

  }

  getCartDataFromLocal (flag) {
    let res = wx.getStorageSync(this._storageKeyName) || []
    
    if (flag) {
      let newRes = []
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i])
        }
      }
      res = newRes
    }
    
    return res 
  }

  execSetStorageSync (cartData) {
    wx.setStorageSync(this._storageKeyName, cartData)
  }

  getCartTotalCounts (flag) {
    let data = this.getCartDataFromLocal()
    let counts = 0

    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts += data[i].counts
        }
      } else {
        counts += data[i].counts
      }
    }

    return counts
  }

  _isHasThatOne (id, arr) {
    let item
    let result = { index: -1 }
    for (let i = 0; i < arr.length; i++) {
      item = arr[i]
      if (item.id === id) {
        result = {
          index: i,
          data: item
        }
        break;
      }
    }
    return result;
  }

  getCartTotalCounts () {
    let data = this.getCartDataFromLocal()
    let counts = 0
    for (let i = 0; i < data.length; i++) {
      counts += data[i].counts
    }
    return counts
  }

  addCounts (id) {
    this._changCounts(id,1)
  }

  cutCounts (id) {
    this._changCounts(id, -1)
  }

  _changCounts (id, counts) {
    let cartData = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(id, cartData)
    if (hasInfo.index !== -1) {
      if (hasInfo.data.counts > 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    this.execSetStorageSync(cartData)
  }

  /*
    * 删除某些商品
    */
  delete (ids) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);  //删除数组某一项
      }
    }
    this.execSetStorageSync(cartData);
  }
}

export { Cart }