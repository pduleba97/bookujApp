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
import BusinessStaffServicesList from "./BusinessStaffServicesList/BusinessStaffServicesList";
import BusinessEmployeesDnd from "./BusinessEmployeesDnD";
import BusinessStaffWeeklySchedule from "./BusinessStaffWeeklySchedule/BusinessStaffWeeklySchedule";

function BusinessStaff() {
  const { businessId } = useParams();
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [staffList, setStaffList] = useState([]);
  const [filteredName, setFilteredName] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedEmployeeGroupedServices, setSelectedEmployeeGroupedServices] =
    useState([]);
  const [selectedEmployeeWeeklySchedules, setSelectedEmployeeWeeklySchedules] =
    useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await authFetch(
          `/businesses/me/${businessId}/employees`,
          {
            method: "GET",
          },
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setStaffList(data);
        if (data.length > 0) {
          setSelectedEmployee(data[0]);
          fetchEmployeeServicesGroupedByCategory(data[0].id);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  async function fetchEmployeeServicesGroupedByCategory(employeeId) {
    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/employees/${employeeId}/services-grouped`,
        {
          method: "GET",
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSelectedEmployeeGroupedServices(data);
    } catch (err) {
      console.warn(err);
    }
  }

  const adjustedFilteredName = filteredName.toLowerCase();

  const filteredStaffList = staffList.filter(
    (staff) =>
      (staff.firstName + " " + staff.lastName)
        .toLowerCase()
        .includes(adjustedFilteredName) ||
      (staff.lastName + " " + staff.firstName)
        .toLowerCase()
        .includes(adjustedFilteredName),
  );

  const filteredGroupedEmployeeServicesList = selectedEmployeeGroupedServices
    ?.map((gs) => ({
      ...gs,
      services: gs.services.filter((es) =>
        es.name.toLowerCase().includes(serviceFilter.toLowerCase()),
      ),
    }))
    .filter((gs) => gs.services.length > 0);

  useEffect(() => {
    console.log(filteredGroupedEmployeeServicesList);
  }, [serviceFilter]);

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
            <BusinessEmployeesDnd
              filteredStaffList={filteredStaffList}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              setStaffList={setStaffList}
              setServiceFilter={setServiceFilter}
              fetchEmployeeServicesGroupedByCategory={
                fetchEmployeeServicesGroupedByCategory
              }
            />
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
              {selectedEmployee?.id && (
                <Link
                  to={`/manage-businesses/business/${businessId}/staff/edit/${selectedEmployee.id}`}
                  className="business-staff-content-details-header-edit"
                >
                  <FontAwesomeIcon
                    icon={faPencil}
                    style={{ fontSize: "26px" }}
                  />
                </Link>
              )}
              <div className="business-staff-content-details-header-info-main">
                {selectedEmployee?.imageUrl ? (
                  <img
                    src={selectedEmployee.imageUrl}
                    className="business-staff-content-details-header-info-avatar"
                  />
                ) : (
                  <div className="business-staff-content-details-header-info-avatar-placeholder">
                    {(selectedEmployee?.firstName?.[0] || "") +
                      (selectedEmployee?.lastName?.[0] || "")}
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
              <button
                className={`button-navigation ${
                  selectedTab === 0 ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedTab(0);
                }}
              >
                Services ({selectedEmployee?.employeeServices?.length ?? 0})
              </button>
              <button
                className={`button-navigation ${
                  selectedTab === 1 ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedTab(1);
                }}
              >
                Working hours
              </button>
            </div>
            {selectedTab === 0 && (
              <BusinessStaffServicesList
                filteredGroupedEmployeeServicesList={
                  filteredGroupedEmployeeServicesList
                }
                serviceFilter={serviceFilter}
                setServiceFilter={setServiceFilter}
              />
            )}

            {selectedTab === 1 && (
              <BusinessStaffWeeklySchedule
                businessId={businessId}
                employeeId={selectedEmployee.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessStaff;
