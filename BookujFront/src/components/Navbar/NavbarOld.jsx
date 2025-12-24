import "./Navbar.css";
import { Link } from "react-router-dom";
import { getUser } from "../../api/sessionApi";

function Navbar({ isLoggedIn }) {
  return (
    <nav className="main-nav">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/users">Użytkownicy</Link>
        </li>
        <li>
          <Link to="/contact">Kontakt</Link>
        </li>
      </ul>
      <div className="nav-status-container">
        {isLoggedIn ? (
          <Link to="/profile" className="nav-status logged">
            <div className="profile-icon" />
            {getUser().firstName}
          </Link>
        ) : (
          <Link to="/login" className="nav-status not-logged">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
