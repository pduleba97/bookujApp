import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./BusinessCategory.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../../../../../api/authFetch";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

function BusinessCategory() {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [businessData, setBusinessData] = useState({
    category: "",
  });
  const [initialBusinessData, setInitialBusinessData] = useState(null);
  const changeDetected =
    initialBusinessData &&
    (initialBusinessData.category || "") !== (businessData.category || "");

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

  function handleOnChange(e) {
    setBusinessData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleOnClick(e) {
    e.preventDefault();
    const patchPayload = {};
    for (let key in businessData) {
      if (businessData[key] !== initialBusinessData[key]) {
        patchPayload[key] = businessData[key];
      }
    }

    try {
      const response = await authFetch(`/businesses/me/${businessId}`, {
        method: "PATCH",
        body: JSON.stringify(patchPayload),
      });
      const data = await response.json();

      setInitialBusinessData(businessData);

      if (!response.ok) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className="business-settings-details-category-card">
      <form style={{ width: "100%" }} onSubmit={handleOnClick}>
        <div className="business-settings-details-category-header">
          <div className="business-settings-details-category-header-back">
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ fontSize: "22px", cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />
            <h1>Business Category</h1>
            <div className="question-mark-wrapper">
              <FontAwesomeIcon
                icon={faCircleQuestion}
                className="question-mark-icon"
                style={{ fontSize: "22px", cursor: "pointer" }}
              />
              <span className="tooltip">
                Your business category describes your line of work and the
                services you offer. To help customers find you, choose a main
                category that accurately reflects what you do. You can always
                change it later.
              </span>
            </div>
          </div>
          <button
            disabled={!changeDetected}
            className="button-bookuj business-settings-details-category-header-save"
            type="submit"
          >
            Save
          </button>
        </div>

        <div className="dashboard-settings-details-category-body">
          <div className="dashboard-settings-details-category-body-content">
            <div className="dashboard-settings-details-category-body-content-general">
              <div className="dashboard-settings-details-category-body-content-header">
                <p>What type of business are you?</p>
              </div>
              <div
                className={`form-group ${
                  businessData.category ? "has-value" : ""
                }`}
              >
                <select
                  type="text"
                  id="category"
                  name="category"
                  placeholder=""
                  value={businessData.category || ""}
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                  required
                >
                  <option value={null}></option>
                  <option value="Barber shop">Barber shop</option>
                  <option value="Hair Salon">Hair Salon</option>
                  <option value="Beauty Salon">Beauty Salon</option>
                  <option value="Nail Salon">Nail Salon</option>
                  <option value="Spa">Spa</option>
                </select>
                <label htmlFor="category">Business Category</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BusinessCategory;
