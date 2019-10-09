const memberRouter = {
  route: null,
  name: null,
  title: '会员管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/member/', // 文件路径
  order: null,
  inNav: true,
  children: [{
    title: '会员列表',
    type: 'view',
    name: 'memberList',
    route: '/member/list',
    filePath: 'views/member/MemberList.vue',
    inNav: true,
    icon: 'iconfont icon-tushuguanli',
  },
  ],
}

export default memberRouter
