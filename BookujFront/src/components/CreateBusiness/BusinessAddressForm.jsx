import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch.js";
import { reduceImageSize } from "../../utils/imageUtils.js";
import "./BusinessDetailsForm.css";

function BusinessAddressForm({
  businessData,
  setBusinessData,
  nextStep,
  prevStep,
}) {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  async function handleBusinessSubmit(e) {
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
    <form onSubmit={handleBusinessSubmit} className="form-wrapper">
      <h1>Confirm Your Address</h1>
      <p>Where can clients find you?</p>
      <div className="input-details">
        <div className="form-group" id="form-group-address">
          <input
            type="text"
            id="address"
            name="address"
            placeholder=""
            value={businessData.address}
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
            name="city"
            placeholder=""
            value={businessData.city}
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
            name="postalCode"
            placeholder=""
            value={businessData.postalCode}
            onChange={handleChange}
            minLength={3}
            required
          />
          <label htmlFor="postalCode">Postal code</label>
        </div>
      </div>
      <div className="form-buttons">
        <button type="submit" className="manage-business-button" id="save">
          Next
        </button>
        <button
          type="button"
          className="manage-business-button-white"
          id="back"
          onClick={prevStep}
        >
          Back
        </button>
      </div>
    </form>
  );
}

export default BusinessAddressForm;
