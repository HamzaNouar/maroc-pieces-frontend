// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import userReducer from "./slices/userSlice";
import reportReducer from "./slices/reportSlice";
import dashboardReducer from "./slices/dashboardSlice";
import settingsReducer from "./slices/settingsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    orders: orderReducer,
    users: userReducer,
    reports: reportReducer,
    dashboard: dashboardReducer, // Add this line
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "products/create/fulfilled",
          "products/update/fulfilled",
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.headers", "payload.config"],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }),
});

export default store;
