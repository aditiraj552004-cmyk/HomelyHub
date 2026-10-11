import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema(
  {
    // ======================================================
    // PROPERTY
    // ======================================================

    property: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Property",

      required: [
        true,
        "Booking must belong to a property",
      ],
    },


    // ======================================================
    // USER
    // ======================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: [
        true,
        "Booking must belong to a user",
      ],
    },


    // ======================================================
    // PRICE
    // ======================================================

    price: {
      type: Number,

      required: [
        true,
        "Booking must have a price",
      ],

      min: [
        0,
        "Price cannot be negative",
      ],
    },


    // ======================================================
    // PAYMENT
    // ======================================================

    paid: {
      type: Boolean,

      default: false,
    },


    // ======================================================
    // DATES
    // ======================================================

    fromDate: {
      type: Date,

      required: [
        true,
        "Check-in date is required",
      ],
    },

    toDate: {
      type: Date,

      required: [
        true,
        "Check-out date is required",
      ],
    },


    // ======================================================
    // GUESTS
    // ======================================================

    guests: {
      type: Number,

      required: [
        true,
        "Number of guests is required",
      ],

      min: [
        1,
        "At least one guest is required",
      ],
    },


    // ======================================================
    // NIGHTS
    // ======================================================

    noOfNights: {
      type: Number,

      required: [
        true,
        "Number of nights is required",
      ],

      min: [
        1,
        "Booking must be for at least one night",
      ],
    },
  },

  {
    timestamps: true,
  }
);


// ======================================================
// VALIDATE DATES
// ======================================================

bookingSchema.pre("validate", function () {

  if (
    this.fromDate &&
    this.toDate
  ) {

    if (
      this.toDate <=
      this.fromDate
    ) {

      throw new Error(
        "Check-out date must be after check-in date"
      );
    }
  }
});


// ======================================================
// POPULATE PROPERTY AND USER
// ======================================================

bookingSchema.pre(
  /^find/,
  function () {

    this.populate({
      path: "property",

      select:
        "title address pricePerNight images",
    });

    this.populate({
      path: "user",

      select:
        "name email phone avatar",
    });
  }
);


// ======================================================
// MODEL
// ======================================================

const Booking =
  mongoose.model(
    "Booking",
    bookingSchema
  );


export { Booking };