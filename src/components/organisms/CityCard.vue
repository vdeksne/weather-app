<template>
  <div
    class="weather-card"
    :style="{
      backgroundImage: props.city.weather
        ? `url(${getWeatherBackground(props.city.weather)})`
        : 'none',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundBlendMode: 'overlay',
    }"
  >
    <div v-if="props.city.weather" class="weather-card__content">
      <div class="weather-card__main flex justify-between">
        <div class="flex flex-col items-start">
          <h2 class="weather-card__title">
            {{ props.city.city }}
          </h2>
          <div class="weather-card__time">
            {{ formatLocalTime(props.city.weather.timezone) }}
          </div>
        </div>

        <div class="weather-card__temperature">
          <span class="weather-card__temp-value"
            >{{ Math.round(props.city.weather.main.temp) }}°C</span
          >
        </div>
      </div>
      <div class="weather-card__main flex justify-between items-end">
        <div class="weather-card__description capitalize">
          {{ props.city.weather.weather[0].description }}
        </div>
        <div class="weather-card__details">
          <div class="weather-card__detail-item">
            <span class="weather-card__label">H:</span>
            <span class="weather-card__value"
              >{{ Math.round(props.city.weather.main.temp_max) }}°C</span
            >
          </div>
          <div class="weather-card__detail-item">
            <span class="weather-card__label">L:</span>
            <span class="weather-card__value"
              >{{ Math.round(props.city.weather.main.temp_min) }}°C</span
            >
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="props.city.loading" class="weather-card__loading">
      Loading weather data...
    </div>

    <div v-else-if="props.city.error" class="weather-card__error">
      {{ props.city.error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface WeatherData {
  name: string;
  timezone: number;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: [
    {
      description: string;
      id: number;
    }
  ];
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface City {
  id?: string;
  city: string;
  state?: string;
  weather?: WeatherData;
  loading?: boolean;
  error?: {
    message: string;
  };
}

const props = defineProps<{
  city: City;
}>();

// Import all weather background images
const weatherBackgrounds = {
  SunnyDay: new URL("@/assets/images/SunnyDay.jpg", import.meta.url).href,
  SunnyNight: new URL("@/assets/images/ClearNight.jpg", import.meta.url).href,
  PartlyCloudyDay: new URL(
    "@/assets/images/PartlyCloudyDay.jpg",
    import.meta.url
  ).href,
  PartlyCloudyNight: new URL(
    "@/assets/images/PartlyCloudyNight.jpg",
    import.meta.url
  ).href,
  CloudyDay: new URL("@/assets/images/CloudyDay.jpg", import.meta.url).href,
  CloudyNight: new URL("@/assets/images/CloudyNight.jpg", import.meta.url).href,
  RainyDay: new URL("@/assets/images/RainyDay.jpg", import.meta.url).href,
  RainyNight: new URL("@/assets/images/RainyNight.jpg", import.meta.url).href,
  ThunderstormDay: new URL(
    "@/assets/images/ThunderstormDay.jpg",
    import.meta.url
  ).href,
  ThunderstormNight: new URL(
    "@/assets/images/ThunderstormNight.jpg",
    import.meta.url
  ).href,
  SnowDay: new URL("@/assets/images/SnowDay.jpg", import.meta.url).href,
  SnowNight: new URL("@/assets/images/SnowNight.jpg", import.meta.url).href,
  FogDay: new URL("@/assets/images/FogDay.jpg", import.meta.url).href,
  FogNight: new URL("@/assets/images/FogNight.jpg", import.meta.url).href,
  DrizzleDay: new URL("@/assets/images/DrizzleDay.jpg", import.meta.url).href,
  DrizzleNight: new URL("@/assets/images/DrizzleNight.jpg", import.meta.url)
    .href,
};

function getWeatherBackground(weather: WeatherData): string {
  const isDay = () => {
    const now = new Date().getTime() / 1000;
    return now >= weather.sys.sunrise && now <= weather.sys.sunset;
  };

  const getWeatherCategory = (id: number): string => {
    // Get first digit of weather code
    const category = Math.floor(id / 100);

    switch (category) {
      case 2:
        return "Thunderstorm";
      case 3:
        return "Drizzle";
      case 5:
        return "Rainy";
      case 6:
        return "Snow";
      case 7:
        return "Fog";
      case 8:
        return id === 800
          ? "Sunny"
          : id === 801 || id === 802
          ? "PartlyCloudy"
          : "Cloudy";
      default:
        return "Sunny";
    }
  };
  const timeOfDay = isDay() ? "Day" : "Night";
  const weatherCategory = getWeatherCategory(Number(weather.weather[0].id));
  const imageKey = `${weatherCategory}${timeOfDay}`;

  return (
    weatherBackgrounds[imageKey as keyof typeof weatherBackgrounds] ||
    weatherBackgrounds.SunnyDay
  );
}

function formatLocalTime(timezoneOffset: number): string {
  const localTime = new Date();
  const utc = localTime.getTime() + localTime.getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + 1000 * timezoneOffset);

  return cityTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
</script>

<style scoped lang="scss">
.weather-card {
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 21.4375rem;
  height: 7.3125rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.25s ease-in-out;

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__header {
    text-align: center;
  }

  &__title {
    color: #fff;
    font-family: "SF Pro Display", sans-serif;
    font-size: v-bind("props.city.city.length > 10 ? '1rem' : '1.5625rem'");
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.01563rem;
    text-align: left;
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
    color: #fff;
    font-family: "SF Pro Display", sans-serif;
    font-size: 3.3125rem;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0.34781rem;
  }

  &__icon {
    width: 64px;
    height: 64px;
  }

  &__description {
    color: #fff;
    font-family: "SF Pro Display", sans-serif;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.1875rem; /* 118.75% */
    letter-spacing: 0.01rem;
  }

  &__details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  &__detail-item {
    color: #fff;
    font-family: "SF Pro Display", sans-serif;
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 133.333% */
    letter-spacing: 0.04688rem;
  }

  &__label {
    color: #fff;
    font-family: "SF Pro Display", sans-serif;
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 133.333% */
    letter-spacing: 0.04688rem;
  }

  &__value {
    color: #fff;
    font-family: "SF Pro Display", sans-serif;
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 133.333% */
    letter-spacing: 0.04688rem;
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
  &__time {
    color: #fff;
    font-family: "SF Pro Display", sans-serif;
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 133.333% */
    letter-spacing: 0.00938rem;
  }
}
.weather-card:hover {
  transform: scale(1.02);
  transition: all 0.25s ease-in-out;
}

@media (min-width: 768px) {
  .weather-card {
    width: 30rem;
  }
}
</style>
