import { useRef } from "react";
import "./ModalWithForm.css";
import closeIcon from "../../assets/icons/close-icon.svg";

export default function ModalWithForm({
  title,
  name,
  buttonText = "Save",
  isOpen,
  onClose,
  onSubmit,
  children,
}) {
  const formRef = useRef(null);

  if (!isOpen) return null;

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`modal modal_type_${name} modal_is-opened`}
      onClick={handleOverlay}
    >
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          <img src={closeIcon} alt="Close" />
        </button>

        <h3 className="modal__title">{title}</h3>

        <form ref={formRef} name={name} className="mform" onSubmit={onSubmit}>
          {children}
          <button type="submit" className="btn">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
