// src/components/Main/Main.jsx
import { useContext } from "react";
import WeatherCard from "../WeatherCard/WeatherCard";
// import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";
// import { getWeatherType } from "../../utils/weatherApi"; // ✅ usar lógica centralizada
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import ClothesSection from "../ClothesSection/ClothesSection";

export default function Main({ weatherData, items, onSelectCard }) {
  // Soporta ambas formas: normalizada {temp} o cruda {main.temp}
  // const temp =
  //   weatherData?.temp ??
  //   weatherData?.main?.temp ??
  //   null;

  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  const temp =
    currentTemperatureUnit === "C" ? weatherData?.tempC : weatherData?.temp;

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

  // Usa el type si ya viene normalizado; si no, clasifícalo aquí con la fn centralizada
  // const weatherType = weatherData?.type ?? getWeatherType(temp);

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <div className="container">
        <h2 className="main__lead">
          Today is {Math.round(temp)}° F / You may want to wear:
        </h2>

        {/* {filteredItems.length === 0 ? (
          <p className="items__empty">
            No hay prendas para el clima <strong>{weatherType}</strong>.
          </p>
        ) : (
          <ul className="cards">
            {filteredItems.map((item) => (
              <li key={item.id} className="cards__item">
                <ItemCard item={item} onSelect={() => onSelectCard(item)} />
              </li>
            ))}
          </ul>
        )} */}
        <ClothesSection
          items={items}
          weatherType={weatherData?.type}
          onSelectCard={onSelectCard}
        />
      </div>
    </main>
  );
}
