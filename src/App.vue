<script setup lang="ts">
// App.vue is now just a router view container
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
@use "./assets/styles/main.scss" as *;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
}
</style>
