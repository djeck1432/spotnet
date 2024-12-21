// regex.jsx
export const validateNumberInput = (value) => {
    const regex = /^\d*\.?\d*$/;
    return regex.test(value);
  };