<template>
  <div>
    <episode-info action="add" @edit-save="onEditSave"></episode-info>
  </div>
</template>

<script>
import EpisodeInfo from './EpisodeInfo'

export default {
  components: {
    EpisodeInfo,
  },
  methods: {
    onEditSave() {
      this.$router.push('/episode/list')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
