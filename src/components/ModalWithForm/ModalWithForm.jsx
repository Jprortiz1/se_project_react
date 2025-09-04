import { useRef, useState } from "react";
import "./ModalWithForm.css";
import closeIcon from "../../assets/icons/close-icon.svg"; // ⬅️ import del asset

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
  const [isValid, setIsValid] = useState(false);

  if (!isOpen) return null;

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  const handleInput = () =>
    setIsValid(formRef.current?.checkValidity() ?? false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget).entries());
    onSubmit?.(values);
  };

  return (
    <div
      className={`modal modal_type_${name} ${isOpen ? "modal_is-opened" : ""}`}
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

        <form
          ref={formRef}
          name={name}
          className="mform"
          onInput={handleInput}
          onSubmit={handleSubmit}
        >
          {children}
          <button type="submit" className="btn" disabled={!isValid}>
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
