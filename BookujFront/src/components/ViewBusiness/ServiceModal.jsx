import "./ServiceModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

function ServiceModal({ service, setActiveServiceId }) {
  return (
    <div
      className="service-modal-overlay"
      onClick={() => {
        setActiveServiceId(null);
      }}
    >
      <div className="service-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="service-modal-card-header">
          <FontAwesomeIcon
            icon={faX}
            className="service-modal-card-header-close"
            onClick={() => {
              setActiveServiceId(null);
            }}
          />
          <h4>{service.name}</h4>
        </div>
        <hr className="divider" />
        <div className="service-modal-card-body">{service.description}</div>
        <div className="service-modal-card-book-details">
          <div className="price-duration">
            <h3>{service.price.toFixed(2) + " zł"}</h3>
            <span>{service.durationMinutes + "min"}</span>
          </div>
          <button className="button-bookuj">Book</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceModal;
