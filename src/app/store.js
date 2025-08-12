import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatroomsReducer from "../features/chatrooms/chatroomsSlice";
import themeReducer from "../theme/themeSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatrooms: chatroomsReducer,
    theme: themeReducer,
  },
});
