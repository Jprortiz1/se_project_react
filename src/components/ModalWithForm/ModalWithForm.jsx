import { useEffect, useRef, useState } from "react";
import "./ModalWithForm.css";

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

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => setIsValid(formRef.current?.checkValidity() ?? false), 0);
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

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
        <h3 className="modal__title">{title}</h3>

        {/* 👇 cambiamos 'form' → 'mform' para evitar choques */}
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
