<template>
  <div>
    <z-table
      :loading="loading"
      :title="title"
      showExtend
      showSearch
      :searchPlaceHolder="searchPlaceHolder"
      :tableData="tableData"
      :tableColumn="tableColumn"
      :currentPage="currentPage"
      :pageCount="pageCount"
      :total="total"
      @page-change="onPageChange"
      @search="onSearch"
    ></z-table>
    <!-- <book-info
      v-else
      :editBookId="editBookId"
      @edit-save="onEditSave"
      @edit-back="onEditBack"
    ></book-info> -->
  </div>
</template>

<script>
import book from '@/models/book.js'
// import BookInfo from './BookInfo'
import { tableColumn } from './data.js'
import ZTable from '@/components/base/table/z-table'

export default {
  components: {
    // BookInfo,
    ZTable,
  },
  data() {
    return {
      title: '书籍列表',
      searchPlaceHolder: '请输入书名 / ISBN',
      // editBookId: 0,
      // showEdit: false,
      tableData: [],
      tableColumn,
      loading: false,
      // operate,
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
        const { total, books } = await book.getBooks(page, count, q)
        this.arr2Str(books)
        this.tableData = books
        this.total = total
      } catch (err) {
        this.tableData = []
        this.total = 0
        console.log(err)
      }
      this.loading = false
    },

    arr2Str(books) {
      books.forEach((item) => {
        item.author = item.author.join(',')   // eslint-disable-line
        item.translator = item.translator.join(',') // eslint-disable-line
      })
    },

    rowClick(val) {
      console.log(val)
    },

    // 单元格保存
    async onCellSave(data) {
      try {
        const res = await book.editBook(data.id, data)
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
      this.editBookId = id
    },
    onDelete(id) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        const res = await book.deleteBook(id).catch(() => {})
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
</style>
