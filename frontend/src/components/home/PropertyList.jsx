import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import gsap from "gsap";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import "../../css/Home.css";

import {
  propertyActions,
} from "../../store/Property/property-slice";

import {
  getAllProperties,
} from "../../store/Property/property-action";

// ======================================================
// PROPERTY CARD
// ======================================================

const Card = ({
  id,
  slug,
  image,
  name,
  address,
  price,
}) => {
  return (
    <figure className="property">
      <Link
        to={`/propertylist/${slug || id}`}
      >
        <img
          src={
            image ||
            "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={name || "Property"}
        />
      </Link>

      <h4>{name}</h4>

      <figcaption>
        <main className="propertydetails">
          <h5>{name}</h5>

          <h6>
            <span className="material-symbols-outlined houseicon">
              home_pin
            </span>

            {address}
          </h6>

          <p>
            <span className="price">
              ₹{price}
            </span>{" "}
            per night
          </p>
        </main>
      </figcaption>
    </figure>
  );
};

// ======================================================
// PROPERTY LIST
// ======================================================

const PropertyList = () => {
  const dispatch = useDispatch();

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const propertyListRef =
    useRef(null);

  const {
    properties,
    totalProperties,
    loading,
    error,
  } = useSelector(
    (state) => state.properties
  );

  // 4 properties per page
  const propertiesPerPage = 4;

  // Total number of pages
  const lastPage = Math.ceil(
    totalProperties /
      propertiesPerPage
  );

  // ====================================================
  // FETCH PROPERTIES
  // ====================================================

  useEffect(() => {
    // Update page and limit in Redux
    dispatch(
      propertyActions.updateSearchParams({
        page: currentPage,
        limit: propertiesPerPage,
      })
    );

    // Fetch properties
    dispatch(
      getAllProperties()
    );
  }, [
    currentPage,
    dispatch,
  ]);

  // ====================================================
  // GSAP ANIMATION
  // ====================================================

  useEffect(() => {
    if (
      propertyListRef.current &&
      properties.length > 0
    ) {
      gsap.fromTo(
        propertyListRef.current
          .children,

        {
          y: 50,
          opacity: 0,
        },

        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [properties]);

  // ====================================================
  // PREVIOUS PAGE
  // ====================================================

  const handlePreviousPage = () => {
    setCurrentPage(
      (prev) =>
        Math.max(prev - 1, 1)
    );
  };

  // ====================================================
  // NEXT PAGE
  // ====================================================

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(
        (prev) => prev + 1
      );
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <p className="loading">
        Loading properties...
      </p>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <p className="not_found">
        {error}
      </p>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <>
      {/* =========================
          PROPERTY LIST
      ========================= */}

      {properties.length === 0 ? (
        <p className="not_found">
          No properties have been
          listed yet.
        </p>
      ) : (
        <div
          className="propertylist"
          ref={propertyListRef}
        >
          {properties.map(
            (property) => {
              // Build address safely
              const addressParts = [
                property.address?.city,
                property.address
                  ?.state,
                property.address
                  ?.pincode,
              ].filter(Boolean);

              return (
                <Card
                  key={
                    property._id
                  }

                  id={
                    property._id
                  }

                  slug={
                    property.slug
                  }

                  image={
                    property
                      .images?.[0]?.url
                  }

                  name={
                    property.title
                  }

                  address={
                    addressParts.join(
                      ", "
                    )
                  }

                  price={
                    property
                      .pricePerNight
                  }
                />
              );
            }
          )}
        </div>
      )}

      {/* =========================
          PAGINATION
      ========================= */}

      {properties.length > 0 && (
        <div className="pagination">

          {/* Previous */}
          <button
            className="previous_btn"

            onClick={
              handlePreviousPage
            }

            disabled={
              currentPage === 1
            }
          >
            <span className="material-symbols-outlined">
              arrow_back_ios_new
            </span>
          </button>

          {/* Page Info */}
          <span className="page_info">
            Page {currentPage}

            {lastPage > 0 &&
              ` of ${lastPage}`}
          </span>

          {/* Next */}
          <button
            className="next_btn"

            onClick={
              handleNextPage
            }

            disabled={
              lastPage === 0 ||
              currentPage >= lastPage
            }
          >
            <span className="material-symbols-outlined">
              arrow_forward_ios
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default PropertyList;