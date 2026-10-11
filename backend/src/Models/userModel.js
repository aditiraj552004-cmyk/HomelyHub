import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxlength: [
        50,
        "Your name cannot be longer than 50 characters",
      ],
    },

    email: {
      type: String,
      required: [true, "Please enter email ID"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [
        6,
        "Password must be at least 6 characters",
      ],
      select: false,
    },

    passwordConfirm: {
      type: String,
      select: false,

      required: function () {
        return (
          this.isNew ||
          this.isModified("password")
        );
      },

      validate: {
        validator: function (value) {
          if (!this.isModified("password")) {
            return true;
          }

          return value === this.password;
        },

        message: "Passwords are not the same",
      },
    },

    passwordChangedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
      select: false,
      index: true,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// Remove sensitive data from responses
// ======================================================

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;

    return ret;
  },
});

// ======================================================
// Hash password before saving
// Mongoose 9: don't use next()
// ======================================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  // If existing user changes password
  if (!this.isNew) {
    this.passwordChangedAt =
      Date.now() - 1000;
  }

  this.password = await bcrypt.hash(
    this.password,
    12
  );

  this.passwordConfirm = undefined;
});

// ======================================================
// Check password
// ======================================================

userSchema.methods.correctPassword =
  async function (
    candidatePassword,
    userPassword
  ) {
    return bcrypt.compare(
      candidatePassword,
      userPassword
    );
  };

// ======================================================
// Check if password changed after JWT was created
// ======================================================

userSchema.methods.changedPasswordAfter =
  function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp =
        Math.floor(
          this.passwordChangedAt.getTime() /
            1000
        );

      return (
        JWTTimestamp < changedTimestamp
      );
    }

    return false;
  };

// ======================================================
// Create password reset token
// ======================================================

userSchema.methods.createPasswordResetToken =
  function () {
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetExpires =
      Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

const User = mongoose.model(
  "User",
  userSchema
);

export { User };