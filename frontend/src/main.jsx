import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.jsx";
import store from "./store/store.js";
import { ThemeProvider } from "./components/ThemeContext.jsx";

import "./index.css";
import "./css/responsive.css";
import "./css/theme.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
