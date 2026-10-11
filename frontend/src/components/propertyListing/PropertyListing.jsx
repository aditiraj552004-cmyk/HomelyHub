import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "../../css/PropertyListing.css";

import PropertyImg from "./PropertyImg";
import PaymentForm from "./PaymentForm";
import PropertyAmenities from "./PropertyAmenities";
import PropertMapInfo from "./PropertyMapInfo";
import LoadingSpinner from "../LoadingSpinner";

import {
  getPropertyDetails,
} from "../../store/PropertyDetails/propertyDetails-action";

import {
  propertyDetailsAction,
} from "../../store/PropertyDetails/propertyDetails-slice";

const PropertyListing = () => {
  // This value is actually your property slug
  // Example: beautiful-jaipur-villa
  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    propertyDetails,
    loading,
    error,
  } = useSelector(
    (state) => state.propertyDetails
  );

  // ======================================================
  // FETCH PROPERTY
  // ======================================================

  useEffect(() => {
    if (id) {
      dispatch(
        getPropertyDetails(id)
      );
    }

    // Clear old property when leaving page
    return () => {
      dispatch(
        propertyDetailsAction.clearPropertyDetails()
      );
    };
  }, [id, dispatch]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="row justify-content-around mt-5">
        <LoadingSpinner />
      </div>
    );
  }

  // ======================================================
  // ERROR / NOT FOUND
  // ======================================================

  if (error) {
    return (
      <p className="not_found">
        {error}
      </p>
    );
  }

  if (!propertyDetails) {
    return (
      <p className="not_found">
        Property not found
      </p>
    );
  }

  // ======================================================
  // PROPERTY DATA
  // ======================================================

  const {
    _id,
    title,
    address = {},
    description,
    images = [],
    amenities = [],
    maxGuests,
    pricePerNight,
    currentBookings = [],
  } = propertyDetails;

  // Your PropertyAmenities component may expect:
  // [{ name: "wifi", icon: "check" }]
  const formattedAmenities =
    amenities.map((name) => ({
      name,
      icon: "check",
    }));

  const formattedAddress = {
    ...address,

    // Your old components use address.area
    area: address.street,
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="property-container">

      {/* Property Name */}
      <p className="property-header">
        {title}
      </p>

      {/* Location */}
      <h6 className="property-location">
        <span className="material-symbols-outlined">
          house
        </span>

        <span className="location">
          {[
            address.street,
            address.city,
            address.state,
          ]
            .filter(Boolean)
            .join(", ")}
        </span>
      </h6>

      {/* Images */}
      <PropertyImg
        images={images}
      />

      <div className="middle-container row">

        {/* Description */}
        <div className="des-and-amenities col-md-8 col-sm-12 col-12">

          <h2 className="property-description-header">
            Description
          </h2>

          <p className="property-description">
            {description}

            <br />
            <br />

            Max number of guests:{" "}
            {maxGuests}
          </p>

          <hr />

          <PropertyAmenities
            amenities={
              formattedAmenities
            }
          />
        </div>

        {/* Payment */}
        <div className="property-payment col-md-4 col-sm-12 col-12">

          <PaymentForm
            propertyId={_id}
            price={pricePerNight}
            propertyName={title}
            address={formattedAddress}
            maximumGuest={maxGuests}
            currentBookings={
              currentBookings
            }
          />

        </div>
      </div>

      <hr />

      {/* Map */}
      <div className="property-map">

        <div className="map-image-exinfo-container row">

          <PropertMapInfo
            address={
              formattedAddress
            }
          />

        </div>

      </div>
    </div>
  );
};

export default PropertyListing;