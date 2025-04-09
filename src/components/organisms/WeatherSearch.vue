<template>
  <div class="weather-search">
    <SearchBar />
  </div>
</template>

<script setup lang="ts">
import SearchBar from "../molecules/SearchBar.vue";
</script>

<style scoped>
.weather-search {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
