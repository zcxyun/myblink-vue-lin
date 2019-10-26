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
      // const q = this.searchKeyword.trim()
      try {
        this.loading = true
        const { total, models } = await classic.getClassics(
          this.currentPage, this.pageCount,
        )
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
