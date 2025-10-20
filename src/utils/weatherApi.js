// src/utils/weatherApi.js
import { OPENWEATHER_KEY, OPENWEATHER_BASE_URL } from "./constants";
import { checkResponse } from "./api";

// ✅ Clasificación centralizada por temperatura (hot | warm | cold)
export function getWeatherType(t) {
  if (t > 75) return "hot";
  if (t >= 55) return "warm";
  return "cold";
}

// (Opcional) mapeo de condición para UI/íconos
function mapCondition(main = "") {
  switch (main.toLowerCase()) {
    case "clear": return "sunny";
    case "clouds": return "cloudy";
    case "rain":
    case "drizzle": return "rain";
    case "thunderstorm": return "storm";
    case "snow": return "snow";
    case "mist":
    case "fog":
    case "haze": return "fog";
    default: return "cloudy";
  }
}

export const hasWeatherKey = !!OPENWEATHER_KEY;

export function normalizeWeatherData(data) {
  if (!data) return null;

  const temp = data.main?.temp ?? null;                   // °F
  const tempC = temp != null ? Math.round(((temp - 32) * 5) / 9) : null; // °C
  const tempType = temp != null ? getWeatherType(temp) : "warm";
  const main = data.weather?.[0]?.main ?? "";
  const condition = mapCondition(main);

  const currentTime =
    (data.dt ?? Math.floor(Date.now() / 1000)) + (data.timezone ?? 0);
  const sunrise = data.sys?.sunrise ?? 0;
  const sunset  = data.sys?.sunset ?? 0;
  const dayOrNight = currentTime >= sunrise && currentTime < sunset ? "day" : "night";

  return {
    temp,
    tempC,
    city: data.name ?? "Unknown",
    description: data.weather?.[0]?.description ?? "N/A",
    icon: data.weather?.[0]?.icon ?? null,
    type: tempType,        // "hot" | "warm" | "cold"
    condition,             // "sunny" | "cloudy" | ...
    dayOrNight,            // "day" | "night"
  };
}

// No lanzamos error duro si no hay key; deja que App haga fallback
export async function fetchWeatherByCoords(lat, lon) {
  if (!OPENWEATHER_KEY) return Promise.reject(new Error("NO_KEY"));

  const url = new URL(OPENWEATHER_BASE_URL);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("units", "imperial");
  url.searchParams.set("appid", OPENWEATHER_KEY);

  const data = await fetch(url).then(checkResponse);
  return normalizeWeatherData(data);
}

export async function fetchWeatherByCity(city) {
  if (!OPENWEATHER_KEY) return Promise.reject(new Error("NO_KEY"));

  const url = new URL(OPENWEATHER_BASE_URL);
  url.searchParams.set("q", city);
  url.searchParams.set("units", "imperial");
  url.searchParams.set("appid", OPENWEATHER_KEY);

  const data = await fetch(url).then(checkResponse);
  return normalizeWeatherData(data);
}
