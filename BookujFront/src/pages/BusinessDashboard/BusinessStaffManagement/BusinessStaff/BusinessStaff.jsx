import { faBars, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./BusinessStaff.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  faCalendarDays,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { Link, useParams } from "react-router-dom";
import { authFetch } from "../../../../api/authFetch";

function BusinessStaff() {
  const { businessId } = useParams();
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [filteredName, setFilteredName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await authFetch(
          `/businesses/me/${businessId}/employees`,
          {
            method: "GET",
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setStaffList(data);
        setFilteredStaffList(data);
        setSelectedEmployee(data[0]);
        console.log(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    const adjustedFilteredName = filteredName.toLowerCase();

    setFilteredStaffList(
      staffList.filter(
        (staff) =>
          (staff.firstName + " " + staff.lastName)
            .toLowerCase()
            .includes(adjustedFilteredName) ||
          (staff.lastName + " " + staff.firstName)
            .toLowerCase()
            .includes(adjustedFilteredName)
      )
    );
  }, [filteredName, staffList]);

  return (
    <div className="business-staff-wrapper">
      <div className="business-staff-content">
        <div className="business-staff-content-staff">
          <div className="form-group">
            <input
              id="searchStaff"
              type="text"
              placeholder=""
              value={filteredName}
              onChange={(e) => {
                setFilteredName(e.target.value);
              }}
            />
            <label htmlFor="searchStaff">Search for staff</label>
          </div>
          <div className="business-staff-content-staff-list">
            {filteredStaffList?.map((staff, idx) => (
              <div key={staff.id}>
                <div
                  className={`business-staff-content-staff-list-single ${
                    selectedEmployee.id == staff.id && "active"
                  }`}
                  onClick={() => {
                    setSelectedEmployee(staff);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBars}
                    className="business-staff-content-staff-list-single-icon"
                  />
                  {staff.imageUrl ? (
                    <img
                      src={staff.imageUrl}
                      className="business-staff-content-staff-list-avatar"
                    />
                  ) : (
                    <div className="business-staff-content-staff-list-avatar-placeholder">
                      {staff.firstName?.slice(0, 1) +
                        staff.lastName?.slice(0, 1)}
                    </div>
                  )}
                  {staff.firstName + " " + staff.lastName}
                </div>
                <hr className="divider" />
              </div>
            ))}
          </div>

          <Link
            to={`/manage-businesses/business/${businessId}/staff/add`}
            className="business-staff-content-staff-add-staff"
          >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: "24px" }} />
          </Link>
        </div>
        <div className="business-staff-content-details">
          <div className="business-staff-content-details-header">
            <div className="business-staff-content-details-header-info">
              <Link
                to={`/manage-businesses/business/${businessId}/staff/edit/${selectedEmployee?.id}`}
                className="business-staff-content-details-header-edit"
              >
                <FontAwesomeIcon icon={faPencil} style={{ fontSize: "28px" }} />
              </Link>
              <div className="business-staff-content-details-header-info-main">
                {selectedEmployee?.imageUrl ? (
                  <img
                    src={selectedEmployee.imageUrl}
                    className="business-staff-content-details-header-info-avatar"
                  />
                ) : (
                  <div className="business-staff-content-details-header-info-avatar-placeholder">
                    {selectedEmployee?.firstName?.slice(0, 1) +
                      selectedEmployee?.lastName?.slice(0, 1)}
                  </div>
                )}
                <h3>
                  {selectedEmployee?.firstName +
                    " " +
                    selectedEmployee?.lastName}
                </h3>
                <div className="business-staff-content-details-header-info-main-bottom">
                  {selectedEmployee?.phoneNumber && (
                    <span>{"Tel: " + selectedEmployee.phoneNumber}</span>
                  )}
                  <span className="business-staff-content-details-header-info-main-bottom-role-badge">
                    {selectedEmployee?.role}
                  </span>
                  <span>{selectedEmployee?.email}</span>
                </div>
              </div>
              <div className="business-staff-content-details-header-calendar-button">
                <p>Show Calendar</p>
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
            </div>
          </div>
          <div className="business-staff-content-details-body">
            <div className="business-staff-content-details-body-nav">
              <div style={{ borderBottom: "2px solid black" }}>Services</div>
              <div>Working hours</div>
            </div>
            <div className="business-staff-content-details-body-search-service form-group">
              <label htmlFor="searchServices">Search for a service</label>
              <input id="searchServices" type="text" />
            </div>
            <div>
              {selectedEmployee.employeeServices?.map((service) => (
                <div
                  className="business-staff-form-services-body-service-group"
                  key={service.id}
                >
                  <div className="business-staff-form-services-body-service-group-name">
                    <span>{service.name}</span>
                  </div>
                  <div className="business-staff-form-services-body-service-group-duration-price">
                    <span style={{ opacity: "50%", fontSize: "18px" }}>
                      {service.durationMinutes + "min"}
                    </span>
                    <span>{service.price.toFixed(2) + " zł"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessStaff;
