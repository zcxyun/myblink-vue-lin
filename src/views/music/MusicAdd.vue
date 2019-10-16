<template>
  <div>
    <music-info action="add" @edit-save="onEditSave"></music-info>
  </div>
</template>

<script>
import MusicInfo from './MusicInfo'

export default {
  components: {
    MusicInfo,
  },
  methods: {
    onEditSave() {
      this.$router.push('/music/list')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
