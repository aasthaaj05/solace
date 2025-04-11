// src/components/ui/Button.jsx
import React from "react";

const Button = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="custom-button">
      {children}
    </button>
  );
};

export default Button;
