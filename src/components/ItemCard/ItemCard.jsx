import "./ItemCard.css";

export default function ItemCard({ item, onSelect }) {
  const src = item.imageUrl ?? item.link; // soporta ambas

  return (
    <article
      className="item"
      role="button"
      tabIndex={0}
      onClick={() => {
        onSelect?.(item);
      }}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(item)}
    >
      <div className="item__badge">{item.name}</div>

      <img
        className="item__image"
        src={src}
        alt={item.name}
        loading="lazy"
        onError={(e) => {
          // evita ícono roto si la ruta falla
          e.currentTarget.src = "https://placehold.co/240x200?text=Image";
          e.currentTarget.onerror = null;
        }}
      />
    </article>
  );
}
