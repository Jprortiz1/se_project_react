// src/components/LoginModal.jsx
import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function LoginModal({
  isOpen,
  onClose,
  onLogin,
  error,
  setError,
  onSecondary,
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onLogin(form);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      name="login"
      title="Log in"
      buttonText={isSubmitting ? "Loggin in..." : "Log in"}
      secondaryButtonText={"or Register"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onSecondary={onSecondary}
    >
      <label
        className={`form__field space ${error == "EMAIL_NOT_FOUND" && "error"}`}
      >
        <span>{error == "EMAIL_NOT_FOUND" ? "User not found" : "Email"}</span>
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

      <label className={`form__field ${error == "WRONG_PASSWORD" && "error"}`}>
        <span>
          {error == "WRONG_PASSWORD" ? "Incorrect Password" : "Password"}
        </span>
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
    </ModalWithForm>
    // <div className="modal">
    //   <form onSubmit={handleSubmit}>
    //     <h2>Login</h2>
    //     <input
    //       type="email"
    //       name="email"
    //       placeholder="Email"
    //       value={form.email}
    //       onChange={handleChange}
    //       required
    //     />
    //     <input
    //       type="password"
    //       name="password"
    //       placeholder="Password"
    //       value={form.password}
    //       onChange={handleChange}
    //       required
    //     />
    //     <button type="submit">Login</button>
    //     <button type="button" onClick={onClose}>
    //       Cancel
    //     </button>
    //   </form>
    // </div>
  );
}

export default LoginModal;
