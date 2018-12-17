import { Base } from '../../utils/base'

class Product extends Base {
  constructor () {
    super()
  }

  getDetailInfo (id) {
    let params = {
      url: '/product/' + id
    }
    return this.request(params)
  }
}
export { Product }