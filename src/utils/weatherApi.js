
// src/utils/weatherApi.js
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ✅ Clasificación centralizada por temperatura (hot | warm | cold)
export function getWeatherType(t) {
  if (t > 75) return "hot";
  if (t >= 55) return "warm";
  return "cold";
}

// (Opcional) mapeo de condición para UI/íconos si lo usas
function mapCondition(main = "") {
  switch (main.toLowerCase()) {
    case "clear":
      return "sunny";
    case "clouds":
      return "cloudy";
    case "rain":
    case "drizzle":
      return "rain";
    case "thunderstorm":
      return "storm";
    case "snow":
      return "snow";
    case "mist":
    case "fog":
    case "haze":
      return "fog";
    default:
      return "cloudy";
  }
}

export function normalizeWeatherData(data) {
  if (!data) return null;

  const temp = data.main?.temp ?? null;
  const tempType = temp != null ? getWeatherType(temp) : "warm"; // fallback
  const main = data.weather?.[0]?.main ?? "";
  const condition = mapCondition(main);

  // day/night con timestamps de OpenWeather
  const currentTime =
    (data.dt ?? Math.floor(Date.now() / 1000)) + (data.timezone ?? 0);
  const sunrise = data.sys?.sunrise ?? 0;
  const sunset = data.sys?.sunset ?? 0;
  const dayOrNight =
    currentTime >= sunrise && currentTime < sunset ? "day" : "night";

  return {
    temp,                                     // número (Fahrenheit)
    city: data.name ?? "Unknown",
    description: data.weather?.[0]?.description ?? "N/A",
    icon: data.weather?.[0]?.icon ?? null,
    // 🔑 Lo que tu app usa para filtrar ropa:
    type: tempType,                            // "hot" | "warm" | "cold"
    // Extra por si lo necesitas en la UI:
    condition,                                 // "sunny" | "cloudy" | ...
    dayOrNight,                                // "day" | "night"
  };
}

export async function fetchWeatherByCoords(lat, lon) {
  if (!API_KEY) throw new Error("Missing OpenWeather API key");

  const url = new URL(BASE_URL);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("units", "imperial"); // Fahrenheit
  url.searchParams.set("appid", API_KEY);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

  const data = await res.json();
  return normalizeWeatherData(data);
}

export async function fetchWeatherByCity(city) {
  if (!API_KEY) throw new Error("Missing OpenWeather API key");

  const url = new URL(BASE_URL);
  url.searchParams.set("q", city);
  url.searchParams.set("units", "imperial");
  url.searchParams.set("appid", API_KEY);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

  const data = await res.json();
  return normalizeWeatherData(data);
}
