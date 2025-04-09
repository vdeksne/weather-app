<template>
  <div class="weather-nav pt-4">
    <header class="weather-nav__header flex justify-between items-center">
      <RouterLink to="/">
        <h1 class="weather-nav__header-title">Weather</h1>
      </RouterLink>
      <RouterLink to="/profile">
        <UserIcon />
      </RouterLink>
    </header>
  </div>
</template>

<script lang="ts" setup>
import UserIcon from "@/components/atoms/icons/UserIcon.vue";
import { RouterLink } from "vue-router";
</script>

<style scoped lang="scss">
.weather-nav {
  color: #000;
  font-family: "SF Pro Display", sans-serif;
  font-size: 2.3125rem;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.01156rem;
  &__header {
    text-align: center;
    margin-bottom: 1rem;

    h1 {
      color: #000;
      font-family: "SF Pro Display", sans-serif;
      font-size: 2.3125rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.01156rem;
    }
  }

  @media (min-width: 768px) {
    .weather-nav {
      &__header {
        gap: 11rem;
      }
    }
  }
}
</style>
