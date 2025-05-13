import { configureStore } from "@reduxjs/toolkit";
import cryptoDashboardReducer from "./cryptoDashboard/cryptoDashboardSlice";
const store = configureStore({
  reducer: {
    cryptoDashboard: cryptoDashboardReducer,
  },
});
export default store;
