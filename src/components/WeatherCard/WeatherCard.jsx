// src/components/WeatherCard/WeatherCard.jsx
import "./WeatherCard.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

function WeatherArt({ type }) {
  switch (type) {
    case "cloudy":
      return (
        <div className="weather-card__art cloudy">
          <svg
            width="149"
            height="80"
            viewBox="0 0 149 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="133" cy="20" r="30" fill="#FFE600" />
            <path
              d="M27.222 52.0106C30.614 28.2594 51.0383 10 75.7273 10C91.8139 10 106.09 17.7519 115.024 29.7239C118.885 28.4864 123.001 27.8182 127.273 27.8182C149.414 27.8182 167.364 45.7675 167.364 67.9091C167.364 90.0507 149.414 108 127.273 108H75.7273H28H24.1818V107.742C10.5241 105.88 0 94.1688 0 80C0 64.7962 12.1177 52.4227 27.222 52.0106Z"
              fill="white"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className="weather-card__art cloudy">
          <svg
            width="149"
            height="80"
            viewBox="0 0 149 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="133" cy="20" r="30" fill="#FFE600" />
            <path
              d="M27.222 52.0106C30.614 28.2594 51.0383 10 75.7273 10C91.8139 10 106.09 17.7519 115.024 29.7239C118.885 28.4864 123.001 27.8182 127.273 27.8182C149.414 27.8182 167.364 45.7675 167.364 67.9091C167.364 90.0507 149.414 108 127.273 108H75.7273H28H24.1818V107.742C10.5241 105.88 0 94.1688 0 80C0 64.7962 12.1177 52.4227 27.222 52.0106Z"
              fill="white"
            />
          </svg>
        </div>
      );
  }
}

export default function WeatherCard({ weatherData }) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  const temp =
    currentTemperatureUnit === "C" ? weatherData?.tempC : weatherData?.temp;
  return (
    <section className={`weather-card`} aria-label="Current weather">
      <div
        className={`weather-card__inner  ${weatherData?.condition ?? "cloudy"}`}
      >
        <div className={`weather-card__temp `}>
          {temp != null
            ? Math.round(temp) + "°" + currentTemperatureUnit
            : "Loading..."}
        </div>
        <WeatherArt type={weatherData?.type} />
      </div>
    </section>
  );
}
