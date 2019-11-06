export const tableColumn = [
  { prop: 'avatarUrl', label: '图片', width: 60 },
  { prop: 'nickName', label: '会员', width: 90 },
  { prop: 'title', label: '标题' },
  { prop: 'type', label: '分类' },
  { prop: 'short_comment', label: '短评' },
  { prop: 'create_time', label: '评论时间' },
]

export const operate = [
  { name: '编辑', func: 'handleEdit', type: 'primary' },
  { name: '删除', func: 'handleDelete', type: 'danger' },
]
