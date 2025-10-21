import "./ItemModal.css";
import closeIcon from "../../assets/icons/close-icon.svg";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function ItemModal({ isOpen, item, onClose, onDelete }) {
  const currentUser = useContext(CurrentUserContext);
  if (!isOpen || !item) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // owner puede ser string o { _id: "..." }
  const ownerId =
    typeof item.owner === "string" ? item.owner : item.owner?._id;

  // ✅ evita crash si currentUser es null / undefined
  const isOwn = ownerId === currentUser?._id;

  const src = item.imageUrl ?? item.link;

  return (
    <div
      className="modal-item"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdrop}
    >
      <div className="modal-item__box">
        <button
          type="button"
          className="modal-item__close"
          aria-label="Close"
          onClick={onClose}
        >
          <img src={closeIcon} alt="Close" />
        </button>

        <div className="modal-item__media">
          <img
            src={src}
            alt={item.name}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400?text=Image";
              e.currentTarget.onerror = null;
            }}
          />
        </div>

        <div className="modal-item__info">
          <div className="modal-item__titles">
            <h3 className="modal-item__title">{item.name}</h3>

            {/* ✅ muestra Delete sólo si el item es del usuario y existe onDelete */}
            {isOwn && onDelete && (
              <button
                type="button"
                className="modal-item__delete"
                onClick={() => onDelete(item)}
              >
                Delete Item
              </button>
            )}
          </div>

          <p className="modal-item__meta">
            Weather: {(item.weather ?? "").toString().toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
