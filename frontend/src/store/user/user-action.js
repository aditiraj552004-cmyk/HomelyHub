import { userActions } from "./user-slice";
import { axiosInstance } from "../../utils/axios";

// ======================================================
// HELPER - GET ERROR MESSAGE
// ======================================================

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong"
  );
};

// ======================================================
// SIGNUP
// ======================================================

export const getSignup =
  (user) => async (dispatch) => {
    try {
      dispatch(
        userActions.getSignupRequest()
      );

      const { data } =
        await axiosInstance.post(
          "/v1/rent/user/signup",
          user
        );

      dispatch(
        userActions.getSignupDetails(
          data.user
        )
      );
    } catch (error) {
      dispatch(
        userActions.getError(
          getErrorMessage(error)
        )
      );
    }
  };

// ======================================================
// LOGIN
// ======================================================

export const getLogin =
  (user) => async (dispatch) => {
    try {
      dispatch(
        userActions.getLoginRequest()
      );

      const { data } =
        await axiosInstance.post(
          "/v1/rent/user/login",
          user
        );

      dispatch(
        userActions.getLoginDetails(
          data.user
        )
      );
    } catch (error) {
      dispatch(
        userActions.getError(
          getErrorMessage(error)
        )
      );
    }
  };

// ======================================================
// GET CURRENT USER
// ======================================================

export const getCurrentUser =
  () => async (dispatch) => {
    try {
      dispatch(
        userActions.getCurrentRequest()
      );

      const { data } =
        await axiosInstance.get(
          "/v1/rent/user/me"
        );

      dispatch(
        userActions.getCurrentUser(
          data.user
        )
      );
    } catch (error) {
      console.log(
        "Current user error:",
        getErrorMessage(error)
      );

      dispatch(
        userActions.getLogout(null)
      );
    }
  };

// ======================================================
// UPDATE USER
// ======================================================

export const updateUser =
  (updatedUser) => async (dispatch) => {
    try {
      dispatch(
        userActions.getUpdateUserRequest()
      );

      await axiosInstance.patch(
        "/v1/rent/user/updateMe",
        updatedUser
      );

      // Fetch updated user again
      const { data } =
        await axiosInstance.get(
          "/v1/rent/user/me"
        );

      dispatch(
        userActions.getCurrentUser(
          data.user
        )
      );
    } catch (error) {
      dispatch(
        userActions.getError(
          getErrorMessage(error)
        )
      );
    }
  };

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword =
  (email) => async (dispatch) => {
    try {
      dispatch(
        userActions.getPasswordRequest()
      );

      await axiosInstance.post(
        "/v1/rent/user/forgotPassword",

        // If component sends string:
        typeof email === "string"
          ? { email }
          : email
      );

      dispatch(
        userActions.getPasswordSuccess(
          true
        )
      );
    } catch (error) {
      dispatch(
        userActions.getError(
          getErrorMessage(error)
        )
      );
    }
  };

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword =
  (resetPasswordData, token) =>
  async (dispatch) => {
    try {
      dispatch(
        userActions.getPasswordRequest()
      );

      await axiosInstance.patch(
        `/v1/rent/user/resetPassword/${token}`,
        resetPasswordData
      );

      dispatch(
        userActions.getPasswordSuccess(
          true
        )
      );
    } catch (error) {
      dispatch(
        userActions.getError(
          getErrorMessage(error)
        )
      );
    }
  };

// ======================================================
// UPDATE PASSWORD
// ======================================================

export const updatePassword =
  (passwords) => async (dispatch) => {
    try {
      dispatch(
        userActions.getPasswordRequest()
      );

      await axiosInstance.patch(
        "/v1/rent/user/updateMyPassword",
        passwords
      );

      dispatch(
        userActions.getPasswordSuccess(
          true
        )
      );
    } catch (error) {
      dispatch(
        userActions.getError(
          getErrorMessage(error)
        )
      );
    }
  };

// ======================================================
// LOGOUT
// ======================================================

export const logout =
  () => async (dispatch) => {
    try {
      dispatch(
        userActions.getLogoutRequest()
      );

      await axiosInstance.get(
        "/v1/rent/user/logout"
      );

      dispatch(
        userActions.getLogout(null)
      );
    } catch (error) {
      dispatch(
        userActions.getError(
          getErrorMessage(error)
        )
      );
    }
  };