export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherError {
  message: string;
  cod: string;
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  loading: boolean;
  error: WeatherError | null;
  searchQuery: string;
}
