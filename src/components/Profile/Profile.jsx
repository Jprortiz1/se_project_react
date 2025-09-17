// src/components/Profile/Profile.jsx
import ClothesSection from "../ClothesSection/ClothesSection";
import "./Profile.css";
import Sidebar from "../Sidebar/Sidebar";

function Profile({ user, items, onSelectCard, onAddClothes }) {
  return (
    <div className="profile">
      <div className="profile__inner">
        {/* Columna izquierda */}
        <div className="profile__left">
          <div className="profile__header-card">
            <img className="header__avatar" src={user.avatar} alt={user.name} />
            <p className="header__name">{user.name}</p>
          </div>
          <Sidebar />
        </div>

        {/* Columna derecha */}
        <div className="profile__right">
          <div className="profile__right-actions">
            <p className="title">Your Items</p>
            <button onClick={onAddClothes} className="add">+ Add new</button>
          </div>

          {/* 👇 Aquí NO pasamos weatherType para que no filtre */}
          <ClothesSection
            items={items}
            onSelectCard={onSelectCard}
            /* sin weatherType */
            /* si tu ClothesSection exige la prop, pásale undefined: weatherType={undefined} */
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
