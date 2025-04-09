<template>
  <div class="main-container weather-view">
    <div
      class="current-day-display flex justify-between w-full flex-col p-4 pt-8"
    >
      <!-- Navbar -->
      <div class="flex items-center justify-between w-full">
        <div class="flex-0.5">
          <CityNavArrowIcon
            class="cursor-pointer hover:text-secondary"
            @click="router.push({ name: 'home' })"
          />
        </div>
        <h1 class="flex-1 text-center weather-view__h2">
          {{ route.query.city
          }}{{
            route.query.country === "US" && route.query.state
              ? `, ${route.query.state}`
              : ""
          }}{{
            route.query.country
              ? `, ${
                  countryNames[route.query.country as string] ||
                  route.query.country
                }`
              : ""
          }}
        </h1>
        <div class="flex-0.5 flex justify-end">
          <CityNavAddIcon
            v-if="!isSaved"
            class="cursor-pointer hover:text-secondary"
            @click="addCity"
          />
          <DeleteIcon
            v-if="isSaved"
            class="cursor-pointer hover:text-secondary"
            @click="deleteCity"
          />
        </div>
      </div>
      <!-- Current Day Display -->
      <div class="flex justify-center items-center flex-col">
        <p class="weather-view__h3 pt-5 pb-4">
          {{
            new Date(weatherData.currentTime).toLocaleDateString("en-us", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })
          }}
          {{
            new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
              timeStyle: "short",
            })
          }}
        </p>
        <img
          class="w-[4.5rem] h-[4.5rem]"
          :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
          alt=""
        />
        <p class="weather-view__h1 pb-1">
          {{ Math.round(weatherData.current.temp - 273.15) }}&deg;C
        </p>
        <p class="capitalize weather-view__description pb-8">
          {{ weatherData.current.weather[0].description }}
        </p>
      </div>
      <div class="flex justify-center items-center gap-2">
        <p class="weather-view__h3">
          Last update
          {{
            new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
              timeStyle: "short",
            })
          }}
        </p>
        <LastUpdate
          class="cursor-pointer hover:text-secondary"
          @click="reloadPage"
        />
      </div>
    </div>
    <!-- Hourly Forecast -->
    <div class="w-full py-2">
      <div class="mx-4">
        <h2 class="mb-4 mt-5 weather-view__hourly-title">Hourly Weather</h2>
        <div class="flex gap-1 overflow-x-scroll">
          <div
            v-for="hourData in weatherData.hourly"
            :key="hourData.dt"
            class="flex flex-col items-center hourly-item"
          >
            <img
              class="w-auto h-[50px] object-cover"
              :src="`https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
              alt=""
            />
            <div class="flex items-center gap-2">
              <p class="hourly-item__temp">
                {{ Math.round(hourData.temp - 273.15) }}&deg;
              </p>
            </div>
            <p class="text-md hourly-item__time">
              {{
                new Date(hourData.currentTime).toLocaleTimeString("en-us", {
                  hour: "numeric",
                })
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Weekly Forecast -->
    <div class="container w-full pb-0 pt-4 mx-0 mb-2">
      <h2 class="weekly-item-title">Weekly Forecast</h2>
    </div>
    <div class="py-4">
      <div class="weekly-forecast-container flex-wrap">
        <div
          v-for="day in weatherData.daily"
          :key="day.dt"
          class="flex items-center weekly-item p-4"
        >
          <img
            class="w-[50px] h-[50px] object-cover weekly-item__img"
            :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
            alt=""
          />
          <div class="weekly-item__day flex flex-col">
            <p class="weekly-item__day__day">
              {{
                new Date(day.dt * 1000).toLocaleDateString("en-us", {
                  weekday: "long",
                })
              }}
            </p>
            <span class="text-sm weekly-item__day__description capitalize">
              {{ day.weather[0].description }}
            </span>
          </div>

          <div class="flex gap-6 flex-1 justify-end items-center">
            <p class="weekly-item__temp">
              {{ Math.round((day.temp.max + day.temp.min) / 2 - 273.15) }}°C
            </p>
            <WeeklyArrowIcon />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import type { LocationQueryValue } from "vue-router";
import { onMounted, ref, computed } from "vue";
import CityNavArrowIcon from "@/components/atoms/icons/CityNavArrowIcon.vue";
import CityNavAddIcon from "@/components/atoms/icons/CityNavAddIcon.vue";
import DeleteIcon from "@/components/atoms/icons/DeleteIcon.vue";
import LastUpdate from "@/components/atoms/icons/LastUpdate.vue";
import { uid } from "uid";
import WeeklyArrowIcon from "@/components/atoms/icons/WeeklyArrowIcon.vue";
import theme from "@/config/theme";

const route = useRoute();

const countryNames: { [key: string]: string } = {
  US: "United States",
  GB: "United Kingdom",
  CN: "China",
  JP: "Japan",
  DE: "Germany",
  IN: "India",
  FR: "France",
  IT: "Italy",
  BR: "Brazil",
  CA: "Canada",
  RU: "Russia",
  KR: "South Korea",
  AU: "Australia",
  ES: "Spain",
  MX: "Mexico",
  ID: "Indonesia",
  NL: "Netherlands",
  SA: "Saudi Arabia",
  TR: "Turkey",
  CH: "Switzerland",
  SE: "Sweden",
  PL: "Poland",
  BE: "Belgium",
  TH: "Thailand",
  IR: "Iran",
  AT: "Austria",
  NO: "Norway",
  AE: "United Arab Emirates",
  IE: "Ireland",
  IL: "Israel",
  ZA: "South Africa",
  SG: "Singapore",
  HK: "Hong Kong",
  DK: "Denmark",
  FI: "Finland",
  EG: "Egypt",
  MY: "Malaysia",
  NG: "Nigeria",
  PH: "Philippines",
  PK: "Pakistan",
  CL: "Chile",
  CO: "Colombia",
  BD: "Bangladesh",
  VN: "Vietnam",
  RO: "Romania",
  CZ: "Czech Republic",
  PT: "Portugal",
  PE: "Peru",
  IQ: "Iraq",
  NZ: "New Zealand",
  QA: "Qatar",
  GR: "Greece",
  DZ: "Algeria",
  KZ: "Kazakhstan",
  HU: "Hungary",
  KW: "Kuwait",
  MA: "Morocco",
  PR: "Puerto Rico",
  EC: "Ecuador",
  SK: "Slovakia",
  CU: "Cuba",
  OM: "Oman",
  BG: "Bulgaria",
  VE: "Venezuela",
  HR: "Croatia",
  LB: "Lebanon",
  BY: "Belarus",
  LK: "Sri Lanka",
  DO: "Dominican Republic",
  LY: "Libya",
  SD: "Sudan",
  UY: "Uruguay",
  SI: "Slovenia",
  TN: "Tunisia",
  JO: "Jordan",
  AZ: "Azerbaijan",
  CR: "Costa Rica",
  PA: "Panama",
  LU: "Luxembourg",
  BA: "Bosnia and Herzegovina",
  GE: "Georgia",
  CM: "Cameroon",
  EE: "Estonia",
  CI: "Ivory Coast",
  LV: "Latvia",
  BH: "Bahrain",
  PY: "Paraguay",
  TZ: "Tanzania",
  ET: "Ethiopia",
  SV: "El Salvador",
  HN: "Honduras",
  KH: "Cambodia",
  BO: "Bolivia",
  UG: "Uganda",
  GT: "Guatemala",
  ZW: "Zimbabwe",
  LT: "Lithuania",
  TT: "Trinidad and Tobago",
  YE: "Yemen",
  SN: "Senegal",
  GH: "Ghana",
  MM: "Myanmar",
  CY: "Cyprus",
  AL: "Albania",
  KE: "Kenya",
  MU: "Mauritius",
  MD: "Moldova",
  MT: "Malta",
  MK: "North Macedonia",
  JM: "Jamaica",
  NA: "Namibia",
  BW: "Botswana",
  IS: "Iceland",
  ME: "Montenegro",
  MN: "Mongolia",
  MZ: "Mozambique",
  BN: "Brunei",
  AM: "Armenia",
  UZ: "Uzbekistan",
  GA: "Gabon",
  NP: "Nepal",
  BJ: "Benin",
  HT: "Haiti",
  MG: "Madagascar",
  CD: "DR Congo",
  ML: "Mali",
  BF: "Burkina Faso",
  PG: "Papua New Guinea",
  LA: "Laos",
  NI: "Nicaragua",
  ZM: "Zambia",
  AF: "Afghanistan",
  FJ: "Fiji",
  KG: "Kyrgyzstan",
  TJ: "Tajikistan",
  BZ: "Belize",
  RW: "Rwanda",
  TD: "Chad",
  MR: "Mauritania",
  MC: "Monaco",
  BI: "Burundi",
  DJ: "Djibouti",
  TM: "Turkmenistan",
  LS: "Lesotho",
  GQ: "Equatorial Guinea",
  CAF: "Central African Republic",
  CV: "Cape Verde",
  LR: "Liberia",
  SZ: "Eswatini",
  GM: "Gambia",
  GW: "Guinea-Bissau",
  SC: "Seychelles",
  SS: "South Sudan",
  ER: "Eritrea",
  SL: "Sierra Leone",
  SM: "San Marino",
  AD: "Andorra",
  KM: "Comoros",
  LI: "Liechtenstein",
  ST: "São Tomé and Príncipe",
  WS: "Samoa",
  TO: "Tonga",
  KI: "Kiribati",
  FM: "Micronesia",
  VU: "Vanuatu",
};

interface HourlyWeather {
  dt: number;
  currentTime?: number;
  [key: string]: any;
}

interface WeatherData {
  current: {
    dt: number;
  };
  timezone_offset: number;
  hourly: HourlyWeather[];
  currentTime?: number;
  [key: string]: any;
}

interface SavedLocation {
  id: string;
  state: string;
  city: string;
  coords: {
    lat: string;
    lon: string;
  };
}

const getWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${
        route.params.lat
      }&lon=${route.params.lon}&exclude={part}&appid=${
        import.meta.env.VITE_OPENWEATHER_API_KEY
      }`
    );

    // Calculate current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = response.data.current.dt * 1000 + localOffset;
    response.data.currentTime = utc + 1000 * response.data.timezone_offset;

    // Calculate hourly weather offset
    response.data.hourly.forEach((hour: HourlyWeather) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * response.data.timezone_offset;
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const weatherData = await getWeatherData();

console.log(weatherData);

const savedCities = ref<SavedLocation[]>([]);
const isSaved = ref(false);

// Initialize isSaved
const checkIfSaved = () => {
  const savedCitiesStr = localStorage.getItem("savedCities");
  if (!savedCitiesStr) {
    isSaved.value = false;
    return;
  }

  const cities = JSON.parse(savedCitiesStr);
  isSaved.value = cities.some(
    (city: SavedLocation) =>
      city.city === route.query.city?.toString() &&
      city.coords.lat === route.params.lat?.toString()
  );
};

// Check initially
checkIfSaved();

const addCity = () => {
  const savedCitiesStr = localStorage.getItem("savedCities");
  if (savedCitiesStr) {
    savedCities.value = JSON.parse(savedCitiesStr);
  }

  const locationObj = {
    id: uid(),
    state: route.query.state?.toString() || "",
    city: route.query.city?.toString() || "",
    coords: {
      lat: route.params.lat?.toString() || "",
      lon: route.params.lon?.toString() || "",
    },
  };

  savedCities.value.push(locationObj);
  localStorage.setItem("savedCities", JSON.stringify(savedCities.value));
  isSaved.value = true;

  let query = Object.assign({}, route.query);
  delete query.preview;
  router.replace({ query });
};

const router = useRouter();
const deleteCity = () => {
  const savedCitiesStr = localStorage.getItem("savedCities");
  if (!savedCitiesStr) return;

  const cities = JSON.parse(savedCitiesStr);
  const filteredCities = cities.filter(
    (city: SavedLocation) =>
      !(
        city.city === route.query.city?.toString() &&
        city.coords.lat === route.params.lat?.toString()
      )
  );

  localStorage.setItem("savedCities", JSON.stringify(filteredCities));
  savedCities.value = filteredCities;
  isSaved.value = false;

  router.push({
    name: "home",
  });
};

const reloadPage = () => {
  window.location.reload();
};

// Add CSS variables to the root element
onMounted(() => {
  const root = document.documentElement;
  root.style.setProperty("--primary-light", theme.colors.primary.light);
  root.style.setProperty("--primary-main", theme.colors.primary.main);
  root.style.setProperty("--primary-dark", theme.colors.primary.dark);
  root.style.setProperty("--text-light", theme.colors.text.light);
  root.style.setProperty("--text-primary", theme.colors.text.primary);
  root.style.setProperty("--text-tertiary", theme.colors.text.tertiary);
  root.style.setProperty(
    "--background-default",
    theme.colors.background.default
  );
  root.style.setProperty("--background-blue", theme.colors.background.blue);
  root.style.setProperty(
    "--font-family-primary",
    theme.typography.fontFamily.primary
  );
  root.style.setProperty(
    "--font-size-xs",
    theme.typography.fontSize.xs.toString()
  );
  root.style.setProperty(
    "--font-size-sm",
    theme.typography.fontSize.sm.toString()
  );
  root.style.setProperty(
    "--font-size-xl",
    theme.typography.fontSize.xl.toString()
  );
  root.style.setProperty(
    "--font-weight-normal",
    theme.typography.fontWeight.normal.toString()
  );
  root.style.setProperty(
    "--font-weight-medium",
    theme.typography.fontWeight.medium.toString()
  );
  root.style.setProperty(
    "--font-weight-semibold",
    theme.typography.fontWeight.semibold.toString()
  );
  root.style.setProperty(
    "--border-radius-sm",
    theme.borderRadius.sm.toString()
  );
  root.style.setProperty(
    "--border-radius-lg",
    theme.borderRadius.lg.toString()
  );
});
</script>

<style scoped lang="scss">
.current-day-display {
  background: linear-gradient(
    118deg,
    #4f80fa 1.2%,
    #3764d7 59.26%,
    #335fd1 79.2%
  );
}

.weather-view {
  font-family: var(--font-family-primary);
  font-style: normal;
  line-height: normal;

  &__h1 {
    font-family: var(--font-family-primary);
    font-style: normal;
    line-height: normal;
    color: var(--text-light);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-normal);
  }

  &__h2 {
    font-family: var(--font-family-primary);
    font-style: normal;
    line-height: normal;
    color: var(--text-light);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  &__h3 {
    font-family: var(--font-family-primary);
    font-style: normal;
    line-height: normal;
    color: var(--text-light);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
  }

  &__description {
    font-family: var(--font-family-primary);
    font-style: normal;
    line-height: normal;
    color: var(--text-light);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
  }

  &__hourly-title {
    font-family: var(--font-family-primary);
    font-style: normal;
    line-height: normal;
    color: var(--text-primary);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    text-align: left;
  }

  .hourly-item {
    width: 4.875rem;
    height: 6.6875rem;
    flex-shrink: 0;
    border-radius: var(--border-radius-sm);
    background: #e3e3e3;
    font-family: var(--font-family-primary);
    font-style: normal;
    line-height: normal;
    padding: 0.2rem 1rem;

    &__time {
      font-family: var(--font-family-primary);
      font-style: normal;
      line-height: normal;
      color: var(--text-tertiary);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-normal);
    }

    &__temp {
      font-family: var(--font-family-primary);
      font-style: normal;
      line-height: normal;
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      margin-bottom: 0.5rem;
    }
  }

  .weekly-item {
    max-width: 21.4375rem;
    height: 4.5rem;
    flex-shrink: 0;
    border-radius: var(--border-radius-lg);
    background: #d2dfff;
    color: var(--text-primary);
    font-family: var(--font-family-primary);
    font-style: normal;
    line-height: normal;
    margin-bottom: 0.75rem;

    &__img {
      border-radius: 1.5625rem;
      background: #9ab6ff;
      width: 2.5rem;
      height: 2.5rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }

    &__day {
      font-family: var(--font-family-primary);
      font-style: normal;
      line-height: normal;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: left;
      gap: 0.2rem;

      &__day {
        color: var(--text-primary);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
      }

      &__description {
        color: var(--text-tertiary);
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-normal);
      }
    }

    &__temp {
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }
  }

  .weekly-item-title {
    color: var(--text-primary);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    text-align: left;
  }
}

.city-name {
  font-family: "SF Pro Display", sans-serif;
}

.temperature {
  font-family: "SF Pro Display", sans-serif;
}

.weather-condition {
  font-family: "SF Pro Display", sans-serif;
}

.last-updated {
  font-family: "SF Pro Display", sans-serif;
}

.time {
  font-family: "SF Pro Display", sans-serif;
}

.date {
  font-family: "SF Pro Display", sans-serif;
}

.hourly-item {
  font-family: "SF Pro Display", sans-serif;
}

.hourly-temp {
  font-family: "SF Pro Display", sans-serif;
}

.hourly-time {
  font-family: "SF Pro Display", sans-serif;
}

.daily-item {
  font-family: "SF Pro Display", sans-serif;
}

.daily-temp {
  font-family: "SF Pro Display", sans-serif;
}

.daily-date {
  font-family: "SF Pro Display", sans-serif;
}

.daily-condition {
  font-family: "SF Pro Display", sans-serif;
}

.daily-high {
  font-family: "SF Pro Display", sans-serif;
}

.daily-low {
  font-family: "SF Pro Display", sans-serif;
}

.daily-precipitation {
  font-family: "SF Pro Display", sans-serif;
}

@media (min-width: 768px) {
  .weekly-forecast-container {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    width: 100%;
    justify-content: center;
  }
  .weather-view {
    .weekly-item {
      width: 21.4375rem;
    }
  }
}
</style>
