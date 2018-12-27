import home from './_home'
import * as orderManagement from './_orderManagement'

// 菜单
export const menu = [
  home,
  orderManagement.menu
]

// 路由
export const router = [
  home,
  orderManagement.router
]
