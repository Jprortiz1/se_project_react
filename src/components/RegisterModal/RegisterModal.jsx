// src/components/RegisterModal/RegisterModal.jsx
import { useState } from "react";
import "./RegisterModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function RegisterModal({
  isOpen,
  onClose,
  onRegister,
  onSecondary,
  error,
  setError,
}) {
  const [form, setForm] = useState({
    name: "",
    avatar: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError?.(null);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onRegister(form);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      name="register"
      title="Sign Up"
      buttonText={isSubmitting ? "Signing Up..." : "Next"}
      secondaryButtonText="or Log in"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onSecondary={onSecondary}
    >
      <label
        className={`form__field space ${
          error === "EMAIL_IN_USE" ? "error" : ""
        }`}
      >
        <span>
          {error === "EMAIL_IN_USE" ? "Email already registered" : "Email"}
        </span>
        <input
          className="form__control"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>

      <label className="form__field">
        <span>Password</span>
        <input
          className="form__control"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </label>

      <label className="form__field">
        <span>Name</span>
        <input
          className="form__control"
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label
        className={`form__field ${
          error === "INVALID_AVATAR_URL" ? "error" : ""
        }`}
      >
        <span>
          {error === "INVALID_AVATAR_URL" ? "Invalid avatar URL" : "Avatar URL"}
        </span>
        <input
          className="form__control"
          type="url"
          name="avatar"
          placeholder="Avatar URL"
          value={form.avatar}
          onChange={handleChange}
        />
      </label>
    </ModalWithForm>
  );
}

export default RegisterModal;
