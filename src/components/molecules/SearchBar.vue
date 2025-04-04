<template>
  <div class="search-bar">
    <SearchInput
      v-model="searchQuery"
      placeholder="Enter city name..."
      :error="error"
      @search="handleSearch"
    />
    <BaseButton
      variant="primary"
      :disabled="!searchQuery.trim() || loading"
      @click="handleSearch"
    >
      {{ loading ? "Searching..." : "Search" }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SearchInput from "../atoms/SearchInput.vue";
import BaseButton from "../atoms/BaseButton.vue";

const props = defineProps<{
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "search", query: string): void;
}>();

const searchQuery = ref("");

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit("search", searchQuery.value.trim());
  }
};
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
