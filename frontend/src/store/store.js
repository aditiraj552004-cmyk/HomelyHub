import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./Property/property-slice";
import propertDetailsSlice from "./PropertyDetails/propertyDetails-slice";
import userSlice from "./user/user-slice";
import bookingSlice from "./Bookings/booking-slice";
import paymentSlice from "./Payment/payment-slice";
import accomodationSlice from "./accomodation/Accomodation-slice";

const store = configureStore({
    reducer:{
        properties: propertySlice,
        propertyDetails: propertDetailsSlice,
        user: userSlice.reducer,
        booking: bookingSlice.reducer,
        /////////////////////////
        payment:paymentSlice.reducer,
        accomodation:accomodationSlice.reducer
    }
})

export default store;
