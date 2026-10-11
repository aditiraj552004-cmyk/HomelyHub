import express from "express";

import {
  getBookingDetails,
  getUserBookings,
  createOrder,
  verifyPayment,
} from "../controllers/bookingController.js";

import {
  protect,
} from "../controllers/authController.js";


const bookingRouter =
  express.Router();


// ======================================================
// GET ALL USER BOOKINGS
// ======================================================

bookingRouter.get(
  "/",
  protect,
  getUserBookings
);


// ======================================================
// GET ONE BOOKING
// ======================================================

bookingRouter.get(
  "/:bookingId",
  protect,
  getBookingDetails
);


// ======================================================
// CREATE ORDER
// ======================================================

bookingRouter.post(
  "/create-order",
  protect,
  createOrder
);


// ======================================================
// VERIFY PAYMENT
// ======================================================

bookingRouter.post(
  "/verify-payment",
  protect,
  verifyPayment
);


export {
  bookingRouter,
};