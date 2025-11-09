// src/components/EditProfileModal.jsx
import { useState, useEffect, useContext } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function EditProfileModal({ isOpen, onClose, onUpdateUser, error, setError }) {
  const currentUser = useContext(CurrentUserContext);

  const [form, setForm] = useState({ name: "", avatar: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fill form with current user data when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      setForm({
        name: currentUser.name || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [isOpen, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onUpdateUser(form); // Pass form data to parent handler
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      name="edit-profile"
      title="Edit Profile"
      buttonText={isSubmitting ? "Saving..." : "Save"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className={`form__field`}>
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
          required
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
