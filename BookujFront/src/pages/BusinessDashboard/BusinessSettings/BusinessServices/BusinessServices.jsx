import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBars,
  faChevronRight,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import "./BusinessServices.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../../../../api/authFetch";
import ServiceModal from "../../../../components/CreateBusiness/ServiceModal";
import EditServiceModal from "../../../../components/CreateBusiness/EditServiceModal";
import ServiceCategoryModal from "./ServiceCategoryModal";
import PlaceholderGrahpic from "../../../../utils/PlaceholderGrahpic";
import EditServiceCategoryModal from "./EditServiceCategoryModal";
import Spinner from "../../../../utils/Spinner/Spinner";
import BusinessCategoriesDnd from "./BusinessCategoriesDnD";

function BusinessServices() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("");
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceCategoryModal, setShowServiceCategoryModal] =
    useState(false);
  const [showEditServiceCategoryModalId, setShowEditServiceCategoryModalId] =
    useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const categoriesResponse = await authFetch(
          `/businesses/me/${businessId}/servicecategories`
        );

        const categoriesData = await categoriesResponse.json();
        if (!categoriesResponse.ok) {
          throw new Error(categoriesData.err);
        }
        setServiceCategories(categoriesData);

        const servicesResponse = await authFetch(
          `/businesses/me/${businessId}/services`,
          { method: "GET" }
        );

        const servicesData = await servicesResponse.json();
        if (!servicesResponse.ok) {
          throw new Error(servicesData.err);
        }
        setServices(servicesData);
        setFilteredServices(servicesData);
        console.log(categoriesData);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredServices(
      services.filter((service) =>
        service.name.toLowerCase().includes(serviceFilter.toLowerCase())
      )
    );
  }, [serviceFilter, services]);

  async function fetchServicesByCategory(categoryId) {
    try {
      setLoadingServices(true);
      const url =
        categoryId === -1
          ? `/businesses/me/${businessId}/services`
          : categoryId === null
          ? `/businesses/me/${businessId}/services/nocategory`
          : `/businesses/me/${businessId}/services/category/${categoryId}`;

      const servicesResponse = await authFetch(url, { method: "GET" });

      const servicesData = await servicesResponse.json();
      if (!servicesResponse.ok) {
        throw new Error(servicesData.err);
      }
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingServices(false);
    }
  }

  useEffect(() => {
    fetchServicesByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  return (
    <>
      {showOptionsModal && (
        <div
          className="business-settings-services-wrapper"
          onClick={() => {
            setShowOptionsModal(false);
          }}
        />
      )}
      <div className="business-settings-services-card">
        {showServiceModal && (
          <ServiceModal
            setShowServiceModal={setShowServiceModal}
            positionClass="settings-services-modal"
            onSave={async (newService) => {
              const response = await authFetch(
                `/businesses/me/${businessId}/service`,
                {
                  method: "POST",
                  body: JSON.stringify(newService),
                }
              );

              const data = await response.json();

              fetchServicesByCategory(selectedCategoryId);
            }}
          />
        )}

        {showServiceCategoryModal && (
          <ServiceCategoryModal
            setShowServiceCategoryModal={setShowServiceCategoryModal}
            setServiceCategories={setServiceCategories}
            businessId={businessId}
          />
        )}

        {showEditServiceCategoryModalId && (
          <EditServiceCategoryModal
            setShowEditServiceCategoryModalId={
              setShowEditServiceCategoryModalId
            }
            serviceCategory={serviceCategories.find(
              (sc) => sc.id == showEditServiceCategoryModalId
            )}
            setServiceCategories={setServiceCategories}
            businessId={businessId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        )}

        {editIdx != null && (
          <EditServiceModal
            setEditIdx={setEditIdx}
            serviceData={services.find((s) => s.id === editIdx)}
            serviceCategories={serviceCategories}
            positionClass="settings-services-modal"
            onEdit={async (editedService) => {
              try {
                const response = await authFetch(
                  `/businesses/me/${businessId}/service/${editIdx}`,
                  {
                    method: "PATCH",
                    body: JSON.stringify(editedService),
                  }
                );
                const data = await response.json();
                if (!response.ok) {
                  throw new Error(data.err);
                }

                fetchServicesByCategory(selectedCategoryId);
              } catch (err) {
                console.warn(err);
              }
            }}
            onDelete={async () => {
              try {
                const response = await authFetch(
                  `/businesses/me/${businessId}/service/${editIdx}`,
                  {
                    method: "DELETE",
                  }
                );

                if (!response.ok) {
                  const error = await response.json();
                  throw new Error(error.err);
                }

                setServices((prev) => prev.filter((s) => s.id !== editIdx));
              } catch (err) {
                console.warn(err);
              }
            }}
          />
        )}
        <div className="business-settings-services-header">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <h1>Services Setup</h1>
        </div>

        <div className="dashboard-settings-services-body">
          <div className="dashboard-settings-services-body-header">
            <p>Services</p>
            <hr />
          </div>

          <div className="dashboard-settings-services-body-content">
            <div className="dashboard-settings-services-body-categories">
              <p
                className={`dashboard-settings-services-body-categories-category-p ${
                  selectedCategoryId === -1
                    ? "dashboard-settings-services-body-categories-category-selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCategoryId(-1);
                }}
              >
                All categories
              </p>
              <p
                className={`dashboard-settings-services-body-categories-category-p ${
                  selectedCategoryId === null
                    ? "dashboard-settings-services-body-categories-category-selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCategoryId(null);
                }}
              >
                No category
              </p>
              <BusinessCategoriesDnd
                serviceCategories={serviceCategories}
                setServiceCategories={setServiceCategories}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                setShowEditServiceCategoryModalId={
                  setShowEditServiceCategoryModalId
                }
              />
            </div>
            <div className="dashboard-settings-services-body-services">
              <div className="input-details">
                <div className="form-group">
                  <input
                    type="text"
                    id="service"
                    name="Service"
                    placeholder=""
                    value={serviceFilter}
                    onChange={(e) => {
                      setServiceFilter(e.target.value);
                    }}
                  />
                  <label htmlFor="address">Search for service</label>
                </div>
              </div>

              <div className="dashboard-settings-services-body-services-list">
                {loadingServices ? (
                  <Spinner />
                ) : services.length == 0 ? (
                  <div className="dashboard-settings-services-body-services-list-placeholder">
                    <PlaceholderGrahpic />
                    {selectedCategoryId === -1 ? (
                      <span>You haven't added any services yet.</span>
                    ) : selectedCategoryId === null ? (
                      <span>All services are assigned to a category.</span>
                    ) : (
                      <span>
                        None of the services is assigned to this category.
                      </span>
                    )}
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <div key={service.id}>
                      <div className="dashboard-settings-services-body-services-list-item">
                        <div
                          className="service-name-duration-name-price"
                          onClick={() => {
                            setEditIdx(service.id);
                          }}
                        >
                          <div className="service-name-duration-name">
                            <div>{service.name}</div>
                            <p>{service.durationMinutes + "min"}</p>
                          </div>
                          <div className="service-price">
                            <div>{service.price?.toFixed(2) + " zł"}</div>
                            <FontAwesomeIcon
                              icon={faChevronRight}
                              style={{ fontSize: "20px" }}
                            />
                          </div>
                        </div>
                      </div>
                      <hr className="divider" />
                    </div>
                  ))
                )}
              </div>
              <div className="dashboard-settings-services-body-services-list-addnew-wrapper">
                {!showOptionsModal ? (
                  <div
                    className="dashboard-settings-services-body-services-list-addnew-plus"
                    onClick={() => {
                      setShowOptionsModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                ) : (
                  <div className="dashboard-settings-services-body-services-list-addnew-modal-wrapper">
                    <div className="dashboard-settings-services-body-services-list-addnew-menu">
                      <button
                        onClick={() => {
                          setShowServiceModal(true);
                          setShowOptionsModal(false);
                        }}
                      >
                        New Service
                      </button>
                      <button
                        onClick={() => {
                          setShowServiceCategoryModal(true);
                          setShowOptionsModal(false);
                        }}
                      >
                        New Category
                      </button>
                    </div>
                    <div className="dashboard-settings-services-body-services-list-addnew-close">
                      <FontAwesomeIcon
                        icon={faX}
                        onClick={() => {
                          setShowOptionsModal(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BusinessServices;
