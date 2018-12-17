import { Base } from '../../utils/base'

class Home extends Base {
  constructor () {
    super()
  }

  getBannerData (id) {
    let params = {
      url: '/banner/' + id
    }
    return this.request(params).then(res => Promise.resolve(res.items))
  }

  getThemeData () {
    let params = {
      url:'/theme?ids=1,2,3'
    }
    return this.request(params)
  }

  getProductsData () {
    let params = {
      url: '/product/recent'
    }
    return this.request(params)
  }
}
export { Home }