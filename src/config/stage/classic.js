const classicRouter = {
  route: null,
  name: null,
  title: '期刊管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/classic/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加期刊',
      type: 'view',
      name: 'classicAdd',
      route: '/classic/add',
      filePath: 'views/classic/classicAdd.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '期刊列表',
      type: 'view',
      name: 'classicList',
      route: '/classic/list',
      filePath: 'views/classic/classicList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default classicRouter
