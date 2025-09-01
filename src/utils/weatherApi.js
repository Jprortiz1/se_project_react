const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export function normalizeWeatherData(data) {
  if (!data) return null;

  const main = data.weather?.[0]?.main ?? "";

  // Map main to your 6 project types
  let type;
  switch (main.toLowerCase()) {
    case "clear":
      type = "sunny";
      break;
    case "clouds":
      type = "cloudy";
      break;
    case "rain":
    case "drizzle":
      type = "rain";
      break;
    case "thunderstorm":
      type = "storm";
      break;
    case "snow":
      type = "snow";
      break;
    case "mist":
    case "fog":
    case "haze":
      type = "fog";
      break;
    default:
      type = "cloudy"; // fallback for unknown types
  }

  // Determine day or night using dt + timezone vs sunrise/sunset
  const currentTime =
    (data.dt ?? Math.floor(Date.now() / 1000)) + (data.timezone ?? 0);
  const sunrise = data.sys?.sunrise ?? 0;
  const sunset = data.sys?.sunset ?? 0;
  const dayOrNight =
    currentTime >= sunrise && currentTime < sunset ? "day" : "night";

  return {
    temp: data.main?.temp ?? null,
    city: data.name ?? "Unknown",
    description: data.weather?.[0]?.description ?? "N/A",
    icon: data.weather?.[0]?.icon ?? null,
    type, // sunny, cloudy, rain, storm, snow, fog
    dayOrNight, // day or night
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
