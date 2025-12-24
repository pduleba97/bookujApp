import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChevronRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./BusinessDetails.css";

function BusinessDetails() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  return (
    <div className="business-details-card">
      <div className="business-details-header">
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{ fontSize: "22px", cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <h1>Business Details</h1>
      </div>

      <div className="dashboard-details-tiles">
        <Link
          to={`/manage-businesses/business/${businessId}/settings/details/general-information`}
        >
          <div className="dashboard-details-tile">
            <div className="dashboard-details-tile-body">
              <div className="dashboard-details-tile-body-description">
                <h3>General Info</h3>
                <p>
                  Add general information about your business, list your contact
                  details, and fill in the description.
                </p>
              </div>
            </div>
            <div className="dashboard-details-tile-chevron">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="dashboard-details-tile-icon"
              />
            </div>
          </div>
        </Link>

        <Link
          to={`/manage-businesses/business/${businessId}/settings/details/category`}
        >
          <div className="dashboard-details-tile">
            <div className="dashboard-details-tile-body">
              <div className="dashboard-details-tile-body-description">
                <h3>Business Category</h3>
                <p>
                  Choose your business category so we can get your profile in
                  front of the right people.
                </p>
              </div>
            </div>
            <div className="dashboard-details-tile-chevron">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="dashboard-details-tile-icon"
              />
            </div>
          </div>
        </Link>

        <Link
          to={`/manage-businesses/business/${businessId}/settings/details/photos`}
        >
          <div className="dashboard-details-tile">
            <div className="dashboard-details-tile-body">
              <div className="dashboard-details-tile-body-description">
                <h3>Profile images</h3>
                <p>
                  Add your logo, upload workspace photos, and choose your cover
                  photo.
                </p>
              </div>
            </div>
            <div className="dashboard-details-tile-chevron">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="dashboard-details-tile-icon"
              />
            </div>
          </div>
        </Link>

        <Link
          to={`/manage-businesses/business/${businessId}/settings/details/opening-hours`}
        >
          <div className="dashboard-details-tile">
            <div className="dashboard-details-tile-body">
              <div className="dashboard-details-tile-body-description">
                <h3>Opening Hours</h3>
                <p>Adjust your business opening hours.</p>
              </div>
            </div>
            <div className="dashboard-details-tile-chevron">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="dashboard-details-tile-icon"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default BusinessDetails;
