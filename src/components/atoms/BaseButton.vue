<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      { 'base-button--disabled': disabled },
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped lang="scss">
@use "sass:color";

.base-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;

  &--primary {
    background-color: #4a90e2;
    color: white;

    &:hover:not(:disabled) {
      background-color: color.adjust(#4a90e2, $lightness: -10%);
    }
  }

  &--secondary {
    background-color: #f5f5f5;
    color: #333;

    &:hover:not(:disabled) {
      background-color: color.adjust(#f5f5f5, $lightness: -10%);
    }
  }

  &--outline {
    background-color: transparent;
    border: 2px solid #4a90e2;
    color: #4a90e2;

    &:hover:not(:disabled) {
      background-color: #4a90e2;
      color: white;
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
