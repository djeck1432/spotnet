import { configureStore } from "@reduxjs/toolkit";
import cryptoDashboardReducer from "./cryptoDashboard/cryptoDashboardSlice";
import poolsReducer from "./slices/poolsSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    cryptoDashboard: cryptoDashboardReducer,
    pools: poolsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
