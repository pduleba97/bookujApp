import "./DashboardSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faGear,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

function DashboardSidebar() {
  const { businessId } = useParams();

  return (
    <div className="dashboard-sidebar">
      <NavLink
        to={`/manage-businesses/business/${businessId}/calendar/`}
        className="sidebar-link"
      >
        <FontAwesomeIcon
          className="dashboard-sidebar-icon"
          icon={faCalendarDays}
        />
        <span className="tooltip">Calendar</span>
      </NavLink>

      <NavLink
        to={`/manage-businesses/business/${businessId}/staff/`}
        className="sidebar-link"
      >
        <FontAwesomeIcon
          className="dashboard-sidebar-icon"
          icon={faPeopleGroup}
        />
        <span className="tooltip">Staff</span>
      </NavLink>

      <NavLink
        to={`/manage-businesses/business/${businessId}/settings/`}
        className="sidebar-link"
      >
        <FontAwesomeIcon className="dashboard-sidebar-icon" icon={faGear} />
        <span className="tooltip">Settings</span>
      </NavLink>
    </div>
  );
}

export default DashboardSidebar;
