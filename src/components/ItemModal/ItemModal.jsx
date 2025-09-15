import "./ItemModal.css";
import closeIcon from "../../assets/icons/close-icon.svg";

export default function ItemModal({ isOpen, item, onClose, onDelete }) {
  if (!isOpen || !item) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

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
          <img src={item.imageUrl || item.link} alt={item.name} />
        </div>
        <div className="modal-item__info">
          <div className="modal-item__titles">
            <h3 className="modal-item__title">{item.name}</h3>
            <button
              type="button"
              className="modal-item__delete"
              onClick={() => onDelete(item)}
            >
              Delete Item
            </button>
          </div>
          <p className="modal-item__meta">
            Weather: {String(item.weather).toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
