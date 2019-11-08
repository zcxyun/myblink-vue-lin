<template>
  <div>
    <z-table
      :loading="loading"
      :title="title"
      showExtend
      showSearch
      showSearchTypes
      :currentSearchType="searchTypes[currentSearchType]"
      :searchPlaceHolder="searchPlaceHolder"
      :tableData="tableData"
      :tableColumn="tableColumn"
      :currentPage="currentPage"
      :pageCount="pageCount"
      :total="total"
      :searchTypes="searchTypes"
      @page-change="onPageChange"
      @search="onSearch"
      @choose-search-type="onChooseSearchType"
    ></z-table>
  </div>
</template>

<script>
import comment from '@/models/comment.js'
import { tableColumn } from './data.js'
import ZTable from '@/components/base/table/z-table'

export default {
  components: {
    ZTable,
  },
  data() {
    return {
      searchPlaceHolder: '请输入标题',
      title: '评论列表',
      tableData: [],
      tableColumn,
      loading: false,
      searchKeyword: '',
      searchTypes: { 100: '电影', 200: '音乐', 300: '句子', 400: '书籍' },  // eslint-disable-line
      currentSearchType: 100,
      // 分页相关
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
      const q = this.searchKeyword.trim()
      try {
        this.loading = true
        const { total, models } = await comment.getComments(
          this.currentPage, this.pageCount, q, this.currentSearchType,
        )
        models.forEach((model) => {
          model.type = this.searchTypes[model.type]  // eslint-disable-line
        })
        this.tableData = models
        this.total = total
      } catch (err) {
        this.tableData = []
        this.total = 0
        console.log(err)
      }
      this.loading = false
    },

    // 选择搜索类型
    onChooseSearchType(type) {
      this.currentSearchType = type
      this._getTableData()
    },

    // 切换分页
    async onPageChange(val) {
      this.currentPage = val
      this._getTableData()
    },

    // 搜索
    onSearch(query) {
      this.currentPage = 1
      this.searchKeyword = query
      this._getTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
