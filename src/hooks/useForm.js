// src/hooks/useForm.js (o donde lo tengas)
import { useCallback, useState } from "react";

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, validationMessage, form } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({ ...prev, [name]: fieldValue }));
    setErrors((prev) => ({ ...prev, [name]: validationMessage || "" }));
    setIsValid(form?.checkValidity() ?? false);
  };

  // permite resetear con nuevos valores y estado de validez/errores
  const resetForm = useCallback(
    (nextValues = {}, nextErrors = {}, nextIsValid = false) => {
      setValues(nextValues);
      setErrors(nextErrors);
      setIsValid(nextIsValid);
    },
    []
  );

  return {
    values,
    errors,
    isValid,
    handleChange,
    resetForm,
    setValues,
    setErrors,
    setIsValid,
  };
}
