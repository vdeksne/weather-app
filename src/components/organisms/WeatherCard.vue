<template>
  <div class="weather-card">
    <div v-if="weather" class="weather-card__content">
      <div class="weather-card__header">
        <h2 class="weather-card__title">
          {{ weather.name }}, {{ weather.sys.country }}
        </h2>
      </div>

      <div class="weather-card__main">
        <div class="weather-card__temperature">
          <span class="weather-card__temp-value"
            >{{ Math.round(weather.main.temp) }}°C</span
          >
          <img
            :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
            :alt="weather.weather[0].description"
            class="weather-card__icon"
          />
        </div>

        <div class="weather-card__description">
          {{ weather.weather[0].description }}
        </div>
      </div>

      <div class="weather-card__details">
        <div class="weather-card__detail-item">
          <span class="weather-card__label">Feels like</span>
          <span class="weather-card__value"
            >{{ Math.round(weather.main.feels_like) }}°C</span
          >
        </div>

        <div class="weather-card__detail-item">
          <span class="weather-card__label">Humidity</span>
          <span class="weather-card__value">{{ weather.main.humidity }}%</span>
        </div>

        <div class="weather-card__detail-item">
          <span class="weather-card__label">Wind</span>
          <span class="weather-card__value"
            >{{ Math.round(weather.wind.speed) }} m/s</span
          >
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="weather-card__loading">
      Loading weather data...
    </div>

    <div v-else-if="error" class="weather-card__error">
      {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeatherData, WeatherError } from "@/types/weather";

defineProps<{
  weather: WeatherData | null;
  loading?: boolean;
  error: WeatherError | null;
}>();
</script>

<style scoped lang="scss">
.weather-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
  min-height: 300px;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__header {
    text-align: center;
  }

  &__title {
    font-size: 1.5rem;
    color: #333;
    margin: 0;
  }

  &__main {
    text-align: center;
  }

  &__temperature {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  &__temp-value {
    font-size: 3rem;
    font-weight: bold;
    color: #4a90e2;
  }

  &__icon {
    width: 64px;
    height: 64px;
  }

  &__description {
    font-size: 1.25rem;
    color: #666;
    text-transform: capitalize;
  }

  &__details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }

  &__detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__label {
    font-size: 0.875rem;
    color: #666;
  }

  &__value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #333;
  }

  &__loading,
  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 1.25rem;
    color: #666;
  }

  &__error {
    color: #e74c3c;
  }
}
</style>
