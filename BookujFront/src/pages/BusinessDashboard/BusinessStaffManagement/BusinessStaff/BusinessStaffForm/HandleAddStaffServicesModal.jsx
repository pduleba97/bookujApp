import "./HandleAddStaffServicesModal.css";
import { authFetch } from "../../../../../api/authFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function HandleAddStaffServicesModal({
  name = "",
  setShowAddServicesModal,
  businessId,
  employeeServices,
  setFormData,
}) {
  const [servicesList, setServicesList] = useState([]);
  const [filteredServicesList, setFilteredServicesList] = useState([]);
  const [serviceFilter, setServiceFilter] = useState("");
  const allSelected = servicesList.every((s) => s.selected);

  useEffect(() => {
    (async () => {
      try {
        const response = await authFetch(
          `/businesses/me/${businessId}/services`,
          { method: "GET" },
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        const servicesWithSelection = data.map((service) => {
          var isSelected =
            employeeServices?.some(
              (employeeService) => employeeService.serviceId === service.id,
            ) ?? false;

          return { ...service, selected: isSelected };
        });

        setServicesList(servicesWithSelection);
        setFilteredServicesList(servicesWithSelection);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    const newFilteredServices = servicesList.filter((service) => {
      return service.name.toLowerCase().includes(serviceFilter.toLowerCase());
    });

    setFilteredServicesList(newFilteredServices);
  }, [servicesList, serviceFilter]);

  async function handleAssignServices() {
    setFormData((prev) => {
      const newServices = servicesList
        .filter((s) => s.selected)
        .map(({ id, ...rest }) => ({ serviceId: id, ...rest }));
      return { ...prev, employeeServices: newServices };
    });
    setShowAddServicesModal(false);
  }

  return (
    <div className="handle-staff-services-modal-wrapper">
      <div className="handle-staff-services-modal">
        <div className="handle-staff-services-modal-description">
          <div className="handle-staff-services-modal-header">
            <FontAwesomeIcon
              icon={faX}
              className="handle-staff-services-modal-card-header-close"
              onClick={() => {
                setShowAddServicesModal(false);
              }}
            />
            <h1>{name} • Services</h1>
          </div>
          <p>
            Here you can assign the services this employee will perform.
            Selected services will determine what clients can book with this
            employee and help keep your business schedule clear and well
            organized.
          </p>
        </div>
        <div className="handle-staff-services-modal-searchbar">
          <div className="form-group">
            <input
              id="services-modal-searchbar"
              value={serviceFilter}
              type="text"
              placeholder=""
              onChange={(e) => {
                setServiceFilter(e.target.value);
              }}
            />
            {/* implement filter here */}
            <label htmlFor="services-modal-searchbar">
              Search for a service
            </label>
          </div>
        </div>
        <div className="handle-staff-services-modal-body">
          <div className="handle-staff-services-modal-body-categories">
            <div className="handle-staff-services-modal-body-categories-header">
              <h2>Categories</h2>
              <div className="handle-staff-services-modal-body-categories-body">
                <span>All services</span>
              </div>
            </div>
          </div>
          <div className="handle-staff-services-modal-body-services">
            <div className="handle-staff-services-modal-body-services-header">
              <h2>All services</h2>
            </div>
            <div className="handle-staff-services-modal-body-services-body">
              <div className="handle-staff-services-modal-body-services-body-service-group">
                <div className="handle-staff-services-modal-body-services-body-service-group-checkbox-name">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() =>
                      setServicesList((prev) =>
                        prev.map((s) => ({ ...s, selected: !allSelected })),
                      )
                    }
                  />
                  <span>Select all</span>
                </div>
              </div>
              {filteredServicesList.map((service) => (
                <div
                  className="handle-staff-services-modal-body-services-body-service-group"
                  key={service.id}
                >
                  <div className="handle-staff-services-modal-body-services-body-service-group-checkbox-name">
                    <input
                      type="checkbox"
                      checked={service.selected}
                      onChange={(e) =>
                        setServicesList((prev) =>
                          prev.map((s) =>
                            s.id === service.id
                              ? { ...s, selected: !s.selected }
                              : s,
                          ),
                        )
                      }
                    />
                    <span>{service.name}</span>
                  </div>
                  <div className="handle-staff-services-modal-body-services-body-service-group-duration-price">
                    <span
                      style={{
                        opacity: "50%",
                        fontSize: "18px",
                        textAlign: "center",
                      }}
                    >
                      {service.durationMinutes + "min"}
                    </span>
                    <span style={{ textAlign: "right" }}>
                      {service.price.toFixed(2) + "zł"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="handle-staff-services-modal-buttons">
          <button
            id="handle-staff-services-modal-buttons-cancel"
            className="button-bookuj"
            type="button"
            onClick={() => {
              setShowAddServicesModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className="button-bookuj"
            type="button"
            onClick={handleAssignServices}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}

export default HandleAddStaffServicesModal;
