import "./HandlePhotoModal.css";
import { authFetch } from "../../../../../api/authFetch";

function HandlePhotoModal({
  openFilePicker,
  setShowModal,
  selectedPhoto,
  setSelectedPhoto,
  businessId,
  setImagePreview,
  employeeId = null,
}) {
  async function handleRemovePhoto() {
    if (!selectedPhoto) return;

    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/${
          selectedPhoto == "employeeAvatar"
            ? `employees/${employeeId}/avatar`
            : `photo?type=${selectedPhoto}`
        }`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      setImagePreview(null);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className="handle-photo-modal-wrapper">
      <div className="handle-photo-modal">
        <button
          className="button-bookuj button-upload"
          onClick={() => {
            openFilePicker();
            setShowModal(false);
          }}
        >
          UPLOAD NEW IMAGE
        </button>
        <button
          className="button-bookuj button-delete"
          onClick={async () => {
            await handleRemovePhoto();
            if (setSelectedPhoto) setSelectedPhoto(null);
            setShowModal(false);
          }}
        >
          DELETE IMAGE
        </button>
        <button
          className="button-bookuj button-cancel"
          onClick={() => {
            setShowModal(false);
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}

export default HandlePhotoModal;
