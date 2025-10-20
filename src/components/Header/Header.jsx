import "./Header.css";
import logo from "../../assets/images/logo.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { Link } from "react-router-dom";

import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Header({
  weatherData,
  onAddClothes,
  onSignUp,
  onLogin,
  isLoggedIn,
}) {
  const user = useContext(CurrentUserContext);

  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header">
      <div className="header__inner container">
        <div className="header__left">
          <Link to="/">
            <img src={logo} alt="App Logo" className="header__logo" />
          </Link>
          <div className="header__meta">
            {currentDate},{" "}
            {weatherData?.city ? weatherData?.city : "Loading..."}
          </div>
        </div>

        <div className="header__right">
          {/* ToggleSwitch already reads context value & handler */}
          <ToggleSwitch />

          {isLoggedIn ? (
            <>
              <button
                type="button"
                className="header__add"
                onClick={onAddClothes}
              >
                + Add clothes
              </button>
              <Link to="/profile" className="header__profile">
                <p className="header__name">{user?.name}</p>
                <img
                  className="header__avatar"
                  src={user?.avatar}
                  alt={user?.name}
                />
              </Link>
            </>
          ) : (
            <>
              <button type="button" className="header__add" onClick={onSignUp}>
                Sign Up
              </button>
              <button type="button" className="header__add" onClick={onLogin}>
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
