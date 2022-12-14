import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import emailVerifyReducer from "./emailVerifySlice";
import cartReducer from "./cartSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    emailVerify: emailVerifyReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
