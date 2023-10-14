import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store.js";
import { getAllPosts } from "./features/postSlice.js";
import { getAllUsers } from "./features/userSlice.js";
import "./index.css";
import App from "./App.jsx";

store.dispatch(getAllUsers());
store.dispatch(getAllPosts());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
