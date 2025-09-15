import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";

function ClothesSection({ items, weatherType, onSelectCard }) {
  if (items.length === 0) {
    return (
      <p className="items__empty">
        No hay prendas para el clima <strong>{weatherType}</strong>.
      </p>
    );
  }

  return (
    <ul className="cards">
      {items.map((item) => (
        <li key={item._id} className="cards__item">
          <ItemCard item={item} onSelect={() => onSelectCard(item)} />
        </li>
      ))}
    </ul>
  );
}

export default ClothesSection;
