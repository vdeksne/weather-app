<template>
  <div class="weather-page p-4 py-7">
    <div v-show="!isSearchActive">
      <SiteNavigation />
    </div>

    <SearchBar
      :loading="weatherStore.loading"
      :error="weatherStore.error?.message"
      @search="handleSearch"
      @search-active="handleSearchActive"
      class="search-bar-container"
    />

    <div v-show="!isSearchActive">
      <main class="weather-page__main">
        <Suspense>
          <WeatherCard
            :weather="weatherStore.currentWeather"
            :loading="weatherStore.loading"
            :error="weatherStore.error"
          />
          <template #fallback>
            <p class="loading-text">{{ theme.text.ui.loading }}</p>
          </template>
        </Suspense>

        <div
          v-if="weatherStore.locationDetected"
          class="weather-page__location-info"
        ></div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useWeatherStore } from "@/stores/weather";
import SearchBar from "@/components/molecules/SearchBar.vue";
import WeatherCard from "@/components/organisms/WeatherCard.vue";
import SiteNavigation from "@/components/molecules/SiteNavigation.vue";
import theme from "@/config/theme";

const weatherStore = useWeatherStore();
const isSearchActive = ref(false);

const handleSearchActive = (active: boolean) => {
  isSearchActive.value = active;
};

const handleSearch = async (query: string) => {
  await weatherStore.fetchWeather(query);
};

const formatCoords = (lat?: number, lon?: number): string => {
  if (!lat || !lon) return "";
  return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
};

// Initialize with geolocation on component mount
onMounted(async () => {
  await weatherStore.fetchWeatherByLocation();
});
</script>

<style scoped lang="scss">
.weather-page {
  color: v-bind("theme.colors.text.primary");
  font-family: v-bind("theme.typography.fontFamily.secondary");
  font-size: v-bind('theme.typography.fontSize["3xl"]');
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.01156rem;

  &__main {
    display: flex;
    flex-direction: column;
    gap: v-bind("theme.spacing.sm");
    margin: 0 auto;
    margin-top: v-bind("theme.spacing.xl");
  }

  &__location-info {
    text-align: center;
    margin-top: v-bind("theme.spacing.md");
  }
}

.search-bar-container {
  position: relative;
  z-index: v-bind("theme.zIndex.medium");
}

.loading-text {
  color: v-bind("theme.colors.text.primary");
  font-family: v-bind("theme.typography.fontFamily.primary");
  font-size: v-bind("theme.typography.fontSize.base");
  font-style: normal;
  font-weight: v-bind("theme.typography.fontWeight.normal");
  line-height: normal;
  letter-spacing: 0.03rem;
}

@media (min-width: 768px) {
  .weather-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .search-bar-container {
    display: flex;
    justify-content: center;
  }
}
</style>
