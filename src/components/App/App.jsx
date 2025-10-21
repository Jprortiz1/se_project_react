// src/components/App/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import { fetchWeatherByCoords, getWeatherType } from "../../utils/weatherApi";
// import avatar from "../../assets/images/avatar.png";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "../Profile/Profile";
import AddItemModal from "../AddItemModal/AddItemModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import {
  getItems,
  addItem,
  deleteItem,
  updateUserProfile,
  addCardLike,
  removeCardLike,
} from "../../utils/api";

import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import { register, login, checkToken } from "../../utils/auth";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

// --- helpers locales ---
const fToC = (f) => Math.round(((f - 32) * 5) / 9);
const cToF = (c) => Math.round((c * 9) / 5 + 32);
const norm = (s) => (s || "").toLowerCase().trim();

// Detecta si hay key cargada por Vite (evitamos llamar a la API si falta)
const HAS_OW_KEY = Boolean(import.meta.env.VITE_OPENWEATHER_KEY);

export default function App() {
  // const [isRegisterOpen, setRegisterOpen] = useState(false);
  // const [isLoginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [editProfileError, setEditProfileError] = useState(null);

  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  // Estado de clima inicial para evitar optional chaining por todos lados
  const [weather, setWeather] = useState({
    temp: null, // Fahrenheit
    tempC: null,
    tempF: null,
    city: "",
    type: "", // "hot" | "warm" | "cold"
    description: "",
    icon: null,
    condition: "",
    dayOrNight: "",
    // compatibilidad con UI antigua
    main: { temp: null },
    weather: [{ description: "" }],
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems()
      .then((data) => setItems(data || []))
      .catch((err) => console.error(err));
  }, []);

// add → prepend y cierra el modal en éxito o token faltante
const handleAddItem = (newItemData) => {
  const token = localStorage.getItem("jwt");
  // normaliza weather por si acaso
  const payload = {
    ...newItemData,
    weather: norm(newItemData.weather), // "hot"|"warm"|"cold"
  };

  // sin token → cierras el modal y avisas al test con un reject
  if (!token) {
    setActiveModal(""); // cerrar modal
    return Promise.reject(new Error("You need to log in"));
  }

  return addItem(payload, token) // ← PASA EL TOKEN
    .then((newItem) => {
      setItems((prev) => [newItem, ...prev]);
      setActiveModal(""); // cerrar modal al éxito
      return newItem;
    })
    .catch((err) => {
      // si el servidor devolvió 401, también cierra el modal
      if (err?.status === 401) setActiveModal("");
      throw err;
    });
};


  const [activeModal, setActiveModal] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

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

  const token = localStorage.getItem("jwt");
  if (!token) {
    // sin token: cierra el modal y comunica el estado esperado por los tests
    setIsDeleteConfirmationOpen(false);
    setCardToDelete(null);
    return Promise.reject(new Error("You need to log in"));
  }

  return deleteItem(cardToDelete._id, token)
    .then(() => {
      setItems((prev) => prev.filter((i) => i._id !== cardToDelete._id));
      setIsDeleteConfirmationOpen(false);
      setCardToDelete(null);
    })
    .catch((err) => {
      // también cerramos si falla (incluye 401)
      setIsDeleteConfirmationOpen(false);
      setCardToDelete(null);
      throw err;
    });
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

  // Cerrar modales con ESC
  useEffect(() => {
    if (!activeModal) return;
    const onEsc = (e) => e.key === "Escape" && handleCloseModal();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [activeModal]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken(token)
        .then((data) => {
          setLoggedIn(true);
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("jwt");
          setLoggedIn(false);
        });
    }
  }, [isLoggedIn]);

  // Carga del clima (con fallback sólido y sin errores rojos si no hay key)
  useEffect(() => {
    let cancelled = false;

    const setFallbackWeather = (fallbackF = 67, opts = {}) => {
      const tempF = fallbackF;
      const tempC = fToC(tempF);
      const computed = {
        temp: tempF,
        tempF,
        tempC,
        city: opts.city ?? "North Beach",
        type: getWeatherType(tempF), // "hot"|"warm"|"cold"
        description: opts.description ?? "clear sky",
        icon: null,
        condition: opts.condition ?? "cloudy", // para el arte
        dayOrNight: opts.dayOrNight ?? "day",
      };
      if (!cancelled) {
        setWeather({
          ...computed,
          main: { temp: tempF },
          weather: [{ description: computed.description }],
        });
      }
    };

    // Si no hay key → evitamos llamar a la API y usamos fallback silencioso
    if (!HAS_OW_KEY) {
      console.warn("OpenWeather key missing. Using fallback weather.");
      setFallbackWeather(67, { city: "North Beach", condition: "cloudy" });
      return () => {
        cancelled = true;
      };
    }

    if (!navigator.geolocation) {
      setFallbackWeather(67, { city: "Unknown city", condition: "cloudy" });
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const normalized = await fetchWeatherByCoords(latitude, longitude);

          const hasTempF = typeof normalized?.temp === "number";
          const tempF = hasTempF
            ? normalized.temp
            : normalized.tempF ?? cToF(normalized.tempC);
          const tempC =
            typeof normalized?.tempC === "number"
              ? normalized.tempC
              : fToC(tempF);

          const merged = {
            ...normalized,
            temp: tempF,
            tempF,
            tempC,
            main: { temp: tempF },
            weather: [{ description: normalized?.description || "clear sky" }],
            type: getWeatherType(tempF),
          };

          if (!cancelled) setWeather(merged);
        } catch (err) {
          console.warn("Weather fetch failed:", err?.message || err);
          setFallbackWeather(67, { city: "North Beach", condition: "cloudy" });
        }
      },
      (err) => {
        console.warn("Geolocation error:", err?.message || err);
        setFallbackWeather(67, { city: "North Beach", condition: "cloudy" });
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // Gate de carga simple (cuando aún no tenemos temp)
  if (weather.temp === null) {
    return (
      <main className="main">
        <h2 className="main__lead">Loading weather and recommendations…</h2>
      </main>
    );
  }
  console.log(
    "items weather counts =",
    (items || []).reduce((acc, it) => {
      const w = (it.weather || "").toLowerCase().trim();
      acc[w] = (acc[w] || 0) + 1;
      return acc;
    }, {})
  );
  console.log("weather.type =", weather.type);

  // Filtra prendas por clima (normalizado para evitar " Warm", "WARM", etc.)
  const filtered = items.filter((i) => norm(i.weather) === norm(weather.type));

  // Mock user
  // const userx = {
  //   name: "Terrence Tegegne",
  //   avatar: avatar,
  // };

  const handleRegisterOpen = () => setActiveModal("register");
  const handleLoginOpen = () => setActiveModal("login");
  const handleEditProfileOpen = () => setActiveModal("edit-profile");

  const handleRegister = async ({ name, avatar, email, password }) => {
    await register(name, avatar, email, password)
      .then(() => login(email, password))
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        handleCloseModal();
      })
      .catch((err) => {
        setRegisterError(err.message);
      });
  };

  const handleLogin = async ({ email, password }) => {
    await login(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        handleCloseModal();
      })
      .catch((err) => {
        setLoginError(err.message);
      });
  };

  const handleUpdateUser = async ({ name, avatar }) => {
    const token = localStorage.getItem("jwt");
    await updateUserProfile(token, { name, avatar })
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        setEditProfileError(err.message);
      });
  };

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");

    if (!isLoggedIn) return; // hide likes for unauthorized users

    if (!isLiked) {
      addCardLike(id, token)
        .then((updatedCard) => {
          setItems((cards) =>
            cards.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log("Like failed:", err.message || err));
    } else {
      removeCardLike(id, token)
        .then((updatedCard) => {
          setItems((cards) =>
            cards.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log("Dislike failed:", err.message || err));
    }
  };

  const signOut = () => {
    localStorage.removeItem("jwt"); // remove token
    setLoggedIn(false); // update state
    setUser({}); // optional: clear user data
  };

  return (
    <CurrentUserContext.Provider value={user}>
      <div className="page">
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          <Router>
            <Header
              weatherData={weather}
              onAddClothes={handleOpenAdd}
              onSignUp={handleRegisterOpen}
              onLogin={handleLoginOpen}
              isLoggedIn={isLoggedIn}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weather}
                    items={filtered}
                    onSelectCard={handleCardClick}
                    onCardLike={handleCardLike}
                    isLoggedIn={isLoggedIn}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      user={user}
                      items={items} // ✅ todos los ítems
                      weatherData={weather}
                      onSelectCard={handleCardClick}
                      onAddClothes={handleOpenAdd}
                      onEditProfile={handleEditProfileOpen}
                      isLoggedIn={isLoggedIn}
                      onCardLike={handleCardLike}
                      onLogout={signOut}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Footer author="Jorge Proaño" />

            <AddItemModal
              isOpen={activeModal === "add"}
              onAddItem={handleAddItem} // devuelve Promise → el modal puede cerrar en .then
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

            <RegisterModal
              isOpen={activeModal === "register"}
              onClose={handleCloseModal}
              onRegister={handleRegister}
              error={registerError}
              setError={setRegisterError}
              onSecondary={handleLoginOpen}
            />
            <LoginModal
              isOpen={activeModal === "login"}
              onClose={handleCloseModal}
              onLogin={handleLogin}
              error={loginError}
              setError={setLoginError}
              onSecondary={handleRegisterOpen}
            />
            <EditProfileModal
              isOpen={activeModal === "edit-profile"}
              onClose={handleCloseModal}
              onUpdateUser={handleUpdateUser}
              error={editProfileError}
              setError={setEditProfileError}
            />
          </Router>
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </CurrentUserContext.Provider>
  );
}
