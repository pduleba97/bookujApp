import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PlaceholderGrahpic() {
  return (
    <>
      <style>
        {`.services-placeholder {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.placeholder-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 220px;
  padding: 12px;
  border-radius: 12px;
  background: #f5f5f5;
  z-index: 100;
}

.placeholder-card.faded {
  margin-top: -2em;
  opacity: 0.3;
  width: 90%;
  z-index: 99;
}

.placeholder-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #ccc;
}

.placeholder-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.placeholder-lines .line {
  height: 10px;
  border-radius: 6px;
  background: #e0e0e0;
}

.placeholder-lines .line.short {
  width: 60%;
}

.placeholder-lines .line.long {
  width: 100%;
}
`}
      </style>
      <div className="services-placeholder">
        <div className="placeholder-card">
          <div className="placeholder-icon">
            <FontAwesomeIcon icon={faCalendar} className="placeholder-icon" />
          </div>
          <div className="placeholder-lines">
            <div className="line long"></div>
            <div className="line short"></div>
          </div>
        </div>

        <div className="placeholder-card faded">
          <div className="placeholder-icon">
            <FontAwesomeIcon icon={faCalendar} className="placeholder-icon" />
          </div>
          <div className="placeholder-lines">
            <div className="line long"></div>
            <div className="line short"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaceholderGrahpic;
