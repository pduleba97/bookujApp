import { useState } from "react";
import "./BusinessDetailsForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faSquarePlus,
  faTrashCan,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import ServiceModal from "./ServiceModal.jsx";
import EditServiceModal from "./EditServiceModal.jsx";

function BusinessServicesForm({
  businessData,
  setBusinessData,
  prevStep,
  handleBusinessSubmit,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);

  function handleRemoveService(idxToRemove) {
    setBusinessData((prev) => {
      return {
        ...prev,
        services: prev.services.filter((_, idx) => idx != idxToRemove),
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleBusinessSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      {showModal && (
        <ServiceModal
          setShowServiceModal={setShowModal}
          positionClass="register-services-modal"
          onSave={(newService) => {
            setBusinessData((prev) => ({
              ...prev,
              services: [...prev.services, newService],
            }));
          }}
        />
      )}
      {editIdx !== null && (
        <EditServiceModal
          setEditIdx={setEditIdx}
          serviceData={businessData.services[editIdx]}
          onEdit={(editedService) => {
            setBusinessData((prev) => {
              const newServices = [...prev.services];
              newServices[editIdx] = editedService;

              return { ...prev, services: newServices };
            });
          }}
          onDelete={() => {
            handleRemoveService(editIdx);
          }}
          positionClass="register-services-modal"
        />
      )}
      <div className="business-services-form">
        <FontAwesomeIcon style={{ fontSize: "60px" }} icon={faStore} />
        <div className="business-services-form-header">
          <h1 id="create-business-header">
            {businessData.services.length == 0
              ? "No services added yet"
              : "Your services"}
          </h1>
          {businessData.services.length == 0 && (
            <p>
              Add at least one service now. Later you can add more, edit
              details, and group services into categories.
            </p>
          )}
        </div>
        {businessData.services.length > 0 && <hr className="divider" />}
        {businessData.services &&
          businessData.services.map((service, idx) => (
            <div
              key={idx}
              data-testid={`service-${idx}`}
              className="service-group"
            >
              <div className="service-delete">
                <FontAwesomeIcon
                  id="service-remove"
                  className="service-remove"
                  icon={faTrashCan}
                  onClick={() => {
                    handleRemoveService(idx);
                  }}
                />
              </div>
              <div
                className="service-name-duration-name-price"
                onClick={() => {
                  setEditIdx(idx);
                }}
              >
                <div className="service-name-duration-name">
                  <div id="service-name">{service.name}</div>
                  <p id="service-duration">{service.durationMinutes + "min"}</p>
                </div>
                <div className="service-price">
                  <div id="service-price">
                    {service.price.toFixed(2) + " zł"}
                  </div>
                  <FontAwesomeIcon
                    id="service-chevron"
                    icon={faChevronRight}
                    style={{ fontSize: "20px" }}
                  />
                </div>
              </div>
            </div>
          ))}
        <div
          id="business-services-form-add-button"
          className="business-services-form-button"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <FontAwesomeIcon icon={faSquarePlus} />
          <p>Add new service</p>
        </div>
      </div>

      <div className="form-buttons">
        <button
          type="submit"
          id="business-form-create"
          className="manage-business-button"
        >
          Create Business
        </button>
        <button
          type="button"
          id="business-form-back"
          className="manage-business-button-white"
          onClick={prevStep}
        >
          Back
        </button>
      </div>
    </form>
  );
}

export default BusinessServicesForm;
