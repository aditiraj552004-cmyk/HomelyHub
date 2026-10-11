import mongoose from "mongoose";
import slugify from "slugify";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "Property must have an owner",
      ],
    },

    title: {
      type: String,
      required: [
        true,
        "Please enter property title",
      ],
      trim: true,
      maxlength: [
        100,
        "Property title cannot exceed 100 characters",
      ],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: [
        true,
        "Please enter property description",
      ],
      trim: true,
    },

    extraInformation: {
      type: String,
      trim: true,
      default: "",
    },

    propertyType: {
      type: String,
      required: [
        true,
        "Please select property type",
      ],

      enum: [
        "hotel",
        "resort",
        "villa",
        "apartment",
        "homestay",
        "guesthouse",
        "hostel",
      ],

      lowercase: true,
    },

    roomType: {
      type: String,

      enum: [
        "single",
        "double",
        "twin",
        "deluxe",
        "suite",
        "family",
        "shared",
      ],

      lowercase: true,
    },

    maxGuests: {
      type: Number,
      required: [
        true,
        "Please enter maximum guests",
      ],

      min: [
        1,
        "Maximum guests must be at least 1",
      ],
    },

    pricePerNight: {
      type: Number,
      required: [
        true,
        "Please enter price per night",
      ],

      min: [
        0,
        "Price cannot be negative",
      ],
    },

    address: {
      street: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        required: [
          true,
          "Please enter city",
        ],
        trim: true,
        lowercase: true,
      },

      state: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        default: "India",
        trim: true,
      },

      pincode: {
        type: String,
        trim: true,
      },

      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },

        longitude: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },

    amenities: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        // ImageKit returns fileId
        fileId: {
          type: String,
          required: true,
        },

        isCover: {
          type: Boolean,
          default: false,
        },
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // ======================================================
    // CURRENT BOOKINGS
    // ======================================================

    currentBookings: [
      {
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },

        fromDate: {
          type: Date,
        },

        toDate: {
          type: Date,
        },

        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },

  // ======================================================
  // SCHEMA OPTIONS
  // ======================================================

  {
    timestamps: true,
  }
);

// ======================================================
// Generate unique slug
// Mongoose 9: don't use next()
// ======================================================

propertySchema.pre(
  "save",
  async function () {
    if (!this.isModified("title")) {
      return;
    }

    const baseSlug = slugify(
      this.title,
      {
        lower: true,
        strict: true,
        trim: true,
      }
    );

    let slug = baseSlug;
    let count = 1;

    while (
      await this.constructor.exists({
        slug,
        _id: {
          $ne: this._id,
        },
      })
    ) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = slug;
  }
);

// ======================================================
// MODEL
// ======================================================

const Property = mongoose.model.Property || mongoose.model("Property",propertySchema);

export  {Property};