<template>
  <div class="version">
    <div class="item">环境：{{ info.name }}</div>
    <div class="item">API：{{ info.api }}</div>
    <div class="item">编译时间：{{ info.compileTime | parseTime }}</div>
  </div>
</template>
<script>
/* eslint-disable no-undef */
export default {
  data() {
    return {
      info: env,
    }
  },
  mounted() {
    const { test } = this.$route.query
    if (test !== '1') {
      this.$router.replace('/')
    }
  },
}
</script>
<style lang="scss" scoped>
.version {
  padding: 15px;
  .item {
    font-size: 30px;
    padding: 5px 0;
  }
}
</style>
