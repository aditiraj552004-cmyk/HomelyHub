import { createSlice } from "@reduxjs/toolkit";

const propertyDetailsSlice = createSlice({
  name: "propertyDetails",

  initialState: {
    propertyDetails: null,
    loading: false,
    error: null,
  },

  reducers: {
    // Request started
    getRequest(state) {
      state.loading = true;
      state.error = null;
    },

    // Property received successfully
    getPropertyDetails(state, action) {
      state.propertyDetails = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Error
    getErrors(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    // Optional: clear previous property
    clearPropertyDetails(state) {
      state.propertyDetails = null;
      state.error = null;
    },
  },
});

export const propertyDetailsAction =
  propertyDetailsSlice.actions;

export default propertyDetailsSlice.reducer;