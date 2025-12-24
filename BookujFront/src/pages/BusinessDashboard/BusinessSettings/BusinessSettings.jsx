import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChevronRight,
  faListUl,
  faFileInvoiceDollar,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import "./BusinessSettings.css";

function BusinessSettings() {
  const { businessId } = useParams();
  return (
    <div className="business-settings-card">
      <div className="business-settings-header">
        <h1>Business settings</h1>
      </div>

      <div className="dashboard-settings-tiles">
        <Link to={`/manage-businesses/business/${businessId}/settings/details`}>
          <div className="dashboard-settings-tile">
            <FontAwesomeIcon
              icon={faHouse}
              className="dashboard-settings-tile-icon"
            />
            <div className="dashboard-settings-tile-body">
              <div className="dashboard-settings-tile-body-description">
                <h3>Business Details</h3>
                <p>
                  Add details to establish your brand, choose your business
                  category, opening hours, change profile image.
                </p>
              </div>
            </div>
            <div className="dashboard-settings-tile-chevron">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="dashboard-settings-tile-icon"
              />
            </div>
          </div>
        </Link>

        <Link
          to={`/manage-businesses/business/${businessId}/settings/payments`}
        >
          <div className="dashboard-settings-tile">
            <FontAwesomeIcon
              icon={faCreditCard}
              className="dashboard-settings-tile-icon"
            />
            <div className="dashboard-settings-tile-body">
              <div className="dashboard-settings-tile-body-description">
                <h3>Payments & Checkout</h3>
                <p>
                  Manage Payment methods, Checkout Settings, and view
                  transaction history.
                </p>
              </div>
            </div>
            <div className="dashboard-settings-tile-chevron">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="dashboard-settings-tile-icon"
              />
            </div>
          </div>
        </Link>

        <Link
          to={`/manage-businesses/business/${businessId}/settings/services`}
        >
          <div className="dashboard-settings-tile">
            <FontAwesomeIcon
              icon={faListUl}
              className="dashboard-settings-tile-icon"
            />
            <div className="dashboard-settings-tile-body">
              <div className="dashboard-settings-tile-body-description">
                <h3>Services Setup</h3>
                <p>
                  Add service details. Here you can adjust service price,
                  duration and description.
                </p>
              </div>
            </div>
            <div className="dashboard-settings-tile-chevron">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="dashboard-settings-tile-icon"
              />
            </div>
          </div>
        </Link>

        <Link
          to={`/manage-businesses/business/${businessId}/settings/subscriptions`}
        >
          <div className="dashboard-settings-tile">
            <FontAwesomeIcon
              icon={faFileInvoiceDollar}
              className="dashboard-settings-tile-icon"
            />
            <div className="dashboard-settings-tile-body">
              <div className="dashboard-settings-tile-body-description">
                <h3>Subscription & Billing</h3>
                <p>Billing Details, Subscription, Payment Method.</p>
              </div>
            </div>
            <div className="dashboard-settings-tile-chevron">
              <FontAwesomeIcon
                icon={faChevronRight}
                className="dashboard-settings-tile-icon"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default BusinessSettings;
