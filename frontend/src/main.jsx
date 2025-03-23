import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store"; 
import { RouterProvider } from "react-router-dom";
import './index.css'
import { AuthProvider } from "../src/context/authContext";
import router from "./routers/Router";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider> {/* AuthProvider wraps everything */}
        <RouterProvider router={router} /> 
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
