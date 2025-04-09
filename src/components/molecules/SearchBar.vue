<template>
  <div class="search-bar">
    <div class="search-input">
      <div class="search-input__wrapper">
        <MicrophoneIcon
          v-if="showMicrophoneIcon"
          class="search-input__icon"
          @click="startSpeechRecognition"
        />
        <SearchIcon v-else class="search-input__icon" style="display: flex" />
        <input
          type="text"
          id="city-search"
          name="city-search"
          autocomplete="off"
          v-model="searchQuery"
          @input="getSearchResults"
          @blur="handleBlur"
          placeholder="Search for a city or airport"
          class="search-input__field"
        />
        <CloseSearchIcon
          v-if="searchQuery.length > 0"
          class="search-input__icon"
          @click="
            () => {
              searchQuery = '';
              searchResults = [];
              emit('search-active', false);
            }
          "
        />
      </div>
      <ul
        class="search-input__suggestions w-full top-[50px] flex flex-col gap-2 align-start"
        v-if="searchQuery.length > 0"
      >
        <p v-if="searchError" class="text-red-500 error-message">
          Error fetching search results, please try again.
        </p>
        <p
          v-else-if="searchResults.length === 0"
          class="text-red-500 error-message"
        >
          No results found, please try again.
        </p>

        <template v-else>
          <li
            v-for="(searchResult, index) in searchResults"
            :key="`${searchResult.lat}-${searchResult.lon}`"
            @click="previewCity(searchResult)"
            class="search-suggestion"
            :class="{
              'search-suggestion--divider': index !== searchResults.length - 1,
            }"
            v-html="formatLocation(searchResult)"
          ></li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";
import { useWeatherStore } from "@/stores/weather";
import { useRouter } from "vue-router";
import CloseSearchIcon from "../atoms/icons/CloseSearchIcon.vue";
import MicrophoneIcon from "../atoms/icons/MicrophoneIcon.vue";
import SearchIcon from "../atoms/icons/SearchIcon.vue";

// Add type definitions for speech recognition
interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

const router = useRouter();
const emit = defineEmits<{
  (e: "search", query: string): void;
  (e: "search-active", active: boolean): void;
}>();

const previewCity = (searchResult: Location) => {
  weatherStore.previewCity = searchResult;
  emit("search-active", false);
  router.push({
    name: "cityView",
    params: {
      lat: searchResult.lat.toString(),
      lon: searchResult.lon.toString(),
    },
    query: {
      city: searchResult.name,
      state: searchResult.state || "",
      country: searchResult.country,
    },
  });
};

const weatherStore = useWeatherStore();
const searchQuery = ref("");
const queryTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const VITE_OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
console.log("API Key available:", !!VITE_OPENWEATHER_API_KEY);
const searchError = ref(false);

interface Location {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}
const searchResults = ref<Location[]>([]);
const countryNames: { [key: string]: string } = {
  US: "United States",
  GB: "United Kingdom",
  IT: "Italy",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  LV: "Latvia",
  RU: "Russia",
  CA: "Canada",
  AU: "Australia",
  JP: "Japan",
  CN: "China",
  IN: "India",
  BR: "Brazil",
  MX: "Mexico",
  AR: "Argentina",
  PT: "Portugal",
  NL: "Netherlands",
  BE: "Belgium",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  CZ: "Czech Republic",
  AT: "Austria",
  CH: "Switzerland",
  GR: "Greece",
  TR: "Turkey",
  ZA: "South Africa",
  KR: "South Korea",
  TH: "Thailand",
  SG: "Singapore",
  NZ: "New Zealand",
};
const stateAbbreviations: { [key: string]: string } = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};
const formatLocation = (location: Location): string => {
  const countryName = countryNames[location.country] || location.country;
  if (location.state) {
    return `<span class="city-name">${location.name}</span><span class="location-detail">, ${location.state}, ${countryName}</span>`;
  }
  return `<span class="city-name">${location.name}</span><span class="location-detail">, ${countryName}</span>`;
};

const getSearchResults = async () => {
  if (queryTimeout.value) {
    clearTimeout(queryTimeout.value);
  }
  searchError.value = false;
  emit("search-active", searchQuery.value.length > 0);

  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery.value}&limit=5&appid=${VITE_OPENWEATHER_API_KEY}&types=city,airport`
        );

        // Create a Map to store unique locations
        const uniqueLocations = new Map();

        // Process each result and only keep unique combinations
        response.data.forEach((city: any) => {
          const locationKey = `${city.name}-${city.state || ""}-${
            city.country
          }`;
          if (!uniqueLocations.has(locationKey)) {
            uniqueLocations.set(locationKey, {
              name: city.name,
              state: city.state || "",
              country: city.country,
              lat: city.lat,
              lon: city.lon,
              local_names: city.local_names,
            });
          }
        });

        // Convert Map values back to array
        searchResults.value = Array.from(uniqueLocations.values());
      } catch (error) {
        searchError.value = true;
        searchResults.value = [];
        console.error("Error fetching search results:", error);
      }
    } else {
      searchResults.value = [];
    }
  }, 300);
};

// Add blur handler to detect when search is no longer active
const handleBlur = () => {
  // Small delay to allow for click events on search results
  setTimeout(() => {
    if (searchQuery.value === "") {
      emit("search-active", false);
    }
  }, 200);
};

const isSpeechRecognitionSupported = () => {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
};

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const startSpeechRecognition = () => {
  if (!isSpeechRecognitionSupported()) {
    alert(
      "Speech recognition is not supported in your browser. Please try using Chrome on desktop or Android."
    );
    return;
  }

  if (isMobileDevice() && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    alert(
      "Speech recognition is not supported in Safari on iOS. Please try using the keyboard instead."
    );
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    console.log("Speech recognition started");
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed") {
      alert("Please enable microphone access to use speech recognition.");
    } else {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition failed. Please try again or use the keyboard.");
    }
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchQuery.value = transcript;
    getSearchResults();
  };

  recognition.onend = () => {
    console.log("Speech recognition ended");
  };

  try {
    recognition.start();
  } catch (error) {
    console.error("Speech recognition error:", error);
    alert("Could not start speech recognition. Please try again.");
  }
};

const showMicrophoneIcon = computed(() => {
  return (
    isSpeechRecognitionSupported() &&
    (!isMobileDevice() || !/iPhone|iPad|iPod/i.test(window.navigator.userAgent))
  );
});
</script>

<style lang="scss">
.city-name {
  color: #000;

  font-family: "SF Pro Display", sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.00438rem;
}

.location-detail {
  color: #545454;
  font-family: "SF Pro Display", sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.00438rem;
}
</style>

<style scoped lang="scss">
.search-bar {
  width: 100%;
  margin: 0 auto;
}

.search-input {
  position: relative;
  width: 100%;

  &__wrapper {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 21.4375rem;
    height: 2.4375rem;
    padding: 0.5rem 0.6875rem;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.625rem;
    background: #f7f7f9;
  }

  &__icon {
    margin-right: 0;
    color: #8c939d;
    cursor: pointer;
  }

  &__field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: #000;
    font-family: "SF Pro Display", sans-serif;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.03rem;
    opacity: 0.5;
  }

  &__suggestions {
    position: absolute;
    background: white;
    z-index: 10;
    display: flex;
    align-items: flex-start;
    text-align: left;
    font-family: "SF Pro Display", sans-serif;
  }
}

.search-suggestion {
  padding: 0.75rem 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: "SF Pro Display", sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.00438rem;
  transition: all 0.2s ease;

  &:hover {
    scale: 1.01;
  }

  &--divider {
    border-bottom: 1px solid #e5e7eb;
    width: 100%;
  }
}

.error-message {
  color: #545454;
  font-family: "SF Pro Display", sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.00438rem;
}

@media (min-width: 768px) {
  .search-input {
    width: 30rem;
    display: flex;
    justify-content: center;
  }
}
</style>
