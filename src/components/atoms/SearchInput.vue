<template>
  <div class="search-input">
    <input
      type="text"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :placeholder="placeholder"
      class="search-input__field"
      :class="{ 'search-input__field--error': error }"
      @keyup.enter="$emit('search')"
    />
    <div v-if="error" class="search-input__error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
  error?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search"): void;
}>();
</script>

<style scoped lang="scss">
.search-input {
  width: 100%;

  &__field {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #4a90e2;
    }

    &--error {
      border-color: #e74c3c;
    }
  }

  &__error {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
}
</style>
