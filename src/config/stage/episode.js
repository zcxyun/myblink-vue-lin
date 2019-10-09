const episodeRouter = {
  route: null,
  name: null,
  title: '句子管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/episode/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加句子',
      type: 'view',
      name: 'episodeAdd',
      route: '/episode/add',
      filePath: 'views/episode/EpisodeAdd.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '句子列表',
      type: 'view',
      name: 'episodeList',
      route: '/episode/list',
      filePath: 'views/episode/EpisodeList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default episodeRouter
