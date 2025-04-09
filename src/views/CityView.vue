<template>
  <div>
    <Suspense>
      <AsyncCityView />
      <template #fallback>
        <div class="loading-text">{{ theme.text.ui.loading }}</div>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import AsyncCityView from "@/components/organisms/AsyncCityView.vue";
import theme from "@/config/theme";
</script>

<style scoped lang="scss">
.loading-text {
  color: v-bind("theme.colors.text.primary");
  font-family: v-bind("theme.typography.fontFamily.primary");
  font-size: v-bind("theme.typography.fontSize.base");
  font-style: normal;
  font-weight: v-bind("theme.typography.fontWeight.normal");
  line-height: normal;
  letter-spacing: 0.03rem;
}
</style>
