/*<remove trigger="prod">*/
// import { getBannerData } from '../../lib/api-mock'
/*</remove>*/

/*<jdists trigger="prod">
import {test, test2} from '../../lib/api'
</jdists>*/


import { Base } from '../../utils/base'


class Home extends Base {
  constructor () {
    super()
  }

  getBannerData (id) {
    return getBannerData(id)
  }

  getThemeData () {
    let params = {
      url: '/theme?ids=1,2,3'
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