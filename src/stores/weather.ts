import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  WeatherData,
  WeatherError,
  CityData,
  WeatherState,
} from "@/types/weather";
import { weatherApi } from "@/api/weather";

const DEFAULT_CITY = "London";

export const useWeatherStore = defineStore("weather", {
  state: () => ({
    currentWeather: null as WeatherData | null,
    loading: false,
    error: null as WeatherError | null,
    searchQuery: "",
    locationDetected: false,
    previewCity: null as CityData | null,
    detectedLocation: null as { lat: number; lon: number; city: string } | null,
  }),

  actions: {
    getErrorMessage(error: WeatherError): string {
      switch (error.cod) {
        case "401":
          return "Invalid API key. Please check your OpenWeatherMap API key configuration.";
        case "404":
          return "City not found. Please check the city name and try again.";
        case "429":
          return "Too many requests. Please try again later.";
        case "500":
          return "Server error. Please try again later.";
        default:
          return (
            error.message || "An unexpected error occurred. Please try again."
          );
      }
    },

    async getCurrentLocation(): Promise<{ lat: number; lon: number } | null> {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.log("Geolocation not supported");
          resolve(null);
          return;
        }

        let watchId: number;
        let isResolved = false;
        const maxAttempts = 2;
        let attempts = 0;

        const cleanup = () => {
          if (watchId) {
            navigator.geolocation.clearWatch(watchId);
          }
        };

        const saveLocation = (location: { lat: number; lon: number }) => {
          this.detectedLocation = {
            ...location,
            city: this.currentWeather?.name || DEFAULT_CITY,
          };
          localStorage.setItem(
            "detectedLocation",
            JSON.stringify(this.detectedLocation)
          );
        };

        const tryIPLocation = async () => {
          if (isResolved) return;
          isResolved = true;
          cleanup();

          try {
            console.log("Trying IP-based location...");
            const location = await weatherApi.getLocationByIP();
            this.locationDetected = true;
            saveLocation(location);
            resolve(location);
          } catch (err) {
            console.log("IP location fallback failed, using default city");
            resolve(null);
          }
        };

        const handleError = async (error: GeolocationPositionError) => {
          if (isResolved) return;
          attempts++;
          console.log(`Geolocation attempt ${attempts} failed:`, error.message);

          if (error.code === error.PERMISSION_DENIED) {
            tryIPLocation();
            return;
          }

          if (attempts >= maxAttempts) {
            tryIPLocation();
            return;
          }

          console.log("Waiting for next position update...");
        };

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (isResolved) return;
            isResolved = true;
            cleanup();
            this.locationDetected = true;
            const location = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };
            saveLocation(location);
            resolve(location);
          },
          handleError,
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0,
          }
        );

        setTimeout(() => {
          if (isResolved) return;
          console.log("Location timeout reached, falling back to IP");
          tryIPLocation();
        }, 10000);
      });
    },

    async fetchWeatherByLocation() {
      try {
        this.loading = true;
        this.error = null;

        // Try to load saved location first
        const savedLocation = localStorage.getItem("detectedLocation");
        let location = savedLocation ? JSON.parse(savedLocation) : null;

        // If no saved location or forcing refresh, get current location
        if (!location) {
          location = await this.getCurrentLocation();
        }

        if (location) {
          const weather = await weatherApi.getWeatherByCoordinates(
            location.lat,
            location.lon
          );
          this.currentWeather = weather;
          this.searchQuery = weather.name;

          // Update saved city name if it changed
          if (
            this.detectedLocation &&
            this.detectedLocation.city !== weather.name
          ) {
            this.detectedLocation.city = weather.name;
            localStorage.setItem(
              "detectedLocation",
              JSON.stringify(this.detectedLocation)
            );
          }
        } else {
          await this.fetchWeather(DEFAULT_CITY);
        }
      } catch (err) {
        console.log("Weather fetch error:", err);
        this.currentWeather = null;
        await this.fetchWeather(DEFAULT_CITY);
      } finally {
        this.loading = false;
      }
    },

    async fetchWeather(city: string) {
      try {
        this.loading = true;
        this.error = null;
        const weather = await weatherApi.getCurrentWeather(city);
        this.currentWeather = weather;
        this.searchQuery = city;
      } catch (err) {
        this.error = {
          message:
            err instanceof Error ? err.message : "Failed to fetch weather data",
          cod: "500",
        };
        this.currentWeather = null;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
