import "./ItemModal.css";
import { useEffect } from "react";

export default function ItemModal({ isOpen, item, onClose }) {
  useEffect(() => {
    if (!isOpen || !item) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose, item]);

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
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7023 1.70711C16.0929 1.31658 16.0929 0.683417 15.7023 0.292893C15.3118 -0.0976311 14.6787 -0.0976311 14.2881 0.292893L7.99805 6.58298L1.70796 0.292893C1.31744 -0.0976311 0.684274 -0.0976311 0.29375 0.292893C-0.096775 0.683417 -0.096775 1.31658 0.29375 1.70711L6.58383 7.99719L0.292893 14.2881C-0.0976311 14.6787 -0.0976311 15.3118 0.292893 15.7023C0.683417 16.0929 1.31658 16.0929 1.70711 15.7023L7.99805 9.4114L14.289 15.7023C14.6795 16.0929 15.3127 16.0929 15.7032 15.7023C16.0937 15.3118 16.0937 14.6787 15.7032 14.2881L9.41226 7.99719L15.7023 1.70711Z"
              fill="black"
            />
          </svg>
        </button>
        <div className="modal-item__media">
          <img src={item.imageUrl || item.link} alt={item.name} />
        </div>
        <div className="modal-item__info">
          <h3 className="modal-item__title">{item.name}</h3>
          <p className="modal-item__meta">
            Weather: {String(item.weather).toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
