const movieRouter = {
  route: null,
  name: null,
  title: '电影管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/movie/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加电影',
      type: 'view',
      name: 'movieAdd',
      route: '/movie/add',
      filePath: 'views/movie/MovieAdd.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '电影列表',
      type: 'view',
      name: 'movieList',
      route: '/movie/list',
      filePath: 'views/movie/MovieList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default movieRouter
