// src/components/App/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import { fetchWeatherByCoords, getWeatherType } from "../../utils/weatherApi";
import avatar from "../../assets/images/avatar.png";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "../Profile/Profile";
import AddItemModal from "../AddItemModal/AddItemModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { getItems, addItem, deleteItem } from "../../utils/api";

export default function App() {
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  // Initialize weather as an object (not null) to avoid optional chaining everywhere
  const [weather, setWeather] = useState({
    temp: null,          // Fahrenheit
    tempC: null,         // Celsius
    tempF: null,         // Fahrenheit (explicit alias if you need both)
    city: "",
    type: "",            // "hot" | "warm" | "cold"
    description: "",
    icon: null,
    condition: "",
    dayOrNight: "",
    // Legacy compatibility if some UI reads these:
    main: { temp: null },
    weather: [{ description: "" }],
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems()
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  // Return the promise so the modal can await it and only close on success
  const handleAddItem = (newItemData) => {
    return addItem(newItemData)
      .then((newItem) => setItems((prev) => [newItem, ...prev])) // prepend
      .catch((err) => {
        console.error(err);
        throw err; // rethrow so the caller can handle UI errors
      });
  };

  const [activeModal, setActiveModal] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const openConfirmationModal = (item) => {
    handleCloseModal();
    setCardToDelete(item);
    setIsDeleteConfirmationOpen(true);
  };

  const closeConfirmationModal = () => {
    setCardToDelete(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleCardDelete = () => {
    if (!cardToDelete) return;
    deleteItem(cardToDelete._id)
      .then(() =>
        setItems((prev) => prev.filter((i) => i._id !== cardToDelete._id))
      )
      .catch((err) => console.error(err))
      .finally(closeConfirmationModal);
  };

  const handleOpenAdd = () => setActiveModal("add");
  const handleCardClick = (item) => {
    setSelectedItem(item);
    setActiveModal("preview");
  };
  const handleCloseModal = () => {
    setActiveModal("");
    setSelectedItem(null);
  };

  // Close modals with ESC
  useEffect(() => {
    if (!activeModal) return;
    const onEsc = (e) => e.key === "Escape" && handleCloseModal();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [activeModal]);

  // Helpers for °F/°C conversions
  const fToC = (f) => Math.round(((f - 32) * 5) / 9);
  const cToF = (c) => Math.round((c * 9) / 5 + 32);

  // Load weather on mount (with solid fallbacks)
  useEffect(() => {
    const setFallbackWeather = (fallbackF, opts = {}) => {
      const computed = {
        temp: fallbackF,
        tempF: fallbackF,
        tempC: fToC(fallbackF),
        city: opts.city ?? "Unknown city",
        type: getWeatherType(fallbackF),
        description: opts.description ?? "Clear sky",
        icon: null,
        condition: opts.condition ?? "sunny",
        dayOrNight: opts.dayOrNight ?? "day",
      };
      setWeather({
        ...computed,
        main: { temp: computed.temp },
        weather: [{ description: computed.description }],
      });
    };

    if (!navigator.geolocation) {
      // No geolocation available
      setFallbackWeather(70, { description: "N/A", condition: "cloudy" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const normalized = await fetchWeatherByCoords(latitude, longitude);
          // Ensure both °F and °C are present even if API returns only one
          const hasTempF = typeof normalized.temp === "number";
          const tempF = hasTempF ? normalized.temp : normalized.tempF ?? cToF(normalized.tempC);
          const tempC = typeof normalized.tempC === "number" ? normalized.tempC : fToC(tempF);

          const merged = {
            ...normalized,
            temp: tempF,
            tempF,
            tempC,
            main: { temp: tempF },
            weather: [{ description: normalized.description }],
            type: getWeatherType(tempF),
          };

          setWeather(merged);
        } catch (err) {
          console.error("Weather fetch failed:", err);
          setFallbackWeather(70);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setFallbackWeather(70);
      }
    );
  }, []);

  // Simple loading gate
  if (weather.temp === null) {
    return (
      <main className="main">
        <h2 className="main__lead">Loading weather and recommendations…</h2>
      </main>
    );
  }

  // Filter items by computed weather type ("hot" | "warm" | "cold")
  const filtered = items.filter((i) => i.weather === weather.type);

  // Mock user
  const user = {
    name: "Terrence Tegegne",
    avatar: avatar,
  };

  return (
    <div className="page">
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <Router>
          <Header
            weatherData={weather}
            user={user}
            onAddClothes={handleOpenAdd}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weather}
                  items={filtered}
                  onSelectCard={handleCardClick}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  user={user}
                  items={filtered}
                  weatherData={weather}
                  onSelectCard={handleCardClick}
                  onAddClothes={handleOpenAdd}
                />
              }
            />
          </Routes>

          <Footer author="Jorge Proaño" />

          <AddItemModal
            isOpen={activeModal === "add"}
            onAddItem={handleAddItem}           // returns a Promise
            onCloseModal={handleCloseModal}
          />

          <ItemModal
            isOpen={activeModal === "preview"}
            item={selectedItem}
            onClose={handleCloseModal}
            onDelete={openConfirmationModal}
          />

          <DeleteConfirmationModal
            isOpen={isDeleteConfirmationOpen}
            onConfirm={handleCardDelete}
            onCancel={closeConfirmationModal}
          />
        </Router>
      </CurrentTemperatureUnitContext.Provider>
    </div>
  );
}
