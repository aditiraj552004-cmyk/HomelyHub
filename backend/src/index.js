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

app.use(cors({
  origin:process.env.ORIGIN_ACCESS_URL,
  credentials:true
}))

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

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