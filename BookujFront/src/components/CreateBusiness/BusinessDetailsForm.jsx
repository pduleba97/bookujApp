import { useState } from "react";
import { Link } from "react-router-dom";
import "./BusinessDetailsForm.css";

function BusinessDetailsForm({
  businessData,
  setBusinessData,
  nextStep,
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
        <h1>About You</h1>
        <p>Tell us more about your business.</p>

        <div className="input-details">
          <div className="form-group" id="form-group-name">
            <input
              type="text"
              id="name"
              name="name"
              placeholder=""
              value={businessData.name}
              onChange={handleChange}
              minLength={3}
              required
            />
            <label htmlFor="name">Business name</label>
          </div>
          <div
            className={`form-group ${businessData.category ? "has-value" : ""}`}
            id="form-group-category"
          >
            <select
              id="category"
              name="category"
              value={businessData.category}
              onChange={handleChange}
              required
            >
              <option value={null}></option>
              <option value="Barbershop">Barbershop</option>
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
              name="email"
              placeholder=""
              value={businessData.email}
              onChange={handleChange}
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group" id="form-group-phoneNumber">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder=""
              value={businessData.phoneNumber}
              onChange={handleChange}
              pattern="^\+?\d{7,14}$"
              title="Phone number must be 7 to 14 digits, can start with +"
              required
            />
            <label htmlFor="phoneNumber">Phone number</label>
          </div>
        </div>
      </div>
      <div className="form-buttons">
        <button type="submit" className="manage-business-button" id="next">
          Next
        </button>
        <Link to="/manage-businesses" className="manage-business-button-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default BusinessDetailsForm;
