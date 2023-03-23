import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

// This is the main store file, it references individual store setups
// through reducers called slices
export const store = configureStore({
    reducer: {
        auth: authSlice
    }
})