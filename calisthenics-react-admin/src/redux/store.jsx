import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import navigationReducer from "./navigationSlice";

export const store = configureStore({
  reducer: {
    token: authReducer,
    navigation: navigationReducer,
  },
});
