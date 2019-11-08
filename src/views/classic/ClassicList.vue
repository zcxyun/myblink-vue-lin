<template>
  <div>
    <z-table
      :loading="loading"
      :title="title"
      showExtend
      :tableData="tableData"
      :tableColumn="tableColumn"
      :currentPage="currentPage"
      :pageCount="pageCount"
      :total="total"
      @page-change="onPageChange"
      @switchStatus="onSwitch"
    ></z-table>
  </div>
</template>

<script>
import classic from '@/models/classic.js'
import { tableColumn } from './data.js'
import ZTable from '@/components/base/table/z-table'

export default {
  components: {
    ZTable,
  },
  data() {
    return {
      title: '期刊列表',
      tableData: [],
      tableColumn,
      loading: false,
      // searchKeyword: '',
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
      // const q = this.searchKeyword.trim()
      try {
        this.loading = true
        const { total, models } = await classic.getClassics(
          this.currentPage, this.pageCount,
        )
        // console.log(models)
        const strType = { 100: '电影', 200: '音乐', 300: '句子' }
        models.forEach((model) => {
          model.type = strType[model.type]  // eslint-disable-line
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

    // 切换是否加入期刊
    async onSwitch({ row, val }) {
      this.loading = true
      const intType = { '电影': 100, '音乐': 200, '句子': 300 } // eslint-disable-line
      const data = {
        classic_id: row.id,
        type: intType[row.type],
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
    // 切换分页
    async onPageChange(val) {
      this.currentPage = val
      this._getTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
