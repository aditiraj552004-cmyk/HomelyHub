import { axiosInstance } from "../../utils/axios";

import {
  setBookingRequest,
  setBookings,
  setBookingDetails,
} from "./booking-slice";

// ======================================================
// FETCH SINGLE BOOKING DETAILS
// ======================================================

export const fetchBookingDetails =
  (bookingId) => async (dispatch) => {
    try {
      // Start loading
      dispatch(setBookingRequest());

      const response =
        await axiosInstance.get(
          `/v1/rent/user/booking/${bookingId}`
        );

      console.log(
        "Booking Details:",
        response.data
      );

      dispatch(
        setBookingDetails(
          response.data.data
        )
      );
    } catch (error) {
      console.error(
        "Error fetching booking details:",
        error.response?.data?.message ||
          error.message
      );
    }
  };

// ======================================================
// FETCH ALL BOOKINGS OF LOGGED-IN USER
// ======================================================

export const fetchUserBookings =
  () => async (dispatch) => {
    try {
      // Start loading
      dispatch(setBookingRequest());

      const response =
        await axiosInstance.get(
          "/v1/rent/user/booking"
        );

      console.log(
        "User Bookings:",
        response.data
      );

      dispatch(
        setBookings(
          Array.isArray(response.data?.data)
            ? response.data.data
            : response.data?.data?.bookings || []
        )
      );
    } catch (error) {
      console.error(
        "Error fetching bookings:",
        error.response?.data?.message ||
          error.message
      );

      // Stop loading and keep bookings empty
      dispatch(setBookings([]));
    }
  };
