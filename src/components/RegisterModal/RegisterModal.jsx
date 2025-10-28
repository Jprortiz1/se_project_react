// src/components/RegisterModal/RegisterModal.jsx
import "./RegisterModal.css";
import { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

function RegisterModal({ isOpen, onClose, onRegister, onSecondary, error, setError }) {
  const { values, errors, isValid, handleChange, resetForm } = useForm({
    name: "",
    avatar: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      resetForm({ name: "", avatar: "", email: "", password: "" }, {}, false);
      setError?.(null);
    }
  }, [isOpen, resetForm, setError]);

  const onInputChange = (e) => {
    setError?.(null);
    handleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError?.(null);
    await onRegister(values);
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      name="register"
      title="Sign Up"
      buttonText="Next"
      secondaryButtonText="or Log in"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onSecondary={onSecondary}
      isSubmitDisabled={!isValid}
    >
      <label className={`form__field space ${error === "EMAIL_IN_USE" ? "error" : ""}`}>
        <span>{error === "EMAIL_IN_USE" ? "Email already registered" : "Email"}</span>
        <input
          className={`form__control ${errors.email ? "form__control_state_error" : ""}`}
          type="email"
          name="email"
          placeholder="Email"
          value={values.email}
          onChange={onInputChange}
          required
        />
        {errors.email && <span className="form__error">{errors.email}</span>}
      </label>

      <label className="form__field">
        <span>Password</span>
        <input
          className={`form__control ${errors.password ? "form__control_state_error" : ""}`}
          type="password"
          name="password"
          placeholder="Password"
          value={values.password}
          onChange={onInputChange}
          minLength={6}
          required
        />
        {errors.password && <span className="form__error">{errors.password}</span>}
      </label>

      <label className="form__field">
        <span>Name</span>
        <input
          className={`form__control ${errors.name ? "form__control_state_error" : ""}`}
          type="text"
          name="name"
          placeholder="Name"
          value={values.name}
          onChange={onInputChange}
          minLength={2}
          maxLength={30}
          required
        />
        {errors.name && <span className="form__error">{errors.name}</span>}
      </label>

      <label className={`form__field ${error === "INVALID_AVATAR_URL" ? "error" : ""}`}>
        <span>{error === "INVALID_AVATAR_URL" ? "Invalid avatar URL" : "Avatar URL"}</span>
        <input
          className={`form__control ${
            errors.avatar || error === "INVALID_AVATAR_URL" ? "form__control_state_error" : ""
          }`}
          type="url"
          name="avatar"
          placeholder="https://example.com/photo.jpg"
          value={values.avatar}
          onChange={onInputChange}
          pattern="https?://.+"
        />
        {(errors.avatar || error === "INVALID_AVATAR_URL") && (
          <span className="form__error">{errors.avatar || "Please enter a valid URL."}</span>
        )}
      </label>
    </ModalWithForm>
  );
}

export default RegisterModal;
