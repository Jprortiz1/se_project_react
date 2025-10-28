// src/components/EditProfileModal.jsx
import { useEffect, useContext } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { useForm } from "../../hooks/useForm";

function EditProfileModal({ isOpen, onClose, onUpdateUser, error, setError }) {
  const currentUser = useContext(CurrentUserContext);

  // Hook requerido
  const { values, errors, isValid, handleChange, resetForm } = useForm({
    name: "",
    avatar: "",
  });

  // Prellenar con datos del usuario al abrir
  useEffect(() => {
    if (isOpen && currentUser) {
      resetForm(
        { name: currentUser.name || "", avatar: currentUser.avatar || "" },
        {},
        true
      );
      setError?.(null);
    }
  }, [isOpen, currentUser, resetForm, setError]);

  const onInputChange = (e) => {
    setError?.(null);
    handleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError?.(null);
    await onUpdateUser(values);
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      name="edit-profile"
      title="Edit Profile"
      buttonText="Save"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      // si tu ModalWithForm lo soporta:
      isSubmitDisabled={!isValid}
    >
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
          placeholder="Avatar URL"
          value={values.avatar}
          onChange={onInputChange}
          pattern="https?://.+"
          required
        />
        {(errors.avatar || error === "INVALID_AVATAR_URL") && (
          <span className="form__error">{errors.avatar || "Please enter a valid URL."}</span>
        )}
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
