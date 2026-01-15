import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import { reduceImageSize } from "../../utils/imageUtils.js";

function BusinessDetailsForm({ businessData, setBusinessData }) {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  async function handleBusinessSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    for (const key in businessData) {
      if (businessData[key] !== "") {
        formData.append(key, businessData[key]);
      }
    }
    const fileInput = document.getElementById("businessImage");
    if (fileInput.files.length > 0) {
      const reducedFile = await reduceImageSize(
        fileInput.files[0],
        2000,
        2000,
        true
      );

      formData.append("file", reducedFile);
    }

    try {
      const response = await authFetch("/businesses/me/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      console.log("Successfully added new business");
      console.log(data);
      navigate("/manage-businesses");
    } catch (err) {
      console.log("Fail");
      console.warn(err.message);
    }
  }

  function handleChange(e) {
    setBusinessData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <form action="" onSubmit={handleBusinessSubmit}>
      <div className="add-image">
        <input
          type="file"
          id="businessImage"
          accept="image/*"
          style={{ display: "none" }}
          placeholder="Business Image"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 4 * 1024 * 1024) {
              alert("File is too large. Maximum size is 4MB.");
              e.target.value = null;
              setPreview(null);
              return;
            }

            if (!file.type.startsWith("image/")) {
              alert("Please select a valid image file!");
              e.target.value = null;
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
          htmlFor="businessImage"
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
        <div className="form-group" id="form-group-name">
          <input
            type="text"
            id="name"
            name="Name"
            placeholder=""
            value={businessData.Name}
            onChange={handleChange}
            minLength={3}
            required
          />
          <label htmlFor="name">Business name</label>
        </div>
        <div
          className={`form-group ${businessData.Category ? "has-value" : ""}`}
          id="form-group-category"
        >
          <select
            id="category"
            name="Category"
            value={businessData.Category}
            onChange={handleChange}
            required
          >
            <option value={null}></option>
            <option value="Barber shop">Barber shop</option>
            <option value="Hair Salon">Hair Salon</option>
            <option value="Beauty Salon">Beauty Salon</option>
            <option value="Nail Salon">Nail Salon</option>
            <option value="Spa">Spa</option>
          </select>
          <label htmlFor="category">Category</label>
        </div>
        <div className="form-group" id="form-group-email">
          <input
            type="email"
            id="email"
            name="Email"
            placeholder=""
            value={businessData.Email}
            onChange={handleChange}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="form-group" id="form-group-phoneNumber">
          <input
            type="tel"
            id="phoneNumber"
            name="PhoneNumber"
            placeholder=""
            value={businessData.PhoneNumber}
            onChange={handleChange}
            pattern="^\+?\d{7,14}$"
            title="Phone number must be 7 to 14 digits, can start with +"
            required
          />
          <label htmlFor="phoneNumber">Phone number</label>
        </div>
        <div className="form-group" id="form-group-address">
          <input
            type="text"
            id="address"
            name="Address"
            placeholder=""
            value={businessData.Address}
            onChange={handleChange}
            minLength={3}
            required
          />
          <label htmlFor="address">Address</label>
        </div>
        <div className="form-group" id="form-group-city">
          <input
            type="text"
            id="city"
            name="City"
            placeholder=""
            value={businessData.City}
            onChange={handleChange}
            minLength={3}
            required
          />
          <label htmlFor="city">City</label>
        </div>
        <div className="form-group" id="form-group-postalCode">
          <input
            type="text"
            id="postalCode"
            name="PostalCode"
            placeholder=""
            value={businessData.PostalCode}
            onChange={handleChange}
            minLength={3}
            required
          />
          <label htmlFor="postalCode">Postal code</label>
        </div>
        <div className="form-group" id="form-group-description">
          <textarea
            id="description"
            name="Description"
            placeholder=""
            value={businessData.Description}
            onChange={handleChange}
          />
          <label htmlFor="description">Description</label>
        </div>
      </div>
      <div className="form-buttons">
        <div className="form-buttons-flex">
          <Link
            to="/manage-businesses"
            className="manage-business-button-white"
          >
            Cancel
          </Link>
          <button type="submit" className="manage-business-button" id="save">
            Next
          </button>
        </div>
      </div>
    </form>
  );
}

export default BusinessDetailsForm;
