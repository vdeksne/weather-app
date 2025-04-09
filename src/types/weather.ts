import type { Ref } from "vue";

export interface CityData {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_max: number;
    temp_min: number;
  };
  weather: Array<{
    id(id: any): unknown;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
}

export interface WeatherError {
  message: string;
  cod: string;
}

export interface WeatherState {
  currentWeather: Ref<WeatherData | null>;
  loading: Ref<boolean>;
  error: Ref<WeatherError | null>;
  searchQuery: Ref<string>;
  locationDetected: Ref<boolean>;
  previewCity: Ref<CityData | null>;
}
