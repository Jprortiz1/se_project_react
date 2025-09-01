// src/components/App/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { defaultClothingItems } from "../../utils/constants";
import { fetchWeatherByCoords } from "../../utils/weatherApi";
import avatar from "../../assets/images/avatar.png";

function getWeatherType(t) {
  if (t > 75) return "hot";
  if (t >= 55) return "warm";
  return "cold";
}

export default function App() {
  // mock del clima hasta conectar API
  // const [weather] = useState({ temp: 75, city: "New York" });
  const [weather, setWeather] = useState(null);

  // load weather on mount
useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const data = await fetchWeatherByCoords(latitude, longitude);
        setWeather(data);
        console.log(data);
      } catch (err) {
        console.error("Weather fetch failed:", err);

        // ✅ Fallback: muestra algo por defecto
        setWeather({
          main: { temp: 70 }, // temperatura default
          name: "Unknown city", 
          weather: [{ description: "Clear sky" }], 
        });
      }
    },
    (err) => {
      console.error("Geolocation error:", err);

      setWeather({
        main: { temp: 70 },
        name: "Unknown city",
        weather: [{ description: "Clear sky" }],
      });
    }
  );
}, []);


// normaliza { _id, name, link, weather } → { id, name, imageUrl, weather: lowercase }
const normalizedDefaults = defaultClothingItems.map((clothingItem) => ({
  id: clothingItem._id,
  name: clothingItem.name,          // 👈 agrega esto
  imageUrl: clothingItem.link,
  weather: clothingItem.weather.toLowerCase(),
}));


  // items en state desde el montaje
  const [items, setItems] = useState(normalizedDefaults);

  // manejo de modales
  const [activeModal, setActiveModal] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenAdd = () => setActiveModal("add");
  const handleCardClick = (item) => {
    setSelectedItem(item);
    setActiveModal("preview");
    console.log(item);
  };
  const handleCloseModal = () => {
    setActiveModal("");
    setSelectedItem(null);
  };

  // cerrar modales con ESC
useEffect(() => {
  if (!activeModal) return;
  const onEsc = (e) => e.key === "Escape" && handleCloseModal();
  document.addEventListener("keydown", onEsc);
  return () => document.removeEventListener("keydown", onEsc);
}, [activeModal]);

// obtenemos la temperatura de forma segura
const temp =
  weather?.temp ??          // si normalizaste tu objeto
  weather?.main?.temp ??    // si usas la forma cruda de OpenWeather
  null;

// si no hay clima aún → mostramos un loading state
if (temp == null) {
  return (
    <main className="main">
      <h2 className="main__lead">Cargando clima y recomendaciones…</h2>
    </main>
  );
}

// si ya hay clima → filtramos normalmente
const type = getWeatherType(temp);
const filtered = items.filter((i) => i.weather === type);

// usuario simulado
const user = {
  name: "Terrence Tegegne",
  avatar: avatar,
};


  return (
    <div className="page">
      <Header weatherData={weather} user={user} onAddClothes={handleOpenAdd} />

      <Main
        weatherData={weather}
        items={filtered}
        onSelectCard={handleCardClick}
      />

      <Footer author="Jorge Proaño" />

      {/* ADD CLOTHES */}
      <ModalWithForm
        name="add-garment"
        title="New garment"
        buttonText="Add garment"
        isOpen={activeModal === "add"}
        onClose={handleCloseModal}
        onSubmit={(values) => {
          const imageUrl = values.imageUrl || values.link;
          const weatherLower =
            typeof values.weather === "string"
              ? values.weather.toLowerCase()
              : values.weather;

          setItems((prev) => [
            {
              id: crypto.randomUUID(),
              name: values.name,
              imageUrl,
              weather: weatherLower,
            },
            ...prev,
          ]);

          handleCloseModal();
        }}
      >
        {/* Campos 440x52 con borde 1px (estilízalos en CSS con .form__control) */}
        <label className="form__field">
          <span>Name</span>
          <input
            className="form__control"
            name="name"
            type="text"
            placeholder="Name"
            required
          />
        </label>

        <label className="form__field">
          <span>Image URL</span>
          <input
            className="form__control"
            name="imageUrl"
            type="url"
            placeholder="Image URL"
            required
          />
        </label>

        <fieldset className="form__field form__weather">
          <legend>Select the weather type:</legend>
          <div className="form__radios">
            <label className="radio">
              <input type="radio" name="weather" value="hot" required />
              <span>Hot</span>
            </label>
            <label className="radio">
              <input type="radio" name="weather" value="warm" />
              <span>Warm</span>
            </label>
            <label className="radio">
              <input type="radio" name="weather" value="cold" />
              <span>Cold</span>
            </label>
          </div>
        </fieldset>
      </ModalWithForm>

      {/* PREVIEW ITEM */}
      <ItemModal
        isOpen={activeModal === "preview"}
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </div>
  );
}
