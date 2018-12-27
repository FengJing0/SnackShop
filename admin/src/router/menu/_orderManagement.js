const meta = {
  requiresAuth: true
}

const pagesPath = 'orderManagement'

const moduleName = 'orderManagement'

/**
 * title:String,列表的标题
 * type:String,二级菜单的分类名称
 * name:String,三级菜单的名称
 * icon:String,菜单栏显示的图标,默认'file-o'
 */

const maker = (title, type, name, icon = 'file-o') => {
  return {
    title,
    icon,
    path: `${type}/${name}`,
    name: `${moduleName}-${type}-${name}`,
    meta,
    component: () =>
      import(`@/pages/menus/${pagesPath}/${type}/${name}`)
  }
}

export const menu = {
  title: '订单管理',
  path: `/${moduleName}`,
  name: `${moduleName}`,
  meta,
  component: () =>
    import('@/components/core/MainLayout'),
  redirect: {
    name: `${moduleName}-index`
  },
  children: [{
    path: 'index',
    name: `${moduleName}-index`,
    meta,
    component: () =>
      import(`@/pages/menus/${moduleName}/index`)
  },
  (pre => ({
    title: '订单管理',
    icon: 'folder-o',
    children: [
      maker('订单列表', pre, 'index')
    ]
  }))('orderList')
  ]
}

export const router = {
  ...menu,
  children: [].concat(...menu.children.map(e => e.children || e))
}
