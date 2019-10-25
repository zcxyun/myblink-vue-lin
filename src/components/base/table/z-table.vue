<template>
  <div>
    <!-- 列表页面 -->
    <div class="tableSample">
      <div class="header">
        <div class="header-left">
          <p class="title">{{title}}</p>
        </div>
        <div class="header-right">
          <lin-search @query="onQueryChange" :placeholder="searchPlaceHolder" v-if="showSearch"/>
          <div style="margin-left:30px">
            <el-button type="primary" @click="dialogTableVisible=!dialogTableVisible">列操作</el-button>
          </div>
        </div>
      </div>
      <div class="table-main">
        <el-dialog top="5vh" width="60%" :visible.sync="dialogTableVisible">
          <!-- 定制列 -->
          <span>选择要展示的列:</span>
          <el-checkbox-group v-model="checkList" class="m-20">
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
          :data="_tableData"
          @row-dblclick="onRowDbClick"
          @expand-change="onExpandChange"
          v-loading="loading"
          highlight-current-row
          stripe
          max-height="420"
        >
          <!-- 展示摘要 -->
          <el-table-column type="expand" v-if="showExtend">
            <template #default="{row}">
              <div class="summary">
                <template v-for="column in filterTableColumn">
                  <el-image
                    :key="column.label"
                    v-if="column.label === '图片'"
                    :src="row[column.prop].value"
                    fit="contain"
                    class="summary-img"
                    @click.native="onImage(row[column.prop].value)">
                  </el-image>
                </template>
                <el-form label-position="right" class="table-expand" size="mini">
                  <template v-for="column in filterTableColumn">
                    <el-form-item
                      v-if="column.label === '音乐'"
                      :key="column.label">
                      <el-link :href="row[column.prop].value" target="_blank" >
                        <i class="el-icon-view el-icon--left"></i>音乐地址
                      </el-link>
                    </el-form-item>
                    <el-form-item
                      :label="column.label"
                      :key="column.label"
                      v-else-if="column.label !== '图片' && column.label !== '加入期刊' && row[column.prop].value">
                      <div class="form-item">       {{ row[column.prop].value }}</div>
                    </el-form-item>
                  </template>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <!-- 开始循环 -->
          <template v-for="column in filterTableColumn">
            <!-- 加入期刊 -->
            <el-table-column
              :label="column.label"
              v-if="column.label === '加入期刊'"
              :key="column.label"
              :fixed="column.fixed ? column.fixed : false"
              :width="column.width ? column.width : ''">
              <template #default="{row}">
                <el-switch
                  v-model="row[column.prop].value"
                  active-color="#3963bc"
                  @change="onSwitch(row, row[column.prop].value)"
                ></el-switch>
              </template>
            </el-table-column>
            <!-- 自定义排序 -->
            <!-- <el-table-column label="排序" v-if="item.label === '排序'" v-bind:key="item.label">
              <template slot-scope="props">
                <input
                  type="number"
                  class="sort-input"
                  v-model="props.row.sorting"
                  @blur="onSort(props.row.sorting, props.row)"
                >
              </template>
            </el-table-column> -->
            <!-- 首列图片 -->
            <el-table-column
              :key="column.label"
              v-else-if="column.label === '图片'"
              :label="column.label"
              :fixed="column.fixed ? column.fixed : false"
              :width="column.width ? column.width : ''">
              <template #default="{row}">
                <el-image
                  :src="row[column.prop].value"
                  fit="contain"
                  @click.native="onImage(row[column.prop].value)"
                  ></el-image>
              </template>
            </el-table-column>
            <!-- 音乐链接列 -->
            <el-table-column
              :key="column.label"
              v-else-if="column.label === '音乐'"
              :label="column.label"
              :fixed="column.fixed ? column.fixed : false"
              :width="column.width ? column.width : ''"
            >
              <template #default="{row}">
                <el-link :href="row[column.prop].value" target="_blank" >
                  <i class="el-icon-view el-icon--left"></i>音乐地址
                </el-link>
              </template>
            </el-table-column>
            <!-- 排序 评分 -->
            <!-- <el-table-column
              label="评分"
              :prop="item.prop"
              sortable
              v-bind:key="item.label"
              :fixed="item.fixed ? item.fixed : false"
              :width="item.width ? item.width : ''"
              v-if="item.label === '评分'"
            ></el-table-column> -->
            <!-- 单元格编辑 -->
            <el-table-column
              v-else
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :width="column.width ? column.width : ''"
              :fixed="column.fixed ? column.fixed : false"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <div v-if="!row[column.prop].editFlag" class="table-edit">
                  <div @click="onCellEdit(row, column)" class="content">{{ row[column.prop].value || '暂无数据' }}</div>
                  <div class="cell-icon" @click="onCellEdit(row, column)" v-if="operate">
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
                    <div class="cell-save" @click="onCellSave(row, column)">
                      <i class="el-icon-check"></i>
                    </div>
                    <div class="cell-cancel" @click="onCellCancel(row, column)">
                      <i class="el-icon-close"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column> -->
          </template>
          <!-- 操作列 -->
          <el-table-column label="操作" fixed="right" width="170" v-if="operate">
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
            @current-change="onCurrentChange"
            :background="true"
            :page-size="pageCount"
            :current-page="currentPage"
            layout="prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LinSearch from '@/components/base/search/lin-search'
import utils from '@/lin/utils/util.js'

export default {
  components: {
    LinSearch,
  },
  props: {
    title: String,
    showSearch: Boolean,
    searchPlaceHolder: String,
    loading: Boolean,
    tableData: Array,
    tableColumn: Array,
    operate: Array,
    showExtend: Boolean,
    // 分页相关
    currentPage: Number, // 默认获取第一页的数据
    pageCount: Number, // 每页10条数据
    total: Number, // 数据总数
  },
  data() {
    return {
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      tempCheckList: [],
      // 固定列相关
      dialogTableVisible: false,
      fixedLeftList: [],
      fixedRightList: [],
      // 单元格编辑相关
      editRow: 0,
      originCellValue: '',
      cellEditing: false,
    }
  },
  computed: {
    _tableData() {
      // 当数据变动时使单元格可编辑
      this.cellEditing = false // eslint-disable-line
      // 处理原表格数据, 使每个要显示的cell数据项等于{value: 原数据值, editFlag: false}
      let data = []
      if (Array.isArray(this.tableData)) {
        data = utils.deepClone(this.tableData)
        data.forEach((item) => {
          const tempItem = item
          this.tableColumn.forEach((column) => {
            const { prop } = column
            if (prop in tempItem) {
              tempItem[prop] = {
                value: tempItem[prop],
                editFlat: false,
              }
            }
          })
        })
      }
      return data
    },
  },
  created() {
    // 定制列
    this.tempCheckList = this.tableColumn.map(v => v.label)
    this.checkList = this.tempCheckList.slice()
    this.filterTableColumn = this.tableColumn.filter(
      v => this.checkList.includes(v.label),
    )
  },
  methods: {
    // 还原cell数据, 使单个cell数据项等于其自身的value
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

    onRowDbClick(val) {
      // console.log(val)
      this.$emit('row-db-click', val)
    },

    // 变更排序
    // onSort(val) {
    // },

    // 切换状态
    onSwitch(row, val) {
      const data = this._revertSingleData(row)
      this.$emit('switchStatus', { row: data, val })
    },

    onExpandChange(row, expandedRows) {
      // console.log(row, expandedRows)
      this.$emit('expand-change', { row, expandedRows })
    },

    // 单元格编辑
    onCellEdit(row, column) {
      // 没有输入操作列, 单元格不可编辑
      if (!this.operate) {
        return
      }
      if (this.cellEditing === true) {
        this.$message.warning('一次只能编辑一个单元格')
        return
      }
      const { prop } = column
      if (prop in row) {
        // 记录单元格当前数据, 如果未修改不做提交并恢复原数据
        this.originCellValue = row[prop].value
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
    async onCellSave(row, column) {
      const { prop } = column
      if (prop in row) {
        const cell = row[prop]
        this.$set(cell, 'editFlag', false)
        this.cellEditing = false
        this.editRow--
        if (cell.value === this.originCellValue) {
          this.$message.warning('未做任何修改')
          return
        }
        if (cell.value === '') {
          cell.value = this.originCellValue
          this.$message.error('单元格数据不能为空')
          return
        }
        // 提交更新数据
        const data = this._revertSingleData(row)
        this.$emit('cell-save', data)
      }
    },

    // 单元格取消编辑
    onCellCancel(row, column) {
      const { prop } = column
      if (prop in row) {
        this.$set(row[prop], 'editFlag', false)
        this.$set(row[prop], 'value', this.originCellValue)
        this.cellEditing = false
        this.$message.warning('已取消编辑')
        this.editRow--
      }
    },

    // 切换分页
    async onCurrentChange(val) {
      this.$emit('page-change', val)
    },

    // 操作列
    buttonMethods(func, index, row) {
      const self = this
      const { methods } = this.$options
      if (func in methods) {
        methods[func](self, index, row)
      }
    },
    handleEdit(self, index, row) {
      self.$emit('edit', row.id)
    },
    handleDelete(self, index, row) {
      self.$emit('delete', row.id)
    },
    // 搜索
    onQueryChange(query) {
      this.$emit('search', query)
    },
    // 预览图片
    onImage(image) {
      this.$imagePreview({ images: [image] })
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
    },
    // 监听选择列变化
    checkList() {
      this.filterTableColumn = this.tableColumn.filter(
        v => this.checkList.includes(v.label),
      )
    },
  },
}
</script>

<style lang="scss">
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

    .summary-img {
      width: 325px;
      height: 250px;
    }

    .table-expand {
      font-size: 0;
      margin-left: 30px;
      // display: flex;
      // flex-direction: column;

      label {
        width: 90px;
        color: #99a9bf;
      }

      .el-form-item {
        margin-right: 0;
        margin-bottom: 0px !important;
        width: 500px;
        // display: flex;
        // flex-direction: row;

        .form-item {
          white-space: pre-wrap;
        }
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
.tableSample >>> .el-dialog__footer {
  text-align: left;
  padding-left: 30px;
}

.tableSample >>> .el-dialog__header {
  padding-left: 30px;
}

.tableSample >>> .el-dialog__body {
  padding: 30px;
}
</style>
