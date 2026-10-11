import {createSlice} from "@reduxjs/toolkit";

const initialState={
  bookings:[],
  bookingDetails:{},
  loading:false
}

const bookinSlice=createSlice({
  name:"booking",
  initialState,
  reducers:{
    setBookingRequest(state){
      state.loading=true;
    },
    setBookings(state,action){
      state.bookings=action.payload;
      state.loading=false;
    },
    addBooking:(state,action)=>{
      state.bookings.push(action.payload);
    },
    setBookingDetails:(state,action)=>{
      state.bookingDetails=action.payload?.bookings ?? action.payload;
    }
  }
})
export const { setBookingRequest, setBookings, addBooking, setBookingDetails } = bookinSlice.actions;
export default bookinSlice;
