import ClothesSection from "../ClothesSection/ClothesSection";
import "./Profile.css";
import Sidebar from "../Sidebar/Sidebar";

function Profile({ user, items, weatherData, onSelectCard, onAddClothes }) {
  return (
    <div className="profile">
      <div className="profile__inner">
        {/* Columna izquierda */}
        <div className="profile__left">
          <div className="profile__header-card">
            <img className="header__avatar" src={user.avatar} alt={user.name} />
            <p className="header__name">{user.name}</p>
          </div>

          {/* 👉 Sidebar añadido */}
          <Sidebar />
        </div>

        {/* Columna derecha */}
        <div className="profile__right">
          <div className="profile__right-actions">
            <p className="title">Your Items</p>
            <button onClick={onAddClothes} className="add">
              + Add new
            </button>
          </div>

          <ClothesSection
            items={items}
            weatherType={weatherData?.type}
            onSelectCard={onSelectCard}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
