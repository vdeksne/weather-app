import axios from "axios";
import type { WeatherData } from "@/types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delayMs: number = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await delay(delayMs);
    return retryWithBackoff(fn, retries - 1, delayMs * 2);
  }
}

export const weatherApi = {
  async getCurrentWeather(city: string): Promise<WeatherData> {
    return retryWithBackoff(async () => {
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
    });
  },

  async getWeatherByCoordinates(
    lat: number,
    lon: number
  ): Promise<WeatherData> {
    return retryWithBackoff(async () => {
      try {
        const response = await axios.get(`${BASE_URL}/weather`, {
          params: {
            lat,
            lon,
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
    });
  },

  async getLocationByIP(): Promise<{ lat: number; lon: number }> {
    try {
      const response = await axios.get(`http://ip-api.com/json/`);
      return {
        lat: response.data.lat,
        lon: response.data.lon,
      };
    } catch (error) {
      throw error;
    }
  },

  getUSState(cityName: string): string | undefined {
    // Common US city patterns with their states
    const statePatterns: { [key: string]: string } = {
      "New York": "NY",
      "Los Angeles": "CA",
      Chicago: "IL",
      Houston: "TX",
      Phoenix: "AZ",
      Philadelphia: "PA",
      "San Antonio": "TX",
      "San Diego": "CA",
      Dallas: "TX",
      "San Jose": "CA",
      Miami: "FL",
      Atlanta: "GA",
      Boston: "MA",
      "San Francisco": "CA",
      Detroit: "MI",
      Seattle: "WA",
      Denver: "CO",
      Washington: "DC",
      Nashville: "TN",
      "Las Vegas": "NV",
      Portland: "OR",
      "New Orleans": "LA",
      Cleveland: "OH",
      Minneapolis: "MN",
      Milwaukee: "WI",
      Milan: "TN",
      Paris: "TX",
      London: "KY",
      Berlin: "NH",
      Rome: "GA",
      Madrid: "NM",
      Moscow: "ID",
      Dublin: "CA",
      Venice: "FL",
      Naples: "FL",
      Florence: "AL",
      Barcelona: "NM",
      Vienna: "VA",
      Athens: "GA",
      Springfield: "IL", // Added Springfield
    };

    console.log("Looking up state for city:", cityName);
    const state = statePatterns[cityName];
    console.log("Found state:", state);
    return state;
  },

  async getCitySuggestions(
    query: string
  ): Promise<Array<{ name: string; country: string; state?: string }>> {
    try {
      const response = await axios.get(`${BASE_URL}/find`, {
        params: {
          q: query,
          appid: API_KEY,
          limit: 10,
        },
      });

      // Process all cities and add state information for US cities
      const cities = response.data.list
        .filter((city: any) => {
          // Filter out district-level results (e.g., "Paris 14")
          // This regex checks if there's a number after the city name
          return !/\s+\d+$/.test(city.name);
        })
        .map((city: any) => {
          const isUSCity = city.sys.country === "US";
          let state = isUSCity ? this.getUSState(city.name) : undefined;

          // For US cities without a state match in our patterns,
          // we should keep them but without a state rather than excluding them
          // This allows cities like Springfield, MO or Springfield, MA to show up
          // even if not in our predefined patterns
          return {
            name: city.name,
            country: this.getFullCountryName(city.sys.country),
            state,
          };
        });

      // Remove duplicates based on city name, country, and state
      const uniqueCities = new Map();
      cities.forEach(
        (city: { name: string; country: string; state?: string }) => {
          const key = `${city.name}-${city.country}-${city.state || ""}`;
          if (!uniqueCities.has(key)) {
            uniqueCities.set(key, city);
          }
        }
      );

      return Array.from(uniqueCities.values());
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      return [];
    }
  },

  getFullCountryName(code: string): string {
    const countries: { [key: string]: string } = {
      AF: "Afghanistan",
      AL: "Albania",
      DZ: "Algeria",
      AD: "Andorra",
      AO: "Angola",
      AG: "Antigua and Barbuda",
      AR: "Argentina",
      AM: "Armenia",
      AU: "Australia",
      AT: "Austria",
      AZ: "Azerbaijan",
      BS: "Bahamas",
      BH: "Bahrain",
      BD: "Bangladesh",
      BB: "Barbados",
      BY: "Belarus",
      BE: "Belgium",
      BZ: "Belize",
      BJ: "Benin",
      BT: "Bhutan",
      BO: "Bolivia",
      BA: "Bosnia and Herzegovina",
      BW: "Botswana",
      BR: "Brazil",
      BN: "Brunei",
      BG: "Bulgaria",
      BF: "Burkina Faso",
      BI: "Burundi",
      KH: "Cambodia",
      CM: "Cameroon",
      CA: "Canada",
      CV: "Cape Verde",
      CF: "Central African Republic",
      TD: "Chad",
      CL: "Chile",
      CN: "China",
      CO: "Colombia",
      KM: "Comoros",
      CG: "Congo",
      CD: "Congo, Democratic Republic",
      CR: "Costa Rica",
      CI: "Côte d'Ivoire",
      HR: "Croatia",
      CU: "Cuba",
      CY: "Cyprus",
      CZ: "Czech Republic",
      DK: "Denmark",
      DJ: "Djibouti",
      DM: "Dominica",
      DO: "Dominican Republic",
      EC: "Ecuador",
      EG: "Egypt",
      SV: "El Salvador",
      GQ: "Equatorial Guinea",
      ER: "Eritrea",
      EE: "Estonia",
      ET: "Ethiopia",
      FJ: "Fiji",
      FI: "Finland",
      FR: "France",
      GA: "Gabon",
      GM: "Gambia",
      GE: "Georgia",
      DE: "Germany",
      GH: "Ghana",
      GR: "Greece",
      GD: "Grenada",
      GT: "Guatemala",
      GN: "Guinea",
      GW: "Guinea-Bissau",
      GY: "Guyana",
      HT: "Haiti",
      HN: "Honduras",
      HU: "Hungary",
      IS: "Iceland",
      IN: "India",
      ID: "Indonesia",
      IR: "Iran",
      IQ: "Iraq",
      IE: "Ireland",
      IL: "Israel",
      IT: "Italy",
      JM: "Jamaica",
      JP: "Japan",
      JO: "Jordan",
      KZ: "Kazakhstan",
      KE: "Kenya",
      KI: "Kiribati",
      KP: "North Korea",
      KR: "South Korea",
      KW: "Kuwait",
      KG: "Kyrgyzstan",
      LA: "Laos",
      LV: "Latvia",
      LB: "Lebanon",
      LS: "Lesotho",
      LR: "Liberia",
      LY: "Libya",
      LI: "Liechtenstein",
      LT: "Lithuania",
      LU: "Luxembourg",
      MK: "North Macedonia",
      MG: "Madagascar",
      MW: "Malawi",
      MY: "Malaysia",
      MV: "Maldives",
      ML: "Mali",
      MT: "Malta",
      MH: "Marshall Islands",
      MR: "Mauritania",
      MU: "Mauritius",
      MX: "Mexico",
      FM: "Micronesia",
      MD: "Moldova",
      MC: "Monaco",
      MN: "Mongolia",
      ME: "Montenegro",
      MA: "Morocco",
      MZ: "Mozambique",
      MM: "Myanmar",
      NA: "Namibia",
      NR: "Nauru",
      NP: "Nepal",
      NL: "Netherlands",
      NZ: "New Zealand",
      NI: "Nicaragua",
      NE: "Niger",
      NG: "Nigeria",
      NO: "Norway",
      OM: "Oman",
      PK: "Pakistan",
      PW: "Palau",
      PA: "Panama",
      PG: "Papua New Guinea",
      PY: "Paraguay",
      PE: "Peru",
      PH: "Philippines",
      PL: "Poland",
      PT: "Portugal",
      QA: "Qatar",
      RO: "Romania",
      RU: "Russia",
      RW: "Rwanda",
      KN: "Saint Kitts and Nevis",
      LC: "Saint Lucia",
      VC: "Saint Vincent and the Grenadines",
      WS: "Samoa",
      SM: "San Marino",
      ST: "São Tomé and Príncipe",
      SA: "Saudi Arabia",
      SN: "Senegal",
      RS: "Serbia",
      SC: "Seychelles",
      SL: "Sierra Leone",
      SG: "Singapore",
      SK: "Slovakia",
      SI: "Slovenia",
      SB: "Solomon Islands",
      SO: "Somalia",
      ZA: "South Africa",
      SS: "South Sudan",
      ES: "Spain",
      LK: "Sri Lanka",
      SD: "Sudan",
      SR: "Suriname",
      SZ: "Eswatini",
      SE: "Sweden",
      CH: "Switzerland",
      SY: "Syria",
      TW: "Taiwan",
      TJ: "Tajikistan",
      TZ: "Tanzania",
      TH: "Thailand",
      TL: "Timor-Leste",
      TG: "Togo",
      TO: "Tonga",
      TT: "Trinidad and Tobago",
      TN: "Tunisia",
      TR: "Turkey",
      TM: "Turkmenistan",
      TV: "Tuvalu",
      UG: "Uganda",
      UA: "Ukraine",
      AE: "United Arab Emirates",
      GB: "United Kingdom",
      US: "United States",
      UY: "Uruguay",
      UZ: "Uzbekistan",
      VU: "Vanuatu",
      VA: "Vatican City",
      VE: "Venezuela",
      VN: "Vietnam",
    };
    return countries[code] || code;
  },
};
