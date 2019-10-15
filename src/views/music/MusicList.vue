<template>
  <div>
    <!-- 列表页面 -->
    <div class="tableSample" v-if="!showEdit">
        <div class="header">
          <div class="header-left">
            <p class="title">音乐列表</p>
          </div>
          <div class="header-right">
            <lin-search @query="onQueryChange" placeholder="请输入音乐名"/>
            <div style="margin-left:30px">
              <el-button type="primary" @click="dialogTableVisible=!dialogTableVisible">列操作</el-button>
            </div>
          </div>
        </div>
      <div class="table-main">
        <el-dialog top="5vh" width="60%" :visible.sync="dialogTableVisible">
          <!-- 定制列 -->
          <span>选择要展示的列:</span>
          <el-checkbox-group v-model="checkList" @change="handleChange" class="m-20">
            <el-checkbox
              :disabled="item === ''"
              :label="item"
              v-for="item in tempCheckList"
              :key="item"
            />
          </el-checkbox-group>
          <!-- 固定列 -->
          <span>选择固定在左侧的列:</span>
          <el-checkbox-group v-model="fixedLeftList" class="m-20">
            <el-checkbox
              :disabled="fixedRightList.indexOf(item) > -1 || checkList.indexOf(item) ===  -1"
              :label="item"
              v-for="item in tempCheckList"
              :key="item"
            />
          </el-checkbox-group>
          <span>选择固定在右侧的列:</span>
          <el-checkbox-group v-model="fixedRightList" class="m-20">
            <el-checkbox
              :disabled="fixedLeftList.indexOf(item) > -1 || checkList.indexOf(item) === -1"
              :label="item"
              v-for="item in tempCheckList"
              :key="item"
            />
          </el-checkbox-group>
        </el-dialog>
        <el-table
          :data="tableData"
          @row-dblclick="rowClick"
          @expand-change="expandChange"
          v-loading="loading"
          id="out-table'"
        >
          <!-- 展示摘要 -->
          <el-table-column type="expand">
            <template v-slot="{row}">
              <div class="summary">
                <img :src="row.img_url" alt>
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item label="标题">
                    <span>{{ row.title.value }}</span>
                  </el-form-item>
                  <el-form-item label="摘要">
                    <span>{{ row.summary.value }}</span>
                  </el-form-item>
                  <el-form-item>
                    <el-link :href="row.voice_url" target="_blank">
                      <i class="el-icon-view el-icon--left"></i>音乐地址
                    </el-link>
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <!-- 开始循环 -->
          <template v-for="column in filterTableColumn">
            <el-table-column
              :key="column.label"
              :label="column.label"
              :width="column.width"
              show-overflow-tooltip
            >
              <template v-slot="{ row }">
                <div v-if="!row[column.prop].editFlag" class="table-edit">
                  <div @click="handleCellEdit(row, column)" class="content">{{ row[column.prop].value }}</div>
                  <div class="cell-icon" @click="handleCellEdit(row, column)">
                    <i class="el-icon-edit"></i>
                  </div>
                </div>
                <div v-else class="table-edit">
                  <el-input v-model="row[column.prop].value"
                    :autofocus="true"
                    clearable
                    :ref="column.prop + '-' + row.id"
                  ></el-input>
                  <div class="cell-icon-edit">
                    <div class="cell-save" @click="handleCellSave(row, column)">
                      <i class="el-icon-check"></i>
                    </div>
                    <div class="cell-cancel" @click="handleCellCancel(row, column)">
                      <i class="el-icon-close"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column> -->
          </template>
          <!-- 操作列 -->
          <el-table-column label="操作" fixed="right" width="170">
            <template slot-scope="scope">
              <el-button
                v-for="(item,index) in operate"
                :type="item.type"
                plain
                size="mini"
                :key="index"
                @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)"
              >{{item.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :background="true"
            :page-size="pageCount"
            :current-page="currentPage"
            v-if="refreshPagination"
            layout="prev, pager, next, jumper"
            :total="total_nums"
          ></el-pagination>
        </div>
      </div>
    </div>
    <music-edit
      v-else
      :editId="editId"
      @edit-save="editSave"
      @edit-back="editBack"></music-edit>
  </div>
</template>

<script>
import LinSearch from '@/components/base/search/lin-search'
import music from '@/models/music.js'
import MusicEdit from './MusicEdit'
import { tableColumn } from './data.js'
import utils from '@/lin/utils/util.js'

export default {
  components: {
    LinSearch,
    MusicEdit,
  },

  data() {
    return {
      editId: 0,
      showEdit: false,
      tableData: [],
      loading: false,
      searchKeyword: '',
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      tempCheckList: [],
      // 分页相关
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 2, // 每页10条数据
      total_nums: 0, // 分组内的用户总数
      // 固定列相关
      dialogTableVisible: false,
      fixedLeftList: [],
      fixedRightList: [],
      // 单元格编辑相关
      editRow: 0,
      tempCellValue: '',
      cellEditing: false,
    }
  },
  computed: {},
  mounted() {
    // 获取数据
    this._getTableData()
    this.tableColumn = tableColumn
    // 操作栏
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    // 定制列
    this.tempCheckList = tableColumn.map(v => v.label).slice()
    this.checkList = tableColumn.map(v => v.label)
    this.filterTableColumn = tableColumn.filter(
      v => this.checkList.indexOf(v.label) > -1,
    )
  },
  methods: {
    // 获取数据
    async _getTableData() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const q = this.searchKeyword.trim()
      // 每次获取数据时设置单元格还没有被编辑
      this.cellEditing = false
      this.loading = true
      try {
        const { total, musics } = await music.getMusics(page, count, q)
        this._handleData(total, musics)
      } catch (e) {
        this.tableData = []
        console.log(e)
      }
      this.loading = false
    },

    // 处理原表格数据, 使每个要显示的cell数据项等于{value: 原数据值, editFlag: false}
    _handleData(total, data) {
      if (total && Array.isArray(data)) {
        data.forEach((item) => {
          const tempItem = item
          this.tableColumn.forEach((column) => {
            const { prop } = column
            if (prop in tempItem) {
              const origin = tempItem[prop]
              tempItem[prop] = {
                value: origin,
                editFlat: false,
              }
            }
          })
        })
        this.tableData = [...data]
        this.total_nums = total
      }
    },
    // 还原表格数据, 使每个要显示的cell数据项等于其自身的value
    _revertSingleData(data) {
      const { toString } = Object.prototype
      if (toString.call(data) === '[object Object]') {
        const res = utils.deepClone(data)
        this.tableColumn.forEach((column) => {
          const { prop } = column
          if (prop in res) {
            res[prop] = res[prop].value
          }
        })
        return res
      }
    },

    rowClick(val) {
      console.log(val)
    },

    // 定制列
    handleChange() {
      this.filterTableColumn = tableColumn.filter(
        v => this.checkList.indexOf(v.label) > -1,
      )
    },

    expandChange(row, expandedRows) {
      console.log(row, expandedRows)
    },

    // 单元格编辑
    handleCellEdit(row, column) {
      if (this.cellEditing === true) {
        this.$message.warning('一次只能编辑一个单元格')
        return
      }
      const { prop } = column
      if (prop in row) {
        // 记录单元格当前数据, 如果未修改不做提交并恢复原数据
        this.tempCellValue = row[prop].value
        this.$set(row[prop], 'editFlag', true)
        this.cellEditing = true
        // 在组件渲染后才能使用组件
        this.$nextTick(() => {
          const refKey = `${prop}-${row.id}`
          this.$refs[refKey][0].select()
        })
        this.editRow++
      }
    },

    // 单元格保存
    async handleCellSave(row, column) {
      const { prop } = column
      if (prop in row) {
        this.$set(row[prop], 'editFlag', false)
        this.cellEditing = false
        this.editRow--
        if (row[prop].value === this.tempCellValue) {
          this.$message.info('未做任何修改')
          return
        }
        // 提交更新数据
        const data = this._revertSingleData(row)
        const res = await music.editMusic(data.id, data).catch(() => {
          row[prop].value = this.tempCellValue // eslint-disable-line
        })
        if (res && res.error_code === 0) {
          this.$message.success(`${res.msg}`)
        }
      }
    },

    // 单元格取消编辑
    handleCellCancel(row, column) {
      const { prop } = column
      if (prop in row) {
        this.$set(row[prop], 'editFlag', false)
        this.$set(row[prop], 'value', this.tempCellValue)
        this.cellEditing = false
        this.$message.info('已取消编辑')
        this.editRow--
      }
    },

    // 切换分页
    async handleCurrentChange(val) {
      this.currentPage = val
      this._getTableData()
    },

    // 操作列
    buttonMethods(func, index, row) {
      const self = this
      const { methods } = this.$options
      methods[func](self, index, row)
    },
    handleEdit(self, index, row) {
      self.showEdit = true  // eslint-disable-line
      self.editId = row.id // eslint-disable-line
    },
    handleDelete(self, index, row) {
      self.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {  // eslint-disable-line
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        self.loading = true // eslint-disable-line
        const res = await music.deleteMusic(row.id).catch(() => {})
        self.loading = false  // eslint-disable-line
        if (res && res.error_code === 0) {
          self.$message.success(res.msg)  // eslint-disable-line
          if (self.total_nums % self.pageCount === 1 && self.currentPage !== 1) { // eslint-disable-line
            self.currentPage--  // eslint-disable-line
          }
          self._getTableData()
        }
      }).catch(() => {
        self.$message.info('已取消删除')  // eslint-disable-line
      })
    },
    // 搜索
    onQueryChange(query) {
      this.currentPage = 1
      this.searchKeyword = query
      this._getTableData()
    },
    // 保存并关闭编辑页面
    editSave() {
      this.showEdit = false
      this._getTableData()
    },
    // 返回并关闭编辑页面不刷新数据
    editBack() {
      this.showEdit = false
    },
  },

  watch: {
    // 监听固定列变化
    fixedLeftList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedLeftList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'left')
        } else if (this.fixedRightList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      console.log(this.filterTableColumn)
    },
    fixedRightList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedRightList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'right')
        } else if (this.fixedLeftList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      console.log(this.filterTableColumn)
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
