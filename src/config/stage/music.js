const musicRouter = {
  route: null,
  name: null,
  title: '音乐管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/music/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加音乐',
      type: 'view',
      name: 'musicAdd',
      route: '/music/add',
      filePath: 'views/music/MusicAdd.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '音乐列表',
      type: 'view',
      name: 'musicList',
      route: '/music/list',
      filePath: 'views/music/MusicList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default musicRouter
