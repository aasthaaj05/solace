import React from "react";

const FadeIn = ({ children }) => {
  return (
    <div style={{ animation: "fadeIn 1s ease-in-out" }}>
      {children}
    </div>
  );
};

export default FadeIn;
