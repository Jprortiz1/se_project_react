import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

const AddItemModal = ({ isOpen, onAddItem, onCloseModal }) => {
  const { values, handleChange, resetForm } = useForm({
    name: "",
    imageUrl: "",
    weather: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const imageUrl = values.imageUrl || values.link;
    const weatherLower =
      typeof values.weather === "string"
        ? values.weather.toLowerCase()
        : values.weather;

    onAddItem({
      name: values.name,
      imageUrl,
      weather: weatherLower,
    });

    resetForm();
    onCloseModal();
  };

  return (
    <ModalWithForm
      name="add-garment"
      title="New garment"
      buttonText="Add garment"
      isOpen={isOpen}
      onClose={onCloseModal}
      onSubmit={handleSubmit}
    >
      <label className="form__field">
        <span>Name</span>
        <input
          className="form__control"
          name="name"
          type="text"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
          required
        />
      </label>

      <label className="form__field">
        <span>Image URL</span>
        <input
          className="form__control"
          name="imageUrl"
          type="url"
          placeholder="Image URL"
          value={values.imageUrl}
          onChange={handleChange}
          required
        />
      </label>

      <fieldset className="form__field form__weather">
        <legend>Select the weather type:</legend>
        <div className="form__radios">
          <label className="radio">
            <input
              type="radio"
              name="weather"
              value="hot"
              checked={values.weather === "hot"}
              onChange={handleChange}
              required
            />
            <span>Hot</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="weather"
              value="warm"
              checked={values.weather === "warm"}
              onChange={handleChange}
            />
            <span>Warm</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="weather"
              value="cold"
              checked={values.weather === "cold"}
              onChange={handleChange}
            />
            <span>Cold</span>
          </label>
        </div>
      </fieldset>
    </ModalWithForm>
  );
};

export default AddItemModal;
