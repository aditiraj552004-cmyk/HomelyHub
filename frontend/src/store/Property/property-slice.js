import { createSlice } from "@reduxjs/toolkit";

const propertySlice = createSlice({
  name: "property",

  initialState: {
    properties: [],
    totalProperties: 0,
    searchParams: {},
    error: null,
    loading: false,
  },

  reducers: {
    getRequest(state) {
      state.loading = true;
      state.error = null;
    },

    getProperties(state, action) {
      const responseData = action.payload.data;
      state.properties = Array.isArray(responseData)
        ? responseData
        : responseData?.properties || [];

      state.totalProperties =
        action.payload.totalProperties ??
        action.payload.no_of_responses ??
        0;

      state.loading = false;
      state.error = null;
    },

    updateSearchParams(state, action) {
      if (
        !action.payload ||
        Object.keys(action.payload).length === 0
      ) {
        state.searchParams = {};
      } else {
        state.searchParams = {
          ...state.searchParams,
          ...action.payload,
        };
      }
    },

    clearSearchParams(state) {
      state.searchParams = {};
    },

    getErrors(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    clearErrors(state) {
      state.error = null;
    },
  },
});

export const propertyActions =
  propertySlice.actions;

export default propertySlice.reducer;
