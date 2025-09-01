// Main.jsx
import { useMemo } from "react";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";

// helper (puedes moverlo a utils/constants.js)
const getWeatherType = (tempF) => {
  if (tempF <= 59) return "cold";
  if (tempF >= 75) return "hot";
  return "warm";
};

export default function Main({ weatherData, items, onSelectCard }) {
  // Soporta ambas formas: normalizada {temp} o cruda {main.temp}
  const temp =
    weatherData?.temp ??
    weatherData?.main?.temp ??
    null;

  // Loading/fallback temprano: no renderices recomendaciones sin clima
  if (temp == null) {
    return (
      <main className="main">
        <WeatherCard weatherData={weatherData} />
        <div className="container">
          <h2 className="main__lead">Cargando clima y recomendaciones…</h2>
        </div>
      </main>
    );
  }

  const weatherType = getWeatherType(temp);

  // Filtrar solo cuando ya hay temperatura
  const filteredItems = useMemo(
    () => items.filter((item) => item.weather === weatherType),
    [items, weatherType]
  );

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <div className="container">
        <h2 className="main__lead">
          Today is {Math.round(temp)}° F / You may want to wear:
        </h2>

        {filteredItems.length === 0 ? (
          <p className="items__empty">
            No hay prendas para el clima <strong>{weatherType}</strong>.
          </p>
        ) : (
          <ul className="cards">
            {filteredItems.map((item) => (
              <li key={item.id} className="cards__item">
                <ItemCard
                  item={item}
                  onSelect={() => onSelectCard(item)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
