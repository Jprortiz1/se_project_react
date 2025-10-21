// src/components/Profile/Profile.jsx
import ClothesSection from "../ClothesSection/ClothesSection";
import "./Profile.css";
import Sidebar from "../Sidebar/Sidebar";

function Profile({
  // ❌ user,            // ya no se usa aquí (Sidebar toma del contexto)
  items,
  onSelectCard,
  onAddClothes,
  onEditProfile,
  onCardLike,
  isLoggedIn,
  onLogout,
}) {
  return (
    <div className="profile">
      <div className="profile__inner">
        {/* Columna izquierda */}
        <div className="profile__left">
          <Sidebar
            onEditProfile={onEditProfile}
            onLogout={onLogout}
          />
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
            onSelectCard={onSelectCard}
            onCardLike={onCardLike}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
