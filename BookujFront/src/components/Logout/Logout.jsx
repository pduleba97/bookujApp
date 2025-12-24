import { clearSession } from "../../api/sessionApi";
import { authFetch } from "../../api/authFetch";
import "./Logout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

const Logout = () => {
  const handleLogout = async () => {
    try {
      const response = await authFetch("/users/logout", { method: "POST" });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      } else {
        console.log("Logged off successfully");
        clearSession();
        window.location.href = "/";
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="logout-wrapper" onClick={handleLogout}>
      <FontAwesomeIcon className="logout-icon" icon={faDoorOpen} />
      <div>Logout</div>
    </div>
  );
};

export default Logout;
