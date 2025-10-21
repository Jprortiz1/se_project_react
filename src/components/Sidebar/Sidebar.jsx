// src/components/Sidebar/Sidebar.jsx
import "./Sidebar.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Sidebar({ onEditProfile, onLogout }) {
  const currentUser = useContext(CurrentUserContext);

  const name = currentUser?.name || "User";
  const email = currentUser?.email || "";
  const avatar = currentUser?.avatar || "";

  return (
    <aside className="sidebar">
      <div className="sidebar__user">
        {avatar && <img className="sidebar__avatar" src={avatar} alt={name} />}
        <p className="sidebar__name">{name}</p>
        {email && <p className="sidebar__email">{email}</p>}
      </div>

      <button type="button" className="sidebar__btn" onClick={onEditProfile}>
        Edit profile
      </button>
      <button type="button" className="sidebar__btn" onClick={onLogout}>
        Log out
      </button>
    </aside>
  );
}
