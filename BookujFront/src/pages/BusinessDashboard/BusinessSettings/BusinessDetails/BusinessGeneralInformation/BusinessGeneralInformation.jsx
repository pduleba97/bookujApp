import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faGlobeEurope } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faSquareFacebook,
} from "@fortawesome/free-brands-svg-icons";
import "./BusinessGeneralInformation.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { authFetch } from "../../../../../api/authFetch";
import Switch from "react-ios-switch";

function BusinessGeneralInformation() {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [businessData, setBusinessData] = useState({
    name: "",
    description: "",
    email: "",
    phoneNumber: "",
    instagramUrl: "",
    facebookUrl: "",
    websiteUrl: "",
    isActive: false,
  });
  const [initialBusinessData, setInitialBusinessData] = useState(null);
  const changeDetected =
    initialBusinessData &&
    ((initialBusinessData.name || "") !== (businessData.name || "") ||
      (initialBusinessData.phoneNumber || "") !==
        (businessData.phoneNumber || "") ||
      (initialBusinessData.email || "") !== (businessData.email || "") ||
      (initialBusinessData.description || "") !==
        (businessData.description || "") ||
      (initialBusinessData.isActive || "") !== (businessData.isActive || "") ||
      (initialBusinessData.instagramUrl || "") !==
        (businessData.instagramUrl || "") ||
      (initialBusinessData.facebookUrl || "") !==
        (businessData.facebookUrl || "") ||
      (initialBusinessData.websiteUrl || "") !==
        (businessData.websiteUrl || ""));

  const descriptionRef = useRef(null);

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

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height =
        descriptionRef.current.scrollHeight + "px";
    }
  }, [businessData.description]);

  function handleOnChange(e) {
    setBusinessData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleOnClick() {
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
    <div className="business-settings-details-generalInformation-card">
      <div className="business-settings-details-generalInformation-header">
        <div className="business-settings-details-generalInformation-header-back">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <h1>General Information</h1>
        </div>
        <button
          disabled={!changeDetected}
          className="button-bookuj business-settings-details-generalInformation-header-save"
          onClick={handleOnClick}
        >
          Save
        </button>
      </div>

      <div className="dashboard-settings-details-generalInformation-body">
        <div className="dashboard-settings-details-generalInformation-body-content">
          <div className="dashboard-settings-details-generalInformation-body-content-general">
            <div className="dashboard-settings-details-generalInformation-body-content-header">
              <p>General Info</p>
            </div>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                placeholder=""
                value={businessData.name || ""}
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
              <label htmlFor="name">Business name</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder=""
                value={businessData.phoneNumber || ""}
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
              <label htmlFor="phoneNumber">Business phone number</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="email"
                name="email"
                placeholder=""
                value={businessData.email || ""}
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
              <label htmlFor="email">Business email</label>
            </div>

            <div className="form-group">
              <textarea
                type="text"
                id="description"
                name="description"
                ref={descriptionRef}
                placeholder=""
                value={businessData.description || ""}
                onChange={(e) => {
                  handleOnChange(e);
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <label htmlFor="description" style={{ textAlign: "left" }}>
                Short description of your business (recommended)
              </label>
            </div>

            <div className="dashboard-settings-details-generalInformation-body-content-checkbox-group">
              <div>
                <Switch
                  checked={businessData.isActive}
                  onChange={() => {
                    setBusinessData((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }));
                  }}
                />
              </div>

              <div>
                <h4>Activate this business</h4>
                <p>
                  Turn this on to make your business visible to customers and
                  allow bookings.
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-settings-details-generalInformation-body-content-socialMedias">
            <div className="dashboard-settings-details-generalInformation-body-content-header">
              <p>Social media</p>
            </div>
            <div className="form-group with-icon">
              <FontAwesomeIcon icon={faInstagram} className="input-icon" />
              <input
                type="text"
                id="instagramUrl"
                name="instagramUrl"
                placeholder=""
                value={businessData.instagramUrl || ""}
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
              <label htmlFor="instagramUrl">Instagram</label>
            </div>

            <div className="form-group with-icon">
              <FontAwesomeIcon icon={faSquareFacebook} className="input-icon" />
              <input
                type="text"
                id="facebookUrl"
                name="facebookUrl"
                placeholder=""
                value={businessData.facebookUrl || ""}
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
              <label htmlFor="facebookUrl">Facebook</label>
            </div>

            <div className="form-group with-icon">
              <FontAwesomeIcon icon={faGlobeEurope} className="input-icon" />
              <input
                type="text"
                id="websiteUrl"
                name="websiteUrl"
                placeholder=""
                value={businessData.websiteUrl || ""}
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
              <label htmlFor="websiteUrl">Website</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessGeneralInformation;
