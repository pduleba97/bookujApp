import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./BusinessServices.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../../../../api/authFetch";
import ServiceModal from "../../../../components/CreateBusiness/ServiceModal";
import EditServiceModal from "../../../../components/CreateBusiness/EditServiceModal";

function BusinessServices() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [serviceFilter, setServiceFilter] = useState("");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await authFetch(
          `/businesses/me/${businessId}/services`,
          { method: "GET" }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.err);
        }
        setServices(data);
        setFilteredServices(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredServices(
      services.filter((service) =>
        service.name.toLowerCase().includes(serviceFilter.toLowerCase())
      )
    );
  }, [serviceFilter, services]);

  return (
    <div className="business-settings-services-card">
      {showModal && (
        <ServiceModal
          setShowModal={setShowModal}
          positionClass="settings-services-modal"
          onSave={async (newService) => {
            const response = await authFetch(
              `/businesses/me/${businessId}/service`,
              {
                method: "POST",
                body: JSON.stringify(newService),
              }
            );

            const data = await response.json();

            setServices((prev) => [...prev, data]);
          }}
        />
      )}
      {editIdx != null && (
        <EditServiceModal
          setEditIdx={setEditIdx}
          serviceData={services.find((s) => s.id === editIdx)}
          positionClass="settings-services-modal"
          onEdit={async (editedService) => {
            try {
              const response = await authFetch(
                `/businesses/me/${businessId}/service`,
                {
                  method: "PATCH",
                  body: JSON.stringify(editedService),
                }
              );
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.err);
              }

              setServices((prev) =>
                prev.map((s) => (s.id === editedService.id ? editedService : s))
              );
            } catch (err) {
              console.warn(err);
            }
          }}
          onDelete={async () => {
            try {
              const response = await authFetch(
                `/businesses/me/${businessId}/service/${editIdx}`,
                {
                  method: "DELETE",
                }
              );

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.err);
              }

              setServices((prev) => prev.filter((s) => s.id !== editIdx));
            } catch (err) {
              console.warn(err);
            }
          }}
        />
      )}
      <div className="business-settings-services-header">
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{ fontSize: "22px", cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <h1>Services Setup</h1>
      </div>

      <div className="dashboard-settings-services-body">
        <div className="dashboard-settings-services-body-header">
          <p>Services</p>
          <hr />
        </div>

        <div className="dashboard-settings-services-body-content">
          <div className="dashboard-settings-services-body-categories">
            <p>All categories</p>
          </div>
          <div className="dashboard-settings-services-body-services">
            <div className="input-details">
              <div className="form-group">
                <input
                  type="text"
                  id="service"
                  name="Service"
                  placeholder=""
                  value={serviceFilter}
                  onChange={(e) => {
                    setServiceFilter(e.target.value);
                  }}
                />
                <label htmlFor="address">Search for service</label>
              </div>
            </div>

            <div className="dashboard-settings-services-body-services-list">
              {filteredServices &&
                filteredServices.map((service) => (
                  <div key={service.id}>
                    <div
                      className="service-name-duration-name-price"
                      onClick={() => {
                        setEditIdx(service.id);
                      }}
                    >
                      <div className="service-name-duration-name">
                        <div>{service.name}</div>
                        <p>{service.durationMinutes + "min"}</p>
                      </div>
                      <div className="service-price">
                        <div>{service.price.toFixed(2) + " zł"}</div>
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          style={{ fontSize: "20px" }}
                        />
                      </div>
                    </div>

                    <hr className="divider" />
                  </div>
                ))}
            </div>
            <div
              className="dashboard-settings-services-body-services-list-addnew"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessServices;
