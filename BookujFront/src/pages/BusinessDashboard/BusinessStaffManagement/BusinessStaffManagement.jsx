import BusinessStaff from "./BusinessStaff/BusinessStaff";
import "./BusinessStaffManagement.css";

function BusinessStaffManagement() {
  return (
    <div className="business-staff-management-wrapper">
      <div className="business-staff-management-nav">NAV</div>
      <div className="business-staff-management-content">
        <BusinessStaff />
      </div>
    </div>
  );
}

export default BusinessStaffManagement;
