<template>
  <div>
    <movie-info action="add" @edit-save="onEditSave"></movie-info>
  </div>
</template>

<script>
import MovieInfo from './MovieInfo'

export default {
  components: {
    MovieInfo,
  },
  methods: {
    onEditSave() {
      this.$router.push('/movie/list')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
