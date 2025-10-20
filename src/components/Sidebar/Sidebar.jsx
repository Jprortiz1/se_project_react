import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">Menu</h2>
      <ul className="sidebar__list">
        <li className="sidebar__item">Overview</li>
        <li className="sidebar__item">My Items</li>
        <li className="sidebar__item">Settings</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
