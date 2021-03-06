<template>
  <div>
    <z-table
      v-if="!showEdit"
      :loading="loading"
      :title="title"
      showExtend
      showSearch
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
      @switchStatus="onSwitch"
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
import { ClassicType } from '@/libs/enum.js'
import classic from '@/models/classic.js'
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
      pageCount: 10, // 每页10条数据
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
      const page = this.currentPage
      const count = this.pageCount
      const q = this.searchKeyword.trim()
      try {
        this.loading = true
        const { total, models } = await episode.getEpisodes(page, count, q)
        this.tableData = models
        this.total = total
      } catch (err) {
        this.tableData = []
        this.total = 0
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
    // 切换是否加入期刊
    async onSwitch({ row, val }) {
      this.loading = true
      const data = {
        classic_id: row.id,
        type: ClassicType.EPISODE,
      }
      let res = null
      try {
        if (val) {
          res = await classic.addClassic(data)
        } else {
          res = await classic.deleteClassic(data)
        }
        if (res && res.error_code === 0) {
          this.$message.success(res.msg)
        }
      } catch (err) {
        console.log(err)
      }
      this._getTableData()
      this.loading = false
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
</style>
