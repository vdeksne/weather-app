<template>
  <!-- Current Weather Card -->
  <div v-if="weather">
    <CityCard
      :city="{
        id: 'current',
        city: weather.name,
        state: '',
        coords: weather.coord || { lat: 0, lon: 0 },
        weather: weather,
      }"
      @click="
        goToCityView({
          id: 'current',
          city: weather.name,
          state: '',
          coords: weather.coord || { lat: 0, lon: 0 },
        })
      "
    />
  </div>

  <!-- Saved Locations -->
  <div v-for="city in savedCities" :key="city.id">
    <CityCard
      :city="{
        ...city,
        weather: city.weather,
      }"
      @click="goToCityView(city)"
    />
  </div>

  <p
    v-if="!weather && savedCities.length === 0"
    class="text-center text-gray-500 mt-4 text-sm"
  >
    No locations added. To start tracking a location, search in the field above.
  </p>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CityCard from "./CityCard.vue";

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
  coord?: {
    lat: number;
    lon: number;
  };
}

interface City {
  id: string;
  city: string;
  state: string;
  coords: {
    lat: number;
    lon: number;
  };
  weather?: WeatherData;
  loading?: boolean;
  error?: {
    message: string;
  };
}

const props = defineProps<{
  weather: WeatherData | null;
  loading: boolean;
  error: { message: string } | null;
}>();

const savedCities = ref<City[]>([]);
const getCities = async () => {
  const savedCitiesStr = localStorage.getItem("savedCities");
  if (savedCitiesStr) {
    savedCities.value = JSON.parse(savedCitiesStr) as City[];
    const requests: Promise<WeatherData>[] = [];
    savedCities.value.forEach((city: City) => {
      requests.push(
        axios
          .get<WeatherData>(
            `https://api.openweathermap.org/data/2.5/weather?lat=${
              city.coords.lat
            }&lon=${city.coords.lon}&appid=${
              import.meta.env.VITE_OPENWEATHER_API_KEY
            }&units=metric`
          )
          .then((response) => response.data)
      );
    });

    const weatherData = await Promise.all(requests);
    weatherData.forEach((value, index) => {
      savedCities.value[index].weather = value;
    });
  }
};
await getCities();

const router = useRouter();
const goToCityView = (city: City) => {
  router.push({
    name: "cityView",
    params: {
      lat: city.coords.lat.toString(),
      lon: city.coords.lon.toString(),
    },
    query: {
      id: city.id,
      city: city.city,
      state: city.state,
      lat: city.coords.lat,
      lon: city.coords.lon,
    },
  });
};

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

function getWeatherBackground(weather: WeatherData): string {
  const isDay = () => {
    const now = new Date().getTime() / 1000;
    return now >= weather.sys.sunrise && now <= weather.sys.sunset;
  };

  const getWeatherCategory = (id: number): string => {
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
  const weatherCategory = getWeatherCategory(weather.weather[0].id);
  const imageKey = `${weatherCategory}${timeOfDay}`;

  return (
    weatherBackgrounds[imageKey as keyof typeof weatherBackgrounds] ||
    weatherBackgrounds.SunnyDay
  );
}

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
} as const;
</script>
