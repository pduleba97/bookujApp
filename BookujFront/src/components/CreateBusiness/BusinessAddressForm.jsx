import "./BusinessDetailsForm.css";

function BusinessAddressForm({
  businessData,
  setBusinessData,
  nextStep,
  prevStep,
}) {
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
            id="business-address"
            name="address"
            placeholder=""
            value={businessData.address}
            onChange={handleChange}
            minLength={3}
            required
          />
          <label htmlFor="business-address">Address</label>
        </div>
        <div className="form-group" id="form-group-city">
          <input
            type="text"
            id="business-city"
            name="city"
            placeholder=""
            value={businessData.city}
            onChange={handleChange}
            minLength={3}
            required
          />
          <label htmlFor="business-city">City</label>
        </div>
        <div className="form-group" id="form-group-postalCode">
          <input
            type="text"
            id="business-postalCode"
            name="postalCode"
            placeholder=""
            value={businessData.postalCode}
            onChange={handleChange}
            minLength={3}
            required
          />
          <label htmlFor="business-postalCode">Postal code</label>
        </div>
      </div>
      <div className="form-buttons">
        <button
          type="submit"
          className="manage-business-button"
          id="business-form-next"
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

export default BusinessAddressForm;
