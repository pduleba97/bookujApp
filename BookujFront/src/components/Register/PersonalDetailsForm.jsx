import "./UserDetailsForm.css";
import { Link } from "react-router-dom";

const PersonalDetailsForm = ({ nextSection, prevSection, setUser, user }) => {
  function handleNext(e) {
    e.preventDefault();
    nextSection();
  }

  function handlePrevious(e) {
    e.preventDefault();
    prevSection();
  }

  function handleOnChange(e) {
    setUser((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  }

  return (
    <div className="user-details-form-wrapper">
      <h4>Fill in personal details</h4>
      <form onSubmit={handleNext}>
        <div className="form-group-wrapper">
          <div className="form-group">
            <input
              type="text"
              id="firstName"
              pattern="^[A-Za-zÀ-ÖØ-öø-ÿĄąĆćĘęŁłŃńÓóŚśŹźŻż \-]+$"
              title="Enter a valid first name, e.g. John"
              placeholder=" "
              value={user.firstName}
              onChange={handleOnChange}
              required
            />
            <label htmlFor="firstName">First name</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="lastName"
              pattern="^[A-Za-zÀ-ÖØ-öø-ÿĄąĆćĘęŁłŃńÓóŚśŹźŻż \-]+$"
              title="Enter a valid last name, e.g. Doe"
              placeholder=" "
              value={user.lastName}
              onChange={handleOnChange}
              required
            />
            <label htmlFor="lastName">Last name</label>
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="phoneNumber"
              pattern="^\+?\d{7,14}$"
              title="Phone number must be 7 to 14 digits, can start with +"
              placeholder=" "
              value={user.phoneNumber}
              onChange={handleOnChange}
              required
            />
            <label htmlFor="phoneNumber">Phone</label>
          </div>
        </div>
        <div className="register-form-button-wrapper">
          <button
            type="button"
            className="button-bookuj"
            onClick={handlePrevious}
          >
            Back
          </button>
          <button id="register-submit" className="button-bookuj" type="submit">
            Next
          </button>
        </div>
      </form>
      <div className="already-registered-wrapper">
        <p>Already have an account?</p>
        <Link to="/login" style={{ textDecoration: "underline" }}>
          Log in
        </Link>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
