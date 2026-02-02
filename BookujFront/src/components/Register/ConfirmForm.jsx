import "./UserDetailsForm.css";
import { authFetch } from "../../api/authFetch";
import { Link } from "react-router-dom";

function ConfirmForm({ nextSection, prevSection, user }) {
  async function handleNext(e) {
    e.preventDefault();

    try {
      const response = await authFetch("/users/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          phoneNumber: user.phoneNumber,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      nextSection();
    } catch (err) {
      alert(err);
    }
  }

  function handlePrevious(e) {
    e.preventDefault();
    prevSection();
  }

  return (
    <div className="user-details-form-wrapper">
      <h4>Review your details</h4>
      <div className="user-summary">
        <div className="summary-item">
          <span className="label">First name</span>
          <span id="register-value-firstName" className="value">
            {user.firstName}
          </span>
        </div>

        <div className="summary-item">
          <span className="label">Last name</span>
          <span id="register-value-lastName" className="value">
            {user.lastName}
          </span>
        </div>

        <div className="summary-item">
          <span className="label">Email</span>
          <span id="register-value-email" className="value">
            {user.email}
          </span>
        </div>

        <div className="summary-item">
          <span className="label">Phone number</span>
          <span id="register-value-phoneNumber" className="value">
            {user.phoneNumber}
          </span>
        </div>
      </div>

      <form
        className="personal-details-form-button-wrapper"
        onSubmit={handleNext}
      >
        <button id="register-back" type="button" onClick={handlePrevious}>
          Back
        </button>
        <button id="register-submit" type="submit">
          Continue
        </button>
      </form>
      <div className="already-registered-wrapper">
        <p>Already have an account?</p>
        <Link to="/login" style={{ textDecoration: "underline" }}>
          Log in
        </Link>
      </div>
    </div>
  );
}

export default ConfirmForm;
