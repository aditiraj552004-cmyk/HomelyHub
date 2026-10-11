import {
  propertyActions,
} from "./property-slice";

import {
  axiosInstance,
} from "../../utils/axios";

// ======================================================
// GET ALL PROPERTIES
// ======================================================

export const getAllProperties =
  () => async (dispatch, getState) => {
    try {
      console.log("API call started");

      // Start loading
      dispatch(
        propertyActions.getRequest()
      );

      // IMPORTANT:
      // store key is "properties"
      const { searchParams } =
        getState().properties;

      console.log(
        "Search Params:",
        searchParams
      );

      // API call
      const response =
        await axiosInstance.get(
          "/v1/rent/property",
          {
            params: searchParams,
          }
        );

      console.log(
        "API Response:",
        response.data
      );

      // Save data in Redux
      dispatch(
        propertyActions.getProperties(
          response.data
        )
      );
    } catch (error) {
      console.error(
        "Property API Error:",
        error
      );

      dispatch(
        propertyActions.getErrors(
          error.response?.data?.message ||
            error.message ||
            "Could not fetch properties"
        )
      );
    }
  };