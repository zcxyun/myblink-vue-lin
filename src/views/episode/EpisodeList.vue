<template>
  <div>
    <z-table
      v-if="!showEdit"
      :loading="loading"
      :title="title"
      showExtend
      :searchPlaceHolder="searchPlaceHolder"
      :tableData="tableData"
      :tableColumn="tableColumn"
      :operate="operate"
      :currentPage="currentPage"
      :pageCount="pageCount"
      :total="total"
      @cell-save="onCellSave"
      @page-change="onPageChange"
      @edit="onEdit"
      @delete="onDelete"
      @search="onSearch"
    ></z-table>
    <episode-info
      v-else
      :editEpisodeId="editEpisodeId"
      @edit-save="onEditSave"
      @edit-back="onEditBack"
    ></episode-info>
  </div>
</template>

<script>
import episode from '@/models/episode.js'
import EpisodeInfo from './EpisodeInfo'
import { tableColumn, operate } from './data.js'
import ZTable from '@/components/base/table/z-table'

export default {
  components: {
    EpisodeInfo,
    ZTable,
  },
  data() {
    return {
      title: '句子列表',
      searchPlaceHolder: '请输入句子标题',
      editEpisodeId: 0,
      showEdit: false,
      tableData: [],
      tableColumn,
      loading: false,
      operate,
      searchKeyword: '',
      // 分页相关
      // refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 2, // 每页10条数据
      total: 0, // 分组内的用户总数
    }
  },
  created() {
    // 获取数据
    this._getTableData()
  },
  methods: {
    // 获取数据
    async _getTableData() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const q = this.searchKeyword.trim()
      try {
        this.loading = true
        const { total, episodes } = await episode.getEpisodes(page, count, q)
        this.tableData = episodes
        this.total = total
      } catch (err) {
        this.tableData = []
        console.log(err)
      }
      this.loading = false
    },

    rowClick(val) {
      console.log(val)
    },

    // 单元格保存
    async onCellSave(data) {
      try {
        const res = await episode.editEpisode(data.id, data)
        this._getTableData()
        if (res && res.error_code === 0) {
          this.$message.success(`${res.msg}`)
        }
      } catch (err) {
        console.log(err)
      }
    },

    // 切换分页
    async onPageChange(val) {
      this.currentPage = val
      this._getTableData()
    },

    onEdit(id) {
      this.showEdit = true
      this.editEpisodeId = id
    },
    onDelete(id) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        const res = await episode.deleteEpisode(id).catch(() => {})
        this.loading = false
        if (res && res.error_code === 0) {
          this.$message.success(res.msg)
          if (this.total % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          this._getTableData()
        }
      }).catch(() => {
        this.$message.warning('已取消删除')
      })
    },
    // 搜索
    onSearch(query) {
      this.currentPage = 1
      this.searchKeyword = query
      this._getTableData()
    },
    // 保存并关闭编辑页面
    onEditSave() {
      this.showEdit = false
      this._getTableData()
    },
    // 返回并关闭编辑页面不刷新数据
    onEditBack() {
      this.showEdit = false
    },
  },
}
</script>

<style lang="scss" scoped>
.tableSample {
  padding: 0 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    border-bottom: 1px solid #dae1ed;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .table-main {
    padding: 0 30px;
    margin-top: 30px;
  }

  .top-operate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 30px;
  }

  .sort-input {
    width: 50px;
    background: none;
    justify-content: space-around;
  }

  .table-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cell-icon {
      cursor: pointer;
      color: #3963bc;
      font-size: 16px;
    }

    .cell-icon-edit {
      display: flex;
      margin-left: 20px;
      width: 50px;
      justify-content: space-between;

      .cell-cancel {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
      }

      .cell-save {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
        margin-right: -20px;
      }
    }
  }

  .m-20 {
    margin-bottom: 10px;
    margin-top: 5px;
  }

  .summary {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;

    img {
      width: 325px;
      height: 250px;
    }

    .demo-table-expand {
      font-size: 0;
      margin-left: 30px;
      display: flex;
      flex-direction: column;

      label {
        width: 90px;
        color: #99a9bf;
      }

      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: row;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
// dialog
.tableSample /deep/ .el-dialog__footer {
  text-align: left;
  padding-left: 30px;
}

.tableSample /deep/ .el-dialog__header {
  padding-left: 30px;
}

.tableSample /deep/ .el-dialog__body {
  padding: 30px;
}
</style>
