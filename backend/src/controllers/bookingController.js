import { Property } from "../Models/propertyModel.js";
import { Booking } from "../Models/bookingModel.js";


// ======================================================
// CREATE ORDER
// ======================================================

const createOrder = async (req, res) => {

  try {

    const {
      propertyId,
      fromDate,
      toDate,
      guests,
    } = req.body;


    // ==================================================
    // REQUIRED FIELDS
    // ==================================================

    if (
      !propertyId ||
      !fromDate ||
      !toDate ||
      !guests
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please provide property, dates and guests",

      });
    }


    // ==================================================
    // FIND PROPERTY
    // ==================================================

    const property =
      await Property.findById(
        propertyId
      );


    if (!property) {

      return res.status(404).json({

        success: false,

        message:
          "Property not found",

      });
    }


    // ==================================================
    // CHECK AVAILABILITY
    // ==================================================

    if (!property.isAvailable) {

      return res.status(400).json({

        success: false,

        message:
          "Property is currently unavailable",

      });
    }


    // ==================================================
    // CHECK GUESTS
    // ==================================================

    const numberOfGuests =
      Number(guests);


    if (
      !Number.isInteger(
        numberOfGuests
      ) ||
      numberOfGuests < 1
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid number of guests",

      });
    }


    if (
      numberOfGuests >
      property.maxGuests
    ) {

      return res.status(400).json({

        success: false,

        message:
          `Maximum ${property.maxGuests} guests are allowed`,

      });
    }


    // ==================================================
    // DATE VALIDATION
    // ==================================================

    const startDate =
      new Date(fromDate);

    const endDate =
      new Date(toDate);


    if (
      Number.isNaN(
        startDate.getTime()
      ) ||
      Number.isNaN(
        endDate.getTime()
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid booking dates",

      });
    }


    if (
      endDate <= startDate
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Check-out date must be after check-in date",

      });
    }


    // ==================================================
    // CHECK OVERLAPPING BOOKINGS
    // ==================================================

    const overlappingBooking =
      property.currentBookings?.find(
        (booking) => {

          const existingFrom =
            new Date(
              booking.fromDate
            );

          const existingTo =
            new Date(
              booking.toDate
            );


          return (
            startDate <
              existingTo &&
            endDate >
              existingFrom
          );
        }
      );


    if (overlappingBooking) {

      return res.status(400).json({

        success: false,

        message:
          "Property is already booked for these dates",

      });
    }


    // ==================================================
    // CALCULATE NIGHTS
    // ==================================================

    const millisecondsPerDay =
      1000 *
      60 *
      60 *
      24;


    const nights = Math.ceil(
      (
        endDate -
        startDate
      ) /
      millisecondsPerDay
    );


    if (nights < 1) {

      return res.status(400).json({

        success: false,

        message:
          "Booking must be for at least one night",

      });
    }


    // ==================================================
    // CALCULATE PRICE ON SERVER
    // ==================================================

    const amount =
      property.pricePerNight *
      nights;


    // ==================================================
    // CREATE ORDER ID
    // ==================================================

    const orderId =
      "order_" +
      Date.now();


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({

      success: true,

      message:
        "Order created successfully",

      orderId,

      amount,

      propertyId,

      fromDate,

      toDate,

      guests:
        numberOfGuests,

      nights,

    });

  } catch (error) {

    console.error(
      "Create Order Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// ======================================================
// VERIFY PAYMENT
// ======================================================

const verifyPayment = async (
  req,
  res
) => {

  try {

    const {
      orderId,
      bookingDetails,
      forceStatus,
    } = req.body;


    // ==================================================
    // CHECK BOOKING DETAILS
    // ==================================================

    if (
      !bookingDetails
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Booking details are required",

      });
    }


    const {
      propertyId,
      fromDate,
      toDate,
      guests,
    } = bookingDetails;


    // ==================================================
    // FIND PROPERTY
    // ==================================================

    const property =
      await Property.findById(
        propertyId
      );


    if (!property) {

      return res.status(404).json({

        success: false,

        message:
          "Property not found",

      });
    }


    if (!property.isAvailable) {

      return res.status(400).json({

        success: false,

        message:
          "Property is currently unavailable",

      });
    }


    // ==================================================
    // VALIDATE GUESTS
    // ==================================================

    const numberOfGuests =
      Number(guests);


    if (
      !Number.isInteger(
        numberOfGuests
      ) ||
      numberOfGuests < 1
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid number of guests",

      });
    }


    if (
      numberOfGuests >
      property.maxGuests
    ) {

      return res.status(400).json({

        success: false,

        message:
          `Maximum ${property.maxGuests} guests are allowed`,

      });
    }


    // ==================================================
    // DATE VALIDATION
    // ==================================================

    const startDate =
      new Date(fromDate);

    const endDate =
      new Date(toDate);


    if (
      Number.isNaN(
        startDate.getTime()
      ) ||
      Number.isNaN(
        endDate.getTime()
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid booking dates",

      });
    }


    if (
      endDate <= startDate
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Check-out date must be after check-in date",

      });
    }


    // ==================================================
    // CHECK OVERLAPPING BOOKINGS AGAIN
    // ==================================================

    const overlappingBooking =
      property.currentBookings?.find(
        (booking) => {

          const existingFrom =
            new Date(
              booking.fromDate
            );

          const existingTo =
            new Date(
              booking.toDate
            );


          return (
            startDate <
              existingTo &&
            endDate >
              existingFrom
          );
        }
      );


    if (overlappingBooking) {

      return res.status(400).json({

        success: false,

        message:
          "Property is already booked for these dates",

      });
    }


    // ==================================================
    // CALCULATE NIGHTS
    // ==================================================

    const nights = Math.ceil(

      (
        endDate -
        startDate
      ) /

      (
        1000 *
        60 *
        60 *
        24
      )

    );


    // ==================================================
    // CALCULATE PRICE
    // ==================================================

    const calculatedPrice =
      property.pricePerNight *
      nights;


    // ==================================================
    // PAYMENT SUCCESS
    // ==================================================

    if (
      forceStatus ===
      "success"
    ) {

      const paymentId =
        "pay_" +
        Date.now();


      // ================================================
      // CREATE BOOKING
      // ================================================

      const newBooking =
        await Booking.create({

          user:
            req.user._id,

          property:
            propertyId,

          price:
            calculatedPrice,

          fromDate:
            startDate,

          toDate:
            endDate,

          guests:
            numberOfGuests,

          noOfNights:
            nights,

          paid:
            true,

        });


      // ================================================
      // BLOCK PROPERTY DATES
      // ================================================

      await Property.findByIdAndUpdate(

        propertyId,

        {

          $push: {

            currentBookings: {

              bookingId:
                newBooking._id,

              fromDate:
                startDate,

              toDate:
                endDate,

              userId:
                req.user._id,

            },

          },

        },

        {
          new: true,
        }

      );


      // ================================================
      // SUCCESS RESPONSE
      // ================================================

      return res.status(200).json({

        success: true,

        message:
          "Booking confirmed",

        paymentId,

        orderId,

        booking:
          newBooking,

      });
    }


    // ==================================================
    // PAYMENT FAILED
    // ==================================================

    return res.status(400).json({

      success: false,

      message:
        "Payment failed",

      orderId,

    });

  } catch (error) {

    console.error(
      "Verify Payment Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });
  }
};


// ======================================================
// GET USER BOOKINGS
// ======================================================

const getUserBookings = async (
  req,
  res
) => {

  try {

    const bookings =
      await Booking.find({

        user:
          req.user._id,

      });


    return res.status(200).json({

      status:
        "success",

      results:
        bookings.length,

      data:
        bookings,

    });

  } catch (error) {

    console.error(
      "Get User Bookings Error:",
      error
    );

    return res.status(500).json({

      status:
        "error",

      message:
        error.message,

    });
  }
};


// ======================================================
// GET ONE BOOKING
// ======================================================

const getBookingDetails = async (
  req,
  res
) => {

  try {

    const booking =
      await Booking.findOne({

        _id:
          req.params.bookingId,

        user:
          req.user._id,

      });


    if (!booking) {

      return res.status(404).json({

        status:
          "fail",

        message:
          "Booking not found",

      });
    }


    return res.status(200).json({

      status:
        "success",

      data:
        booking,

    });

  } catch (error) {

    console.error(
      "Get Booking Details Error:",
      error
    );

    return res.status(500).json({

      status:
        "error",

      message:
        error.message,

    });
  }
};


// ======================================================
// EXPORT
// ======================================================

export {

  getBookingDetails,

  getUserBookings,

  createOrder,

  verifyPayment,

};