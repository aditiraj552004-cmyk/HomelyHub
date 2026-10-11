import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    isAuthenticated: false,
    loading: false,
    user: null,
    errors: null,
    success: false,
  },

  reducers: {
    // ============================
    // SIGNUP
    // ============================

    getSignupRequest(state) {
      state.loading = true;
    },

    getSignupDetails(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // ============================
    // LOGIN
    // ============================

    getLoginRequest(state) {
      state.loading = true;
    },

    getLoginDetails(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // ============================
    // ERROR
    // ============================

    getError(state, action) {
      state.errors = action.payload;
      state.loading = false;
    },

    // ============================
    // CURRENT USER
    // ============================

    getCurrentRequest(state) {
      state.loading = true;
    },

    // ============================
    // UPDATE USER
    // ============================

    getUpdateUserRequest(state) {
      state.loading = true;
    },

    getCurrentUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // ============================
    // LOGOUT
    // ============================

    getLogoutRequest(state) {
      state.loading = true;
    },

    getLogout(state, action) {
      state.user = action.payload;
      state.isAuthenticated = false;
      state.loading = false;
    },

    // ============================
    // PASSWORD
    // ============================

    getPasswordRequest(state) {
      state.loading = true;
    },

    getPasswordSuccess(state, action) {
      state.success = action.payload;
      state.loading = false;
    },

    // ============================
    // CLEAR ERROR
    // ============================

    clearErrors(state) {
      state.errors = null;
    },
  },
});

export const userActions =
  userSlice.actions;

// Tutorial-style export.
// store.js will use userSlice.reducer.
export default userSlice;