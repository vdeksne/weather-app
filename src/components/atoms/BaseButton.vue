<template>
  <button class="button-container">Submit</button>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.button-container {
  width: 100%;
  display: flex;
  max-width: 21.375rem;
  padding: 0.78125rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.5rem;
  background: #2e3a5a;
  color: var(--Light-Gray-0, #fff);
  text-align: center;
  font-family: "SF Pro Display", sans-serif;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 590;
  line-height: 1.75rem; /* 155.556% */
  text-transform: uppercase;
  margin-top: 14rem;
}
@media (max-width: 768px) {
  .button-container {
    margin-top: 4rem;
  }
}
</style>
