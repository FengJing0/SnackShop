import { Base } from '../../utils/base'

class Theme extends Base {
  constructor () {
    super()
  }

  getProductsData (id) {
    let params = {
      url: '/theme/' + id
    }
    return this.request(params)
  }

  // getThemeData () {
  //   let params = {
  //     url:'/theme?ids=1,2,3'
  //   }
  //   return this.request(params)
  // }

  // getProductsData () {
  //   let params = {
  //     url: '/product/recent'
  //   }
  //   return this.request(params)
  // }
}
export { Theme }