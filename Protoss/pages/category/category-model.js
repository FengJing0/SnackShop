import { Base } from '../../utils/base'

class Category extends Base {
  constructor () {
    super()
  }

  getCategoryType () {
    let params = {
      url: '/category/all'
    }
    return this.request(params)
  }

  getProductsByCategory (id) {
    let params = {
      url: '/product/by_category?id='+id
    }
    return this.request(params)
  }
}
export { Category }