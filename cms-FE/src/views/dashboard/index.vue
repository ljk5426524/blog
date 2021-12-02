<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎您，{{ userName || 'admin' }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCookie, getCookieJSON } from '@/utils/cookie'

export default {
  name: 'Dashboard',

  computed: {
    ...mapGetters(['name']),
    ...mapGetters(['sidebar']),
    avatar() {
      return getCookie('avatar')
    },
    userName() {
      return getCookie('username')
    },
    roleDesc() {
      return getCookie('roleDesc')
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
