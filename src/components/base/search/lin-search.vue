<template>
  <div class="lin-search">
    <el-input
      size="medium"
      :placeholder="placeholder"
      clearable
      v-model="keyword"
      class="input-with-select"
    >
      <el-button slot="append" icon="el-icon-search" @click="onSearch(keyword)"></el-button>
    </el-input>
  </div>
</template>

<script>
import Utils from 'lin/utils/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入内容',
    },
  },
  data() {
    return {
      debounceSearch: null,
      keyword: '',
    }
  },
  created() {
    this.debounceSearch = Utils.debounce(this.onSearch, 1000)
    // 节流搜索
    this.$watch('keyword', this.debounceSearch)
  },
  methods: {
    clear() {
      this.keyword = ''
    },
    onSearch(newQuery) {
      this.$emit('query', newQuery)
    },
  },
}
</script>
<style lang="scss" scoped>
.lin-search /deep/ .el-input-group__append {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 0 8px;
  color: #ffffff;
  border: 1px solid $theme;
  .el-icon-search {
    font-size: 18px;
  }
}
.lin-search /deep/ .el-input__inner {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-right: none;
  width: 150px;
  transition: all 0.2s linear;

  &:focus {
    width: 250px;
    // transition: all 0.3s linear;
  }
}
</style>
