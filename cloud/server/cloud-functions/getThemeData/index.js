// 云函数入口文件

/*<jdists import="../../inline/utils.js" />*/

function getTheme (id) {
  return db.collection('theme')
    .field({
      "description": true,
      "id": true,
      "head_img_id": true,
      "name": true,
      "topic_img_id": true,
    })
    .get()
}

function getBannerImg (id) {
  return db.collection('image')
    .where({
      id
    })
    .field({
      "from": true,
      "id": true,
      "url": true,
    })
    .get()
}



// 云函数入口函数
exports.main = async (event, context) => {
  let result = []
  await getTheme().then(res => {
    result = res.data
  })

  for (let i = 0; i < result.length; i++) {
    await getBannerImg(result[i]['topic_img_id']).then(res => {
      let item = res.data[0]
      if (item.from === 1) {
        result[i]['head_img_url'] = baseUrl + item.url
      }
    })
    await getBannerImg(result[i]['topic_img_id']).then(res => {
      let item = res.data[0]
      if (item.from === 1) {
        result[i]['topic_img_url'] = baseUrl + item.url
      }
    })
  }


  return result
}