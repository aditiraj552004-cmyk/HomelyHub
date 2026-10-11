import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

// ======================================================
// GET SINGLE PROPERTY DETAILS
// ======================================================

export const getPropertyDetails =
  (slug) => async (dispatch) => {
    try {
      // 1. Start loading
      dispatch(
        propertyDetailsAction.getRequest()
      );

      // 2. Call backend API
      const response =
        await axiosInstance.get(
          `/v1/rent/property/${slug}`
        );

      // 3. Get property data
      const property =
        response.data?.data?.property ??
        response.data?.data;

      console.log(
        "Property Details:",
        property
      );

      // 4. Store property in Redux
      dispatch(
        propertyDetailsAction.getPropertyDetails(
          property
        )
      );
    } catch (error) {
      console.error(
        "Property Details Error:",
        error
      );

      // 5. Store error in Redux
      dispatch(
        propertyDetailsAction.getErrors(
          error.response?.data?.message ||
            error.message ||
            "Could not fetch property details"
        )
      );
    }
  };
