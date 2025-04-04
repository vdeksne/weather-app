import axios from "axios";
import type { WeatherData } from "@/types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherApi = {
  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message:
            error.response?.data?.message || "Failed to fetch weather data",
          cod: error.response?.data?.cod || "500",
        };
      }
      throw error;
    }
  },
};
