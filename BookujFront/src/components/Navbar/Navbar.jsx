import "./Navbar.css";
import { Link } from "react-router-dom";
import { getUser } from "../../api/sessionApi";
import Logout from "../Logout/Logout";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBriefcase,
  faUser,
  faArrowRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

function Navbar({ isLoggedIn, userData }) {
  return (
    <nav>
      <div className="nav-status-container">
        <div>
          <Link to="/" className="home-link">
            <FontAwesomeIcon className="home-icon" icon={faHouse} />
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="login-details">
            {userData && userData.role === "Owner" && (
              <Link to="/manage-businesses" className="nav-status logged">
                <FontAwesomeIcon className="navbar-icon" icon={faBriefcase} />
                <div>Your Businesses</div>
              </Link>
            )}

            <Link to="/profile" className="nav-status logged">
              <FontAwesomeIcon className="navbar-icon" icon={faUser} />
              <div>{getUser().firstName}</div>
            </Link>
            <Logout />
          </div>
        ) : (
          <div className="login-details">
            <Link to="/login" className="nav-status not-logged">
              <FontAwesomeIcon
                className="navbar-icon"
                icon={faArrowRightToBracket}
              />
              <div>Login</div>
            </Link>
            <Link to="/register" className="nav-status not-logged">
              <FontAwesomeIcon className="navbar-icon" icon={faUserPlus} />
              <div>Register</div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
