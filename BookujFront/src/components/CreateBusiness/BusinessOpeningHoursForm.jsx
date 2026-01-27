import { useState } from "react";
import "./BusinessDetailsForm.css";
import Switch from "react-ios-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import OpeningHourModal from "./OpeningHourModal.jsx";
import { faClock } from "@fortawesome/free-regular-svg-icons";

function BusinessOpeningHoursForm({
  businessData,
  setBusinessData,
  nextStep,
  prevStep,
  onSave = null,
}) {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [activeOpeningHourId, setActiveOpeningHourId] = useState(null);

  function submitForm(e) {
    e.preventDefault();
    nextStep();
  }

  return (
    <form onSubmit={submitForm} className="opening-hours-form-wrapper">
      <FontAwesomeIcon
        icon={faClock}
        className="opening-hours-form-wrapper-icon-clock"
      />
      {!businessData.openingHours[0].id ? (
        <h1>Your Business Hours</h1>
      ) : (
        <h1>Adjust opening hours</h1>
      )}
      <p>When can clients book with you?</p>

      <div className="opening-hours-form">
        {businessData.openingHours.map((openingHour, idx) => (
          <div key={idx}>
            <div className="opening-hours-group">
              {activeOpeningHourId === idx && (
                <OpeningHourModal
                  openingHour={openingHour}
                  idx={idx}
                  setActiveOpeningHourId={setActiveOpeningHourId}
                  weekDays={weekDays}
                  onSave={onSave}
                />
              )}

              <div
                className="opening-hours-group-toggle-day"
                onClick={(e) => e.stopPropagation()}
              >
                <Switch
                  checked={openingHour.isOpen}
                  onChange={() => {
                    setBusinessData((prev) => {
                      const newOpeningHours = [...prev.openingHours];
                      newOpeningHours[idx] = {
                        ...prev.openingHours[idx],
                        isOpen: !prev.openingHours[idx].isOpen,
                      };
                      return { ...prev, openingHours: newOpeningHours };
                    });
                  }}
                />
                <h4>{weekDays[idx]}</h4>
              </div>

              <div
                className="opening-hours-group-clickable"
                onClick={() => {
                  if (openingHour.isOpen) setActiveOpeningHourId(idx);
                }}
              >
                <div className="opening-hours-group-hours-info">
                  {openingHour.isOpen ? (
                    <div className="opening-hours-group-change-hours">
                      {`${
                        openingHour?.openTime?.slice(0, 5) ?? "00:00"
                      } - ${openingHour?.closeTime?.slice(0, 5) ?? "00:00"}`}
                    </div>
                  ) : (
                    <div className="opening-hours-group-change-hours">
                      Closed
                    </div>
                  )}
                </div>

                <div className="opening-hours-group-hours-chevron">
                  {openingHour.isOpen && (
                    <FontAwesomeIcon
                      className="faChevronRight"
                      icon={faChevronRight}
                    />
                  )}
                </div>
              </div>
            </div>

            {idx !== businessData.openingHours.length - 1 && (
              <hr className="divider" />
            )}
          </div>
        ))}
      </div>

      {businessData.id == null && (
        <div className="form-buttons">
          <button type="submit" className="manage-business-button" id="save">
            Next
          </button>
          <button
            type="button"
            className="manage-business-button-white"
            id="back"
            onClick={prevStep}
          >
            Back
          </button>
        </div>
      )}
    </form>
  );
}

export default BusinessOpeningHoursForm;
