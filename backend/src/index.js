import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./utils/db.js";

import { userRouter } from "./routes/userRoutes.js";
import { propertyRouter } from "./routes/propertyRoutes.js";
import { bookingRouter } from "./routes/BookingRoutes.js";
import { tripRouter } from "./routes/tripRouter.js";
import { createOrder } from "./controllers/bookingController.js";

const app = express();

const PORT = process.env.PORT || 8080;
const allowedOrigins = new Set(
  [
    process.env.ORIGIN_ACCESS_URL,
    process.env.FRONTEND_URL,
    "https://homelyhub-stays.netlify.app",
    "http://localhost:5173",
  ]
    .filter(Boolean)
    .flatMap((origin) => origin.split(",").map((value) => value.trim()))
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests and explicitly configured app origins.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);


// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {

  res.status(200).json({

    status: "success",

    message:
      "Homely Hub server is running",

  });

});


// ======================================================
// ROUTES
// ======================================================

app.use(
  "/api/v1/rent/user",
  userRouter
);

app.use(
  "/api/v1/rent/property",
  propertyRouter
);

app.use(
  "/api/v1/rent/user/booking",
  bookingRouter
);
app.use(
  "/api/v1/rent/trip",
  tripRouter
);

// ======================================================
// UNKNOWN ROUTE
// ======================================================

app.use((req, res) => {

  res.status(404).json({

    status: "fail",

    message:
      `Route ${req.originalUrl} not found`,

  });

});


// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {

  try {

    await connectDB();

    app.listen(
      PORT,
      () => {

        console.log(
          `🚀 Homely Hub server running on port ${PORT}`
        );

      }
    );

  } catch (error) {

    console.error(
      "❌ Server failed:",
      error.message
    );

    process.exit(1);

  }

};


startServer();
