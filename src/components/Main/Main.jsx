import { useContext } from "react";
import WeatherCard from "../WeatherCard/WeatherCard";
import "./Main.css";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import PublicClothesSection from "../PublicClothesSection/PublicClothesSection";
// import ClothesSection from "../ClothesSection/ClothesSection";

export default function Main({
  weatherData,
  items,
  onSelectCard,
  onCardLike,
  isLoggedIn,
}) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  const temp =
    currentTemperatureUnit === "C" ? weatherData?.tempC : weatherData?.temp;

  if (temp == null) {
    return (
      <main className="main">
        <WeatherCard weatherData={weatherData} />
        <div className="container">
          <h2 className="main__lead">Loading weather and recommendations…</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <div className="container">
        <h2 className="main__lead">
          Today is {Math.round(temp)}°{currentTemperatureUnit} / You may want to
          wear:
        </h2>

        <PublicClothesSection
          items={items}
          weatherType={weatherData?.type}
          onSelectCard={onSelectCard}
          onCardLike={onCardLike}
          isLoggedIn={isLoggedIn}
        />
        {/* <ClothesSection
          items={items}
          weatherType={weatherData?.type}
          onSelectCard={onSelectCard}
        /> */}
      </div>
    </main>
  );
}
