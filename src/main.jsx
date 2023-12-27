import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import { ToastContainer } from "react-toastify";

import App from "./App.jsx";
import theme from "./themes/index.js";

import "./font.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastContainer
        pauseOnFocusLoss={false}
        theme="colored"
        position="bottom-center"
      />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
