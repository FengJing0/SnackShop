import { Base } from "base";
import { Config } from "config";

class Address extends Base {
  constructor () {
    super()
  }

  setAddressInfo (res) {
    let province = res.provinceName || res.province,
      city = res.cityName || res.city,
      country = res.countyName || res.country,
      detail = res.detailInfo || res.detail

    let totalDetail = city + country + detail

    if (!this.isCenterCity(province)) {
      totalDetail = province + totalDetail
    }

    return totalDetail
  }

  getAddressInfo () {
    const that = this
    let param = {
      url: '/address'
    }
    return this.request(param)
  }

  isCenterCity (name) {
    const centerCitys = ['北京市', '天津市', '上海市', '重庆市']
    return centerCitys.indexOf(name) !== -1
  }

  submitAddress (data) {
    data = this._setAddress(data)
    let param = {
      url: '/address',
      type: 'post',
      data
    }
    return this.request(param)
  }

  _setAddress (res) {
    return {
      name: res.userName,
      province: res.provinceName,
      city: res.cityName,
      country: res.countyName,
      mobile: res.telNumber,
      detail: res.detailInfo
    }
  }
}

export { Address }