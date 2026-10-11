import express from "express";

import {
  createProperty,
  getProperties,
  getPropertyBySlug,
} from "../controllers/propertyController.js";

const propertyRouter =
  express.Router();

// All properties
propertyRouter
  .route("/")
  .get(getProperties)
  .post(createProperty);

// Single property by slug
propertyRouter.get(
  "/:slug",
  getPropertyBySlug
);

export { propertyRouter };