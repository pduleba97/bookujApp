import "./ServiceModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function ServiceModal({
  setShowServiceModal,
  serviceCategories,
  onSave,
  positionClass,
}) {
  const hours = [null];
  const hoursValues = [null];
  const minutes = [null];
  const minutesValues = [null];
  for (let i = 0; i < 24; i++) {
    const hour = i + "h";
    const hourValue = i;
    hours.push(hour);
    hoursValues.push(hourValue);
  }
  for (let i = 0; i < 12; i++) {
    const minute = i * 5 + "min";
    const minuteValue = i * 5;
    minutes.push(minute);
    minutesValues.push(minuteValue);
  }

  const [serviceTimeHour, setServiceTimeHour] = useState(null);
  const [serviceTimeMinute, setServiceTimeMinute] = useState(null);
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: 0,
    isActive: true,
  });

  function handleOnChange(e) {
    setService((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handlePriceOnBlur(e) {
    setService((prev) => {
      const value = parseFloat(e.target.value);

      if (isNaN(value)) {
        return { ...prev, price: "" };
      }
      return {
        ...prev,
        [e.target.name]: value.toFixed(2),
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (service.name.length < 3 || service.name == null) {
      alert("A valid Service Name is required.");
      return;
    }

    if (serviceTimeHour == null) {
      setServiceTimeHour(0);
      if (serviceTimeMinute == null) {
        setServiceTimeMinute(0);
      }
      return;
    }

    if (serviceTimeMinute == null) {
      setServiceTimeMinute(0);
      return;
    }

    if (
      (serviceTimeHour == 0 || serviceTimeHour == null) &&
      (serviceTimeMinute == 0 || serviceTimeMinute == null)
    ) {
      alert("Service cannot last 0 minutes!");
      return;
    }

    if (
      service.price == null ||
      service.price == "0.00" ||
      service.price == ""
    ) {
      alert("Price cannot be set to 0.");
      return;
    }

    const newService = {
      ...service,
      description: service.description || null,
      price: parseFloat(service.price),
      durationMinutes: 60 * serviceTimeHour + serviceTimeMinute,
    };

    onSave(newService);
    setShowServiceModal(false);
  }

  return (
    <div
      className="modal-overlay"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      tabIndex={0}
    >
      <div className={`service-modal-card ${positionClass}`}>
        <div className="service-modal-card-description">
          <div className="service-modal-card-header">
            <FontAwesomeIcon
              id="service-modal-close"
              className="service-modal-card-header-close"
              icon={faArrowLeft}
              onClick={() => {
                setShowServiceModal(false);
              }}
            />
            <h1>Add Service</h1>
          </div>

          <p>
            Add the basic information for this service now. Description is
            optional and you'll be able to include it for this service later on.
          </p>
        </div>
        <div className="service-modal-card-body">
          <div className="form-group">
            <input
              type="text"
              value={service.name}
              id="service-name"
              name="name"
              placeholder=""
              onChange={handleOnChange}
            />
            <label htmlFor="service-name">Service Name</label>
          </div>

          {serviceCategories && (
            <div className={`form-group has-value`}>
              <select
                type="text"
                value={service.serviceCategoryId}
                id="service-category-id"
                name="serviceCategoryId"
                placeholder=""
                onChange={handleOnChange}
              >
                <option value="">No Category</option>
                {serviceCategories.map((sc) => (
                  <option value={sc.id}>{sc.name}</option>
                ))}
              </select>
              <label htmlFor="service-category-id">Service Category</label>
            </div>
          )}

          <div className="service-modal-card-body-inputs">
            <div
              className={`form-group ${serviceTimeHour != null && "has-value"}`}
            >
              <select
                id="service-hours"
                name="hours"
                value={serviceTimeHour ?? ""}
                onChange={(e) => setServiceTimeHour(Number(e.target.value))}
              >
                {hoursValues.map((hourValue, idx) => (
                  <option key={hourValue} value={hourValue}>
                    {hours[idx]}
                  </option>
                ))}
              </select>
              <label htmlFor="service-hours">Hour(s)</label>
            </div>
            <div
              className={`form-group ${
                serviceTimeMinute != null && "has-value"
              }`}
            >
              <select
                id="service-minutes"
                name="minutes"
                value={serviceTimeMinute ?? ""}
                onChange={(e) => setServiceTimeMinute(Number(e.target.value))}
              >
                {minutesValues.map((minuteValue, idx) => (
                  <option key={minuteValue} value={minuteValue}>
                    {minutes[idx]}
                  </option>
                ))}
              </select>
              <label htmlFor="service-minutes">Minutes</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                id="service-price"
                name="price"
                placeholder=""
                value={service.price}
                onChange={handleOnChange}
                onBlur={handlePriceOnBlur}
              />
              <label htmlFor="service-price">Price</label>
            </div>
            <div className="form-group full-width">
              <textarea
                id="service-description"
                name="description"
                placeholder=""
                value={service.description}
                onChange={handleOnChange}
              />
              <label htmlFor="service-description">Description</label>
            </div>
          </div>
        </div>
        <div className="service-modal-card-book-details">
          <button
            id="service-modal-add"
            className="button-bookuj"
            type="button"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceModal;
