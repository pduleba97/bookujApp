import "./ServiceModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function EditServiceModal({
  setEditIdx,
  serviceData,
  serviceCategories = null,
  onEdit,
  onDelete,
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

  const [serviceTimeHour, setServiceTimeHour] = useState(() => {
    return Math.floor(serviceData.durationMinutes / 60);
  });
  const [serviceTimeMinute, setServiceTimeMinute] = useState(() => {
    return serviceData.durationMinutes % 60;
  });
  const [service, setService] = useState({
    name: serviceData.name,
    serviceCategoryId: serviceData.serviceCategoryId,
    description: serviceData.description,
    price: serviceData.price.toFixed(2),
    durationMinutes: 0,
    isActive: true,
  });

  function handleOnChange(e) {
    setService((prev) => {
      return {
        ...prev,
        [e.target.id]: e.target.value === "" ? null : e.target.value,
      };
    });
  }

  function handlePriceOnBlur(e) {
    setService((prev) => {
      const value = parseFloat(e.target.value);

      if (isNaN(value)) {
        return { ...prev, price: 0 };
      }
      return {
        ...prev,
        [e.target.id]: value.toFixed(2),
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

    const editedService = {
      ...service,
      price: parseFloat(service.price),
      description: service.description || null,
      durationMinutes: 60 * serviceTimeHour + serviceTimeMinute,
      ...(serviceData.id && { id: serviceData.id }), // if this fields exist -> add it
    };
    onEdit(editedService);
    setEditIdx(null);
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
              icon={faArrowLeft}
              className="service-modal-card-header-close"
              onClick={() => {
                setEditIdx(null);
              }}
            />
            <h1>Edit Service</h1>
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
              id="name"
              placeholder=""
              onChange={handleOnChange}
            />
            <label htmlFor="Name">Service Name</label>
          </div>

          {serviceCategories && (
            <div className={`form-group has-value`}>
              <select
                type="text"
                value={service.serviceCategoryId}
                id="serviceCategoryId"
                placeholder=""
                onChange={handleOnChange}
              >
                <option value="">No Category</option>
                {serviceCategories.map((sc) => (
                  <option value={sc.id}>{sc.name}</option>
                ))}
              </select>
              <label htmlFor="serviceCategoryId">Service Category</label>
            </div>
          )}

          <div className="service-modal-card-body-inputs">
            <div
              className={`form-group ${serviceTimeHour != null && "has-value"}`}
            >
              <select
                id="hours"
                value={serviceTimeHour ?? ""}
                onChange={(e) => setServiceTimeHour(Number(e.target.value))}
              >
                {hoursValues.map((hourValue, idx) => (
                  <option key={hourValue} value={hourValue}>
                    {hours[idx]}
                  </option>
                ))}
              </select>
              <label htmlFor="hours">Hour(s)</label>
            </div>
            <div
              className={`form-group ${
                serviceTimeMinute != null && "has-value"
              }`}
            >
              <select
                id="minutes"
                value={serviceTimeMinute ?? ""}
                onChange={(e) => setServiceTimeMinute(Number(e.target.value))}
              >
                {minutesValues.map((minuteValue, idx) => (
                  <option key={minuteValue} value={minuteValue}>
                    {minutes[idx]}
                  </option>
                ))}
              </select>
              <label htmlFor="minutes">Minutes</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                id="price"
                placeholder=""
                value={service.price}
                onChange={handleOnChange}
                onBlur={handlePriceOnBlur}
              />
              <label htmlFor="price">Price</label>
            </div>
            <div className="form-group full-width">
              <textarea
                id="description"
                name="description"
                placeholder=""
                value={service.description || ""}
                onChange={handleOnChange}
              />
              <label htmlFor="description">Description</label>
            </div>
          </div>
        </div>
        <div className="edit-service-modal-card-book-details">
          <div
            className="edit-service-remove-box"
            onClick={() => {
              onDelete();
              setEditIdx(null);
            }}
          >
            <FontAwesomeIcon
              className="edit-service-remove"
              icon={faTrashCan}
            />
          </div>
          <button
            className="button-bookuj"
            type="button"
            onClick={handleSubmit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditServiceModal;
