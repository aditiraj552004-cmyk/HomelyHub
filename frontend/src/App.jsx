import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

// ==============================
// Home / Property
// ==============================

import PropertyList from "./components/home/PropertyList";
import PropertyListing from "./components/propertyListing/PropertyListing";
import Main from "./components/home/Main";

// ==============================
// Accommodation
// ==============================

import Accomodation from "./components/accomodation/Accomodation";
import AccomodationForm from "./components/accomodation/AccomodationForm";

// ==============================
// User
// ==============================

import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/user/Profile";
import EditProfile from "./components/user/EditProfile";
import ForgetPassword from "./components/user/ForgetPassword";
import ResetPassword from "./components/user/ResetPassword";
import UpdatePassword from "./components/user/UpdatePassword";

// ==============================
// Booking
// ==============================

import MyBookings from "./components/myBookings/MyBookings";
import BookingDetails from "./components/myBookings/BookingDetails";

// ==============================
// Payment
// ==============================

import Payment from "./components/payment/Payment";

// ==============================
// AI Trip Planner
// ==============================

import AiTripPlanner from "./components/aiTripPlanner/AiTripPlanner";

// ==============================
// Other
// ==============================

import NotFound from "./components/NotFound";

// ==============================
// Redux
// ==============================

import {
  userActions,
} from "./store/user/user-slice";

import {
  getCurrentUser,
} from "./store/user/user-action";

function App() {
  const dispatch = useDispatch();

  const {
    errors,
    isAuthenticated,
  } = useSelector(
    (state) => state.user
  );

  // ====================================================
  // CLEAR OLD ERRORS
  // ====================================================

  useEffect(() => {
    if (errors) {
      dispatch(
        userActions.clearErrors()
      );
    }
  }, [errors, dispatch]);

  // ====================================================
  // CHECK CURRENT LOGGED-IN USER
  // ====================================================

  useEffect(() => {
    dispatch(
      getCurrentUser()
    );
  }, [dispatch]);

  return (
    <div className="App">
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />

      <Router>
        <Routes>
          {/* =========================
              MAIN LAYOUT
          ========================= */}

          <Route
            path="/"
            element={<Main />}
          >
            {/* Home */}
            <Route
              index
              element={<PropertyList />}
            />

            {/* Property Details */}
            <Route
              path="propertylist/:id"
              element={
                <PropertyListing />
              }
            />

            {/* =========================
                AUTH
            ========================= */}

            <Route
              path="login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login />
                )
              }
            />

            <Route
              path="signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup />
                )
              }
            />

            {/* =========================
                PROFILE
            ========================= */}

            <Route
              path="profile"
              element={
                isAuthenticated ? (
                  <Profile />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="editprofile"
              element={
                isAuthenticated ? (
                  <EditProfile />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* =========================
                AI TRIP PLANNER
            ========================= */}

            <Route
              path="ai-trip-planner"
              element={
                <AiTripPlanner />
              }
            />

            {/* =========================
                ACCOMMODATION
            ========================= */}

            <Route
              path="accomodation"
              element={
                <Accomodation />
              }
            />

            <Route
              path="accomodationform"
              element={
                isAuthenticated ? (
                  <AccomodationForm />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* =========================
                PASSWORD
            ========================= */}

            <Route
              path="user/forgotPassword"
              element={
                <ForgetPassword />
              }
            />

            <Route
              path="user/resetPassword/:token"
              element={
                <ResetPassword />
              }
            />

            <Route
              path="user/updatepassword"
              element={
                isAuthenticated ? (
                  <UpdatePassword />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* =========================
                BOOKINGS
            ========================= */}

            <Route
              path="user/mybookings"
              element={
                isAuthenticated ? (
                  <MyBookings />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="user/mybookings/:bookingId"
              element={
                isAuthenticated ? (
                  <BookingDetails />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* =========================
                PAYMENT
            ========================= */}

            <Route
              path="payment/:propertyId"
              element={
                isAuthenticated ? (
                  <Payment />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* =========================
                404
            ========================= */}

            <Route
              path="*"
              element={<NotFound />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
