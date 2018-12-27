const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloudminiapp-579a16'
})

const db = cloud.database({
  env: 'cloudminiapp-579a16'
})
const _ = db.command
const baseUrl = 'cloud://cloudminiapp-579a16.bb2b-cloudminiapp-579a16/SnackShop/images'