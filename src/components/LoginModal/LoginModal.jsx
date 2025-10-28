// src/components/LoginModal/LoginModal.jsx
import "./LoginModal.css";
import { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

function LoginModal({ isOpen, onClose, onLogin, error, setError, onSecondary }) {
  const { values, errors, isValid, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      resetForm({ email: "", password: "" }, {}, false);
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
    await onLogin(values);
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      name="login"
      title="Log in"
      buttonText="Log in"
      secondaryButtonText="or Register"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onSecondary={onSecondary}
      isSubmitDisabled={!isValid}
    >
      <label className={`form__field space ${error === "EMAIL_NOT_FOUND" ? "error" : ""}`}>
        <span>{error === "EMAIL_NOT_FOUND" ? "User not found" : "Email"}</span>
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

      <label className={`form__field ${error === "WRONG_PASSWORD" ? "error" : ""}`}>
        <span>{error === "WRONG_PASSWORD" ? "Incorrect Password" : "Password"}</span>
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
    </ModalWithForm>
  );
}

export default LoginModal;
