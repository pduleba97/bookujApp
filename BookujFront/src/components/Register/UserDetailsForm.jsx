import "./UserDetailsForm.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const UserDetailsForm = ({ nextSection, setUser, user }) => {
  const [passwordError, setPasswordError] = useState();

  function handleNext(e) {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    nextSection();
  }

  function handleOnChange(e) {
    setUser((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  }

  return (
    <div className="user-details-form-wrapper">
      <h4>Fill in user details</h4>
      <form onSubmit={handleNext}>
        <div className="form-group-wrapper">
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder=" "
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Enter a valid email address, e.g. example@example.com"
              value={user.email}
              onChange={handleOnChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder=" "
              value={user.password}
              onChange={handleOnChange}
              minLength={6}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              placeholder=" "
              value={user.confirmPassword}
              onChange={handleOnChange}
              minLength={6}
              required
            />
            <label htmlFor="confirmPassword">Confirm password</label>
            {passwordError && (
              <span style={{ color: "red" }} className="error">
                {passwordError}
              </span>
            )}
          </div>
        </div>
        <button type="submit">Next</button>
        <div className="already-registered-wrapper">
          <p>Already have an account?</p>
          <Link to="/login" style={{ textDecoration: "underline" }}>
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsForm;
