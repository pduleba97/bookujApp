import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCameraRetro,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./BusinessPhotos.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { authFetch } from "../../../../../api/authFetch";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../../../../utils/imageUtils";
import HandlePhotoModal from "./HandlePhotoModal";
import BusinessPhotosGallery from "./BusinessPhotosGallery";

function BusinessPhotos() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState();
  const [profilePicturePreview, setProfilePicturePreview] = useState();
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [currentImageFile, setCurrentImageFile] = useState();
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeInputRef, setActiveInputRef] = useState(null);
  const logoInputRef = useRef(null);
  const profilePictureInputRef = useRef(null);
  const [photoIndexForGalleryModal, setPhotoIndexForGalleryModal] =
    useState(null);
  const [selectedImagePreviewSetter, setSelectedImagePreviewSetter] =
    useState(null);

  //Cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppingFile, setCroppingFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(3 / 2);
  const [cropShape, setCropShape] = useState("rect");
  const [currentCropType, setCurrentCropType] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await authFetch(`/businesses/me/${businessId}`, {
          method: "GET",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }
        setLogoPreview(data.logoUrl);
        setProfilePicturePreview(data.profilePictureUrl);
        setGalleryPreview(data.businessPhotos);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (croppingFile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [croppingFile]);

  async function addCroppedImage() {
    try {
      const croppedImageBlob = await getCroppedImg(
        currentImageFile,
        croppedAreaPixels
      );

      const form = new FormData();
      form.append(currentCropType, croppedImageBlob);

      const response = await authFetch(`/businesses/me/${businessId}/photo`, {
        method: "PATCH",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (currentCropType === "profilePictureFile") {
        setProfilePicturePreview(data.profilePictureUrl);
      }
      if (currentCropType === "logoFile") {
        setLogoPreview(data.logoUrl);
      }
      if (currentCropType === "galleryFile") {
        setGalleryPreview(data.businessPhotos);
      }
      setCroppingFile(null);
      setCurrentCropType(null); //default
      setAspectRatio(3 / 2); //default
    } catch (e) {
      console.warn(e);
    }
  }

  const handleFileInput = (e, cropType, aspectRatioValue, cropShapeValue) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("File is too large. Maximum size is 4MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file!");
      return;
    }
    setCurrentImageFile(file);
    setAspectRatio(aspectRatioValue);
    setCropShape(cropShapeValue);
    setCurrentCropType(cropType);
    setCroppingFile(URL.createObjectURL(file));
    e.target.value = null;
  };

  return (
    <div className="business-settings-details-photos-card">
      <div className="business-settings-details-photos-header">
        <div className="business-settings-details-photos-header-back">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <h1>Business photos</h1>
        </div>
      </div>
      <div className="dashboard-settings-details-photos-body-logo-profile-gallery-wrapper">
        <div className="dashboard-settings-details-photos-body-logo-profile-wrapper">
          <div className="dashboard-settings-details-photos-body-content-logo">
            <div className="dashboard-settings-details-photos-body-content-header">
              <h4>Logo</h4>
              <p>
                Upload your business logo so it's visible on your Bookuj
                Profile.
              </p>
            </div>

            <input
              id="logoImage"
              type="file"
              ref={logoInputRef}
              onChange={async (e) => {
                handleFileInput(e, "logoFile", 1 / 1, "round");
              }}
              accept="image/*"
              style={{ display: "none" }}
            />

            {logoPreview ? (
              <img
                src={logoPreview}
                alt=""
                className="dashboard-settings-details-photos-body-content-logo-body"
                onClick={() => {
                  setActiveInputRef(logoInputRef);
                  setSelectedPhoto("logo");
                  setSelectedImagePreviewSetter(() => setLogoPreview);
                  setShowModal(true);
                }}
              />
            ) : (
              <label
                htmlFor="logoImage"
                className="dashboard-settings-details-photos-body-content-logo-body"
              >
                <FontAwesomeIcon className="camera-icon" icon={faCameraRetro} />
                <p>Add Logo</p>
              </label>
            )}
          </div>

          <div className="dashboard-settings-details-photos-body-content-profilePicture">
            <div className="dashboard-settings-details-photos-body-content-header">
              <h4>Profile Picture</h4>
              <p>
                Your cover photo is the first thing that your customers see on
                your Bookuj Profile. Add a photo to give them insight into what
                you’re all about.
              </p>
            </div>

            <input
              id="profile-picture-image"
              type="file"
              ref={profilePictureInputRef}
              onChange={async (e) => {
                handleFileInput(e, "profilePictureFile", 3 / 2, "rect");
              }}
              accept="image/*"
              style={{ display: "none" }}
            />

            {profilePicturePreview ? (
              <img
                src={profilePicturePreview}
                alt=""
                className="dashboard-settings-details-photos-body-content-profilePicture-body"
                onClick={() => {
                  setSelectedPhoto("profilePicture");
                  setSelectedImagePreviewSetter(() => setProfilePicturePreview);
                  setActiveInputRef(profilePictureInputRef);
                  setShowModal(true);
                }}
              />
            ) : (
              <label
                htmlFor="profile-picture-image"
                className="dashboard-settings-details-photos-body-content-profilePicture-body"
              >
                <FontAwesomeIcon className="camera-icon" icon={faCameraRetro} />
                <p>Add Media</p>
              </label>
            )}
          </div>
        </div>

        <div className="dashboard-settings-details-photos-body-content-photos">
          <div className="dashboard-settings-details-photos-body-content-header">
            <h4>Workplace photos</h4>
            <p>
              Give clients a sneak peek of your space before they even walk
              through the door.
            </p>
          </div>
          <div className="dashboard-settings-details-photos-body-content-photos-body">
            <input
              id="gallery-image"
              type="file"
              onChange={async (e) => {
                handleFileInput(e, "galleryFile", 1 / 1, "rect");
              }}
              accept="image/*"
              style={{ display: "none" }}
            />
            <label
              htmlFor="gallery-image"
              className="dashboard-settings-details-photos-body-content-photos-body-add"
            >
              <FontAwesomeIcon className="camera-icon" icon={faCameraRetro} />
              <p>Add media</p>
            </label>

            {galleryPreview.map((photo, index) => (
              <img
                key={photo.id}
                src={photo.imageUrl}
                onClick={() => {
                  setPhotoIndexForGalleryModal(index);
                }}
                className="dashboard-settings-details-photos-body-content-photos-body-image"
              />
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <HandlePhotoModal
          openFilePicker={() => activeInputRef.current?.click()}
          setShowModal={setShowModal}
          selectedPhoto={selectedPhoto}
          setSelectedPhoto={setSelectedPhoto}
          businessId={businessId}
          setImagePreview={selectedImagePreviewSetter}
        />
      )}

      {photoIndexForGalleryModal != null && (
        <BusinessPhotosGallery
          photoIndexForGalleryModal={photoIndexForGalleryModal}
          setPhotoIndexForGalleryModal={setPhotoIndexForGalleryModal}
          photos={galleryPreview}
          setPhotos={setGalleryPreview}
          businessId={businessId}
        />
      )}

      {croppingFile && (
        <div className="crop-container-overlay">
          <div>
            <div className="crop-container-overlay-back">
              <FontAwesomeIcon
                icon={faXmark}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCroppingFile(null);
                  setCurrentCropType(null);
                  setAspectRatio(3 / 2);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCropShape("rect");
                  setCroppedAreaPixels(null);
                }}
              />
              <p>Adjust</p>
            </div>
            <Cropper
              image={croppingFile}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              cropShape={cropShape}
              onCropComplete={(croppedArea, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
            />
            <button
              className="crop-container-overlay-add-button"
              onClick={addCroppedImage}
            >
              ADD
            </button>
            <p className="crop-container-overlay-info">
              Adjust the size of the grid to crop your image. You can also drag
              your photo to reposition it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessPhotos;
