import { authFetch } from "../../../../../api/authFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faXmark,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css";
import "swiper/css/navigation";
import "./BusinessPhotosGallery.css";
import { useRef, useState, useEffect } from "react";

function BusinessPhotosGallery({
  photoIndexForGalleryModal,
  setPhotoIndexForGalleryModal,
  photos,
  setPhotos = null,
  businessId = null,
}) {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(
    photoIndexForGalleryModal + 1
  );
  const [showMenu, setShowMenu] = useState(false);

  async function handleDelete() {
    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/photo?type=gallery&photoId=${
          photos[currentSlide - 1].id
        }`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      setPhotos((prev) =>
        prev.filter((p) => p.id !== prev[currentSlide - 1]?.id)
      );
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setPhotoIndexForGalleryModal(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setPhotoIndexForGalleryModal]);

  return (
    <div
      className="handle-photos-gallery-modal-wrapper"
      onClick={() => {
        setShowMenu(false);
      }}
    >
      <div className="handle-photos-gallery-modal">
        <div className="handle-photos-gallery-modal-menu">
          <FontAwesomeIcon
            icon={faXmark}
            style={{ cursor: "pointer", marginLeft: "3rem" }}
            onClick={() => {
              setPhotoIndexForGalleryModal(null);
            }}
          />
          <div>
            {currentSlide} of {photos.length}
          </div>
          {setPhotos != null && businessId != null ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <FontAwesomeIcon
                icon={faEllipsis}
                style={{ cursor: "pointer", marginRight: "3rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              />

              {showMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "#fff",
                    zIndex: 100,
                    minWidth: "150px",
                    marginRight: "3rem",
                    borderRadius: "6px",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: "8px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      color: "black",
                      fontSize: "16px",
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={handleDelete}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      style={{ color: "red" }}
                    />
                    Delete photo
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div />
          )}
        </div>

        <div style={{ width: "100%", height: "100%" }}>
          <Swiper
            initialSlide={photoIndexForGalleryModal}
            modules={[Navigation, Pagination, Keyboard]}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            navigation
            style={{ height: "100%", width: "100%" }}
            ref={swiperRef}
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.activeIndex + 1);
            }}
          >
            {photos.map((photo) => (
              <SwiperSlide key={photo.id}>
                <img src={photo.imageUrl} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default BusinessPhotosGallery;
