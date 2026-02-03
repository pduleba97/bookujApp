import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./BusinessOpeningHours.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../../../../../api/authFetch";
import BusinessOpeningHoursForm from "../../../../../components/CreateBusiness/BusinessOpeningHoursForm";

function BusinessOpeningHours() {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [businessData, setBusinessData] = useState({
    openingHours: [],
  });
  const [initialBusinessData, setInitialBusinessData] = useState(null);

  const normalizeTime = (t) => (t ? t.slice(0, 5) : null);
  const changeDetected =
    initialBusinessData &&
    businessData.openingHours.some((hour, idx) => {
      return (
        normalizeTime(initialBusinessData.openingHours[idx].openTime) !==
          normalizeTime(hour.openTime) ||
        normalizeTime(initialBusinessData.openingHours[idx].closeTime) !==
          normalizeTime(hour.closeTime) ||
        initialBusinessData.openingHours[idx].isOpen !== hour.isOpen
      );
    });

  useEffect(() => {
    (async () => {
      try {
        const response = await authFetch(`/businesses/me/${businessId}`, {
          method: "GET",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }
        setBusinessData(data);
        setInitialBusinessData(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  function setOpeningHour(newOpeningHour, idx) {
    setBusinessData((prev) => {
      const newOpeningHours = [...prev.openingHours];
      newOpeningHours[idx] = newOpeningHour;
      return { ...prev, openingHours: newOpeningHours };
    });
  }

  async function handleUpdateOpeningHours() {
    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/opening-hours`,
        { method: "PATCH", body: JSON.stringify(businessData.openingHours) },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setInitialBusinessData((prev) => ({ ...prev, openingHours: data }));
    } catch (err) {
      console.warn(err);
    }
  }

  if (businessData.openingHours.length == 0) return <p>Loading...</p>;

  return (
    <div className="business-settings-details-opening-hours-card">
      <div className="business-settings-details-opening-hours-header">
        <div className="business-settings-details-opening-hours-back">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <h1>Business Opening Hours</h1>
        </div>
      </div>
      <div className="business-settings-details-opening-hours-tiles">
        <BusinessOpeningHoursForm
          businessData={businessData}
          setBusinessData={setBusinessData}
          onSave={setOpeningHour}
        />
        <button
          disabled={!changeDetected}
          className="button-bookuj business-settings-details-opening-hours-save"
          onClick={handleUpdateOpeningHours}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default BusinessOpeningHours;
