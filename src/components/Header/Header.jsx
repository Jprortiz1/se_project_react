import "./Header.css";
import logo from "../../assets/images/logo.svg";

export default function Header({ weatherData, user, onAddClothes }) {
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header">
      <div className="header__inner container">
        <div className="header__left">
          <img src={logo} alt="App Logo" className="header__logo" />
          <div className="header__meta">
            {currentDate},{" "}
            {weatherData?.city ? weatherData?.city : "Loading..."}
          </div>
        </div>

        <div className="header__right">
          <button
            type="button"
            className="header__add"
            onClick={onAddClothes}
          >
            + Add clothes
          </button>
          <p className="header__name">{user.name}</p>
          <img className="header__avatar" src={user.avatar} alt={user.name} />
        </div>
      </div>
    </header>
  );
}

