/*<jdists import="../../inline/utils.js" />*/

function getBannerData (id) {
  return db.collection('banner_item')
    .where({
      banner_id: id
    })
    .field({
      "banner_id": true,
      "id": true,
      "img_id": true,
      "key_word": true,
      "type": true,
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

exports.main = async (event, context) => {
  const { id } = event
  let result = []
  await getBannerData(id).then(res => {
    result = res.data
  })
  for (let i = 0; i < result.length; i++) {
    await getBannerImg(result[i]['img_id']).then(res => {
      let item = res.data[0]
      if (item.from === 1) {
        result[i]['imgUrl'] = baseUrl + item.url
      }
    })
  }


  // console.log(result);

  return result
}
