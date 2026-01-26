import "./OpeningHourModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function OpeningHourModal({
  openingHour,
  idx,
  setActiveOpeningHourId,
  weekDays,
  onSave,
}) {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  const [openHour, setOpenHour] = useState(
    openingHour?.openTime?.slice(0, 5) ?? "00:00",
  );
  const [closeHour, setCloseHour] = useState(
    openingHour?.closeTime?.slice(0, 5) ?? "00:00",
  );

  function submitForm(e) {
    e.preventDefault();

    if (openHour > closeHour) {
      alert("Opening time must be earlier than closing time!");
      return;
    }
    const newOpeningHour = {
      ...openingHour,
      openTime: openHour,
      closeTime: closeHour,
    };

    onSave(newOpeningHour, idx);

    // setOpeningHours((prev) => {
    //   const newOpeningHours = [...prev];
    //   newOpeningHours[openingHour.dayOfWeek] = {
    //     ...prev[openingHour.dayOfWeek],
    //     openTime: openHour,
    //     closeTime: closeHour,
    //   };
    //   return newOpeningHours;
    // });
    setActiveOpeningHourId(null);
  }

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        setActiveOpeningHourId(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      tabIndex={0}
    >
      <div
        className="opening-hour-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="opening-hour-modal-card-description">
          <div className="opening-hour-modal-card-header">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="opening-hour-modal-card-header-close"
              onClick={() => {
                setActiveOpeningHourId(null);
              }}
            />
            <h1>{weekDays[idx]}</h1>
          </div>

          <p>
            Set your business hours here. Select opening and closing hour from
            the drop-down menu.
          </p>
        </div>
        <div className="opening-hour-modal-card-body">
          <div style={{ fontSize: "18px" }}>Opening hours</div>
          <div className="opening-hour-modal-card-body-inputs">
            <select
              value={openHour}
              onChange={(e) => setOpenHour(e.target.value)}
            >
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <select
              value={closeHour}
              onChange={(e) => setCloseHour(e.target.value)}
            >
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="opening-hour-modal-card-book-details">
          <button type="button" onClick={submitForm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpeningHourModal;
