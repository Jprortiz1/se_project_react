// src/components/ItemCard/ItemCard.jsx
import "./ItemCard.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function ItemCard({ item, onSelect, onCardLike, isLoggedIn }) {
  const currentUser = useContext(CurrentUserContext);
  const isLiked =
    Array.isArray(item.likes) && item.likes.some((id) => id === currentUser?._id);
  const canLike = isLoggedIn;
  const src = item.imageUrl ?? item.link;

  const handleLike = (e) => {
    e.stopPropagation();
    if (!canLike) return;
    onCardLike({ id: item._id, isLiked });
  };

  return (
    <article
      className="item"
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(item)}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(item)}
    >
      <div className="item__header">
        <div className="item__badge">{item.name}</div>

        {canLike && (
          <>
            {/* Botón de like */}
            <button
              type="button"
              className="item__like"
              onClick={handleLike}
              aria-label="Like"
              aria-pressed={isLiked}
            >
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0009 16L2.36492 8.66936C1.75583 8.08462 1.34976 7.4048 1.14673 6.6299C0.948646 5.855 0.951122 5.08486 1.15415 4.31947C1.35719 3.54932 1.76078 2.87901 2.36492 2.30853C2.98393 1.72379 3.68959 1.33634 4.48191 1.14619C5.27919 0.951272 6.07399 0.951272 6.86631 1.14619C7.66359 1.3411 8.37173 1.72855 8.99073 2.30853L10.0009 3.24982L11.0112 2.30853C11.6351 1.72855 12.3432 1.3411 13.1356 1.14619C13.9279 0.951272 14.7202 0.951272 15.5125 1.14619C16.3098 1.33634 17.018 1.72379 17.637 2.30853C18.2411 2.87901 18.6447 3.54932 18.8477 4.31947C19.0508 5.08486 19.0508 5.855 18.8477 6.6299C18.6496 7.4048 18.2461 8.08462 17.637 8.66936L10.0009 16Z"
                  stroke="black"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                  fill={isLiked ? "black" : "none"}  // <- FIX
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <img
        className="item__image"
        src={src}
        alt={item.name}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "https://placehold.co/240x200?text=Image";
          e.currentTarget.onerror = null;
        }}
      />
    </article>
  );
}
