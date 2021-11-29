<template>
  <div id="app">
    <router-view />
    <ApiSelect />
  </div>
</template>

<script>
import ApiSelect from '@/components/Tools/ApiSelect'
export default {
  name: 'App',
  components: {
    ApiSelect
  },
}
</script>
