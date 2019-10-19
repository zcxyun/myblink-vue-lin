export const tableColumn = [
  // { prop: 'sorting', label: '排序', noRepeat: true },
  // { prop: 'rank', label: '排名' },
  {
    prop: 'image', label: '封面', width: 100, readOnly: true,
  },
  { prop: 'title', label: '标题', width: 150 },
  // {
  //   prop: 'rating', label: '评分', noRepeat: true, width: 100,
  // },
  { prop: 'subtitle', label: '子标题', width: 100 },
  { prop: 'author', label: '作者', width: 150 },
  { prop: 'summary', label: '摘要', width: 200 },
  { prop: 'category', label: '分类', width: 60 },
  { prop: 'binding', label: '装帧风格', width: 100 },
  { prop: 'publisher', label: '出版社', width: 150 },
  { prop: 'price', label: '价格', width: 90 },
  { prop: 'pages', label: '页数', width: 70 },
  { prop: 'pubdate', label: '出版时间', width: 100 },
  { prop: 'isbn', label: 'isbn', width: 100 },
  { prop: 'translator', label: '翻译者', width: 150 },
  // { prop: 'recommend', label: '推荐', noRepeat: true },
]

export const operate = [
  { name: '编辑', func: 'handleEdit', type: 'primary' },
  { name: '删除', func: 'handleDelete', type: 'danger' },
]
