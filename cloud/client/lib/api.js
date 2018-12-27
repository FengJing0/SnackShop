// 填写 env
wx.cloud.init({
  env: 'cloudminiapp-579a16'
})


export const getBannerData = (id) => {
  return wx.cloud.callFunction({
    name: 'getBannerData',
    data: {
      id
    }
  })
}


export const getThemeData = () => {
  return wx.cloud.callFunction({
    name: 'getThemeData'
  })
}

export const getProductsData = () => {
  return wx.cloud.callFunction({
    name: 'getProductsData'
  })
}

// export const test2 = () => {
//   return wx.cloud.callFunction({
//     name: 'test2'
//   })
// }
