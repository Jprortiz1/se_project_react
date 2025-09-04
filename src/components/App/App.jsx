// src/components/App/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { defaultClothingItems } from "../../utils/constants";
import { fetchWeatherByCoords, getWeatherType } from "../../utils/weatherApi"; // ⬅️ importa también getWeatherType
import avatar from "../../assets/images/avatar.png";

export default function App() {
  // ✅ Inicializa como objeto (no null)
  const [weather, setWeather] = useState({
    temp: null,        // null al inicio para mostrar "loading"
    city: "",
    type: "",          // "hot" | "warm" | "cold"
    description: "",
    icon: null,
    condition: "",     // opcional para UI (sunny, cloudy, etc.)
    dayOrNight: "",    // "day" | "night"
    // Si en algún lado lees weather.main?.temp o weather.weather[0]?.description,
    // estos campos extra evitan errores de acceso:
    main: { temp: null },
    weather: [{ description: "" }],
  });

  // ✅ Todos los estados juntos y arriba
const [items, setItems] = useState(() =>
  defaultClothingItems.map((clothingItem) => ({
    id: clothingItem._id,
    name: clothingItem.name,
    imageUrl: clothingItem.link,
    weather: clothingItem.weather.toLowerCase(), // "hot" | "warm" | "cold"
  }))
);
const [activeModal, setActiveModal] = useState("");
const [selectedItem, setSelectedItem] = useState(null);


  const handleOpenAdd = () => setActiveModal("add");
  const handleCardClick = (item) => {
    setSelectedItem(item);
    setActiveModal("preview");
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

  // Cargar clima al montar
  useEffect(() => {
    if (!navigator.geolocation) {
      // Fallback si no hay geolocalización
      const fallbackTemp = 70;
      setWeather((prev) => ({
        ...prev,
        temp: fallbackTemp,
        city: "Unknown city",
        type: getWeatherType(fallbackTemp), // ✅ usa la función centralizada
        description: "N/A",
        condition: "cloudy",
        dayOrNight: "day",
        main: { temp: fallbackTemp },
        weather: [{ description: "N/A" }],
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const normalized = await fetchWeatherByCoords(latitude, longitude);
          // normalized YA trae temp, city, type, description, icon, condition, dayOrNight
          // completamos main/weather por compatibilidad si tu UI los lee
          setWeather({
            ...normalized,
            main: { temp: normalized.temp },
            weather: [{ description: normalized.description }],
          });
        } catch (err) {
          console.error("Weather fetch failed:", err);
          const fallbackTemp = 70;
          setWeather((prev) => ({
            ...prev,
            temp: fallbackTemp,
            city: "Unknown city",
            type: getWeatherType(fallbackTemp),
            description: "Clear sky",
            icon: null,
            condition: "sunny",
            dayOrNight: "day",
            main: { temp: fallbackTemp },
            weather: [{ description: "Clear sky" }],
          }));
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        const fallbackTemp = 70;
        setWeather((prev) => ({
          ...prev,
          temp: fallbackTemp,
          city: "Unknown city",
          type: getWeatherType(fallbackTemp),
          description: "Clear sky",
          icon: null,
          condition: "sunny",
          dayOrNight: "day",
          main: { temp: fallbackTemp },
          weather: [{ description: "Clear sky" }],
        }));
      }
    );
  }, []);

  // Loading state simple: temp === null (aún no cargado)
  if (weather.temp === null) {
    return (
      <main className="main">
        <h2 className="main__lead">Cargando clima y recomendaciones…</h2>
      </main>
    );
  }

  // Filtrar según el tipo calculado (hot | warm | cold)
  const filtered = items.filter((i) => i.weather === weather.type);

  // usuario simulado
  const user = {
    name: "Terrence Tegegne",
    avatar: avatar,
  };

  return (
    <div className="page">
      <Header weatherData={weather} user={user} onAddClothes={handleOpenAdd} />

      <Main
        weatherData={weather}    // { temp, city, type, ... }
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
              weather: weatherLower, // "hot" | "warm" | "cold"
            },
            ...prev,
          ]);

          handleCloseModal();
        }}
      >
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
