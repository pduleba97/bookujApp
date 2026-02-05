import { useState } from "react";
import "./BusinessDetailsForm.css";

function BusinessDescriptionForm({
  businessData,
  setBusinessData,
  nextStep,
  prevStep,
  setBusinessPicture,
}) {
  const [preview, setPreview] = useState(null);

  async function handleBusinessDetailsFromSubmit(e) {
    e.preventDefault();
    nextStep();
  }

  function handleChange(e) {
    setBusinessData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <form onSubmit={handleBusinessDetailsFromSubmit}>
      <div className="form-wrapper">
        <h1>Describe Your Business</h1>
        <p>Provide optional Business Photo and detailed description.</p>
        <div className="add-image">
          <input
            type="file"
            id="business-image"
            accept="image/*"
            style={{ display: "none" }}
            placeholder="Business Image"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              setBusinessPicture(file);

              if (file.size > 4 * 1024 * 1024) {
                alert("File is too large. Maximum size is 4MB.");
                e.target.value = null;
                setPreview(null);
                setBusinessPicture(null);
                return;
              }

              if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file!");
                e.target.value = null;
                setBusinessPicture(null);
                return;
              }

              const reader = new FileReader();
              reader.onload = (event) => {
                setPreview(event.target.result);
              };
              reader.readAsDataURL(file);
            }}
          />

          <label
            htmlFor="business-image"
            className={`upload-box ${preview ? "has-preview" : ""}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" />
                <button
                  type="button"
                  className="remove-preview"
                  onClick={(e) => {
                    e.preventDefault();
                    setPreview(null);
                    document.getElementById("businessImage").value = null;
                  }}
                >
                  ✕
                </button>
              </>
            ) : (
              <span>+</span>
            )}
          </label>
          <div className="add-image-body">
            <h3>Upload Business Picture</h3>
            <p>Image should be below 4 mb</p>
          </div>
        </div>

        <div className="input-details">
          <div className="form-group" id="form-group-description">
            <textarea
              id="business-description"
              name="description"
              placeholder=""
              value={businessData.description}
              onChange={handleChange}
            />
            <label htmlFor="business-description">Description</label>
          </div>
        </div>
      </div>
      <div className="form-buttons">
        <button
          id="business-form-next"
          type="submit"
          className="manage-business-button"
        >
          Next
        </button>
        <button
          type="button"
          className="manage-business-button-white"
          id="business-form-back"
          onClick={prevStep}
        >
          Back
        </button>
      </div>
    </form>
  );
}

export default BusinessDescriptionForm;
