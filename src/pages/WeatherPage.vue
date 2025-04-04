<template>
  <div class="weather-page">
    <header class="weather-page__header">
      <h1>Weather App</h1>
      <p>Get current weather information for any city</p>
    </header>

    <main class="weather-page__main">
      <SearchBar
        :loading="state.loading"
        :error="state.error?.message"
        @search="handleSearch"
      />

      <WeatherCard
        :weather="state.currentWeather"
        :loading="state.loading"
        :error="state.error"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useWeatherStore } from "@/stores/weather";
import SearchBar from "@/components/molecules/SearchBar.vue";
import WeatherCard from "@/components/organisms/WeatherCard.vue";

const weatherStore = useWeatherStore();
const { state, fetchWeather } = weatherStore;

const handleSearch = async (query: string) => {
  await fetchWeather(query);
};

// Load initial weather data for a default city
onMounted(() => {
  fetchWeather("London");
});
</script>

<style scoped lang="scss">
.weather-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;

  &__header {
    text-align: center;
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1.125rem;
      color: #666;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }
}
</style>
