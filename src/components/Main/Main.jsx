import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";

export default function Main({ weatherData, items, onSelectCard }) {
  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <div className="container">
        <h2 className="main__lead">
          Today is {weatherData?.temp ?? 0}° F / You may want to wear:
        </h2>
        <ul className="cards">
          {items.map((item) => (
            <li key={item.id} className="cards__item">
              <ItemCard
                item={item}
                onSelect={(item) => {
                  onSelectCard(item);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
