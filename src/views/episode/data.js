export const tableColumn = [
  // { prop: 'sorting', label: '排序', noRepeat: true },
  // { prop: 'rank', label: '排名' },
  { prop: 'image', label: '图片', width: 100 },
  { prop: 'is_classic', label: '加入期刊', width: 90 },
  { prop: 'title', label: '标题' },
  // { prop: 'originalTitle', label: '原名', width: 150 },
  // {
  //   prop: 'rating', label: '评分', noRepeat: true, width: 100,
  // },
  // { prop: 'genres', label: '类型', width: 150 },
  // { prop: 'directors', label: '导演', width: 150 },
  // { prop: 'casts', label: '主演', width: 150 },
  // { prop: 'year', label: '年份' },
  // { prop: 'recommend', label: '推荐', noRepeat: true },
  { prop: 'summary', label: '摘要' },
]

export const operate = [
  { name: '编辑', func: 'handleEdit', type: 'primary' },
  { name: '删除', func: 'handleDelete', type: 'danger' },
]
