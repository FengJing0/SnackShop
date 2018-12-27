// 云函数入口文件

/*<jdists import="../../inline/utils.js" />*/


function getProduct () {
  return db.collection('product')
    .orderBy('create_time','desc')
    .limit(10)
    .field({
      "category_id": true,
      "id": true,
      "img_id": true,
      "main_img_url": true,
      "name": true,
      "price": true,
      "stock": true,
    })
    .get()
}

// 云函数入口函数
exports.main = async (event, context) => {
  let result = []
  await getProduct().then(res => {
    result = res.data.map(e=>{
      e.main_img_url = baseUrl + e.main_img_url
      return e
    })
  })


  return result
}