import jwt from "jsonwebtoken";

// ======================================================
// Create JWT
// ======================================================

const signinToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing"
    );
  }

  if (
    !process.env.JWT_EXPIRES_IN
  ) {
    throw new Error(
      "JWT_EXPIRES_IN is missing"
    );
  }

  return jwt.sign(
    {
      id,
    },

    process.env.JWT_SECRET,

    {
      expiresIn:
        process.env.JWT_EXPIRES_IN,
    }
  );
};

// ======================================================
// Send JWT cookie
// ======================================================

const createSendToken = (
  user,
  statusCode,
  res
) => {
  const token =
    signinToken(user._id);

  const cookieDays =
    Number(
      process.env
        .JWT_COOKIE_EXPIRES_IN
    );

  if (
    !cookieDays ||
    Number.isNaN(cookieDays)
  ) {
    throw new Error(
      "JWT_COOKIE_EXPIRES_IN must be a number"
    );
  }

  const isProduction =
    process.env.NODE_ENV ===
    "production";

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() +
        cookieDays *
          24 *
          60 *
          60 *
          1000
    ),

    httpOnly: true,

    secure: isProduction,

    sameSite: isProduction
      ? "none"
      : "lax",
  });

  const safeUser =
    typeof user.toObject ===
    "function"
      ? user.toObject()
      : { ...user };

  delete safeUser.password;
  delete safeUser.passwordConfirm;
  delete safeUser.passwordResetToken;
  delete safeUser.passwordResetExpires;

  return res.status(statusCode).json({
    status: "success",
    user: safeUser,
  });
};

// ======================================================
// Default Avatar
// ======================================================

const defaultAvatarUrl = (
  name
) => {
  const safeName =
    encodeURIComponent(
      name || "User"
    );

  return (
    `https://ui-avatars.com/api/?name=${safeName}` +
    "&background=0e8b53" +
    "&color=fff" +
    "&size=256" +
    "&bold=true"
  );
};

// ======================================================
// Filter object
// ======================================================

const filterObj = (
  obj,
  ...allowedFields
) => {
  const newObj = {};

  if (
    !obj ||
    typeof obj !== "object"
  ) {
    return newObj;
  }

  Object.keys(obj).forEach(
    (key) => {
      if (
        allowedFields.includes(
          key
        )
      ) {
        newObj[key] =
          obj[key];
      }
    }
  );

  return newObj;
};

export {
  signinToken,
  createSendToken,
  defaultAvatarUrl,
  filterObj,
};