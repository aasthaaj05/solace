import React from "react";
import ReactDOM from "react-dom/client"; // Use `react-dom/client`
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Correct way in React 18
root.render(<App />);
