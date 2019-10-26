export const tableColumn = [
  { prop: 'avatarUrl', label: '图片', width: 60 },
  { prop: 'nickName', label: '昵称' },
  { prop: 'gender', label: '性别' },
  { prop: 'country', label: '国家' },
  { prop: 'province', label: '省份' },
  { prop: 'city', label: '城市' },
]

export const operate = [
  { name: '编辑', func: 'handleEdit', type: 'primary' },
  { name: '删除', func: 'handleDelete', type: 'danger' },
]
