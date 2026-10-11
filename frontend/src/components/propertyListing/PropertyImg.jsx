import React, { useState } from "react";
import Modal from "./Modal";

const PropertyImg = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const propertyImages = Array.isArray(images) ? images : [];

  if (propertyImages.length === 0) {
    return <p>No photos have been added for this property.</p>;
  }

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="property-img-container">
        {propertyImages.slice(0, 5).map((image, index) => (
          <div className={index === 0 ? "img-item" : undefined} key={image._id || image.url || index}>
            <img
              src={image.url}
              className="images"
              style={index === 0 ? {
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              } : undefined}
              alt={`property-${index + 1}`}
            />
          </div>
        ))}
        {propertyImages.length > 5 && (
          <div>
            <img
              className="images"
              src={propertyImages[5].url}
              alt="property-6"
              style={{ borderBottomRightRadius: "10px" }}
            />
            <button className="similar-photos" onClick={handleShowAllPhotos}>
              <span className="material-symbols-outlined">photo_library</span>
            </button>
          </div>
        )}
      </div>

      {isModalOpen && <Modal images={propertyImages} onClose={handleCloseModal} />}
    </>
  );
};

export default PropertyImg;
