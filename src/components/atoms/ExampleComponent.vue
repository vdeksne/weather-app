<template>
  <div>
    {{ msg }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  msg: string;
}

defineProps<Props>();
</script>

<style scoped></style>
