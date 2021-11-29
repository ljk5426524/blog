<template>
  <div class="main-content">{{userName}}，超级管理员才能看到</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCookie, getCookieJSON } from '@/utils/cookie'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name']),
    userName() {
      return getCookie('userName')
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
