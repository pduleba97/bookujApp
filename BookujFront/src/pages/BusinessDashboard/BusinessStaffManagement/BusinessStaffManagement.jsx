import { useState } from "react";
import BusinessStaff from "./BusinessStaff/BusinessStaff";
import "./BusinessStaffManagement.css";

function BusinessStaffManagement() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="business-staff-management-wrapper">
      <div className="business-staff-management-nav">
        <button
          className={`button-navigation ${selected === 0 ? "active" : ""}`}
          onClick={() => {
            setSelected(0);
          }}
        >
          Employees
        </button>
        <button
          className={`button-navigation ${selected === 1 ? "active" : ""}`}
          onClick={() => {
            setSelected(1);
          }}
        >
          Equipment
        </button>
      </div>
      <div className="business-staff-management-content">
        {selected === 0 && <BusinessStaff />}
        {selected === 1 && <div>Equipment</div>}
      </div>
    </div>
  );
}

export default BusinessStaffManagement;
