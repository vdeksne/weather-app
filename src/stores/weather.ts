import { defineStore } from "pinia";
import { ref } from "vue";
import type { WeatherData, WeatherError, WeatherState } from "@/types/weather";
import { weatherApi } from "@/api/weather";

export const useWeatherStore = defineStore("weather", () => {
  const state = ref<WeatherState>({
    currentWeather: null,
    loading: false,
    error: null,
    searchQuery: "",
  });

  async function fetchWeather(city: string) {
    state.value.loading = true;
    state.value.error = null;
    state.value.searchQuery = city;

    try {
      const weatherData = await weatherApi.getCurrentWeather(city);
      state.value.currentWeather = weatherData;
    } catch (error) {
      const apiError = error as WeatherError;
      if (apiError.cod === "401") {
        state.value.error = {
          message:
            "Invalid API key. Please check your OpenWeatherMap API key configuration.",
          cod: apiError.cod,
        };
      } else {
        state.value.error = apiError;
      }
      state.value.currentWeather = null;
    } finally {
      state.value.loading = false;
    }
  }

  function clearError() {
    state.value.error = null;
  }

  return {
    state,
    fetchWeather,
    clearError,
  };
});
