import "./ManageBusiness.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { getCoordsFromAddress } from "../../utils/getCoordsFromAddress";
import { authFetch } from "../../api/authFetch";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faMagnifyingGlass,
  faCircle,
  faMobileScreen,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { useMap } from "react-leaflet";
import ServiceModal from "../../components/ViewBusiness/ServiceModal";
import BusinessPhotosGallery from "../BusinessDashboard/BusinessSettings/BusinessDetails/BusinessPhotos/BusinessPhotosGallery";

function ManageBusiness() {
  const [address, setAddress] = useState(null);
  const [businessData, setBusinessData] = useState({
    id: "",
    ownerId: "",
    name: "",
    description: "",
    category: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    latitude: null,
    longitude: null,
    isActive: false,
    profilePictureUrl: "",
    businessPhotos: [],
    services: [],
    openingHours: [],
    employees: [],
    owner: {},
  });
  const [filteredServices, setFilteredServices] = useState([]);
  const [coords, setCoords] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeServiceId, setActiveServiceId] = useState(null);
  const { businessId } = useParams();
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const [photoIndexForGalleryModal, setPhotoIndexForGalleryModal] =
    useState(null);

  const DESCRIPTION_PREVIEW_WORDS = 20;

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
        setAddress(`${data.postalCode} ${data.city}, ${data.address}`);
        setFilteredServices(data.services);
        console.log(data);
      } catch (err) {
        console.warn(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!address) return;
    const fetchCoords = async () => {
      try {
        const result = await getCoordsFromAddress(address);
        setCoords(result);
      } catch (err) {
        console.warn("Error while fetching coords:", err);
      }
    };

    fetchCoords();
  }, [address]);

  useEffect(() => {
    if (!businessData?.services) return;

    setFilteredServices(
      businessData.services.filter((service) =>
        service.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
    );
  }, [searchFilter]);

  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const onMouseDown = (e) => {
    isDown = true;
    scrollRef.current.classList.add("active");
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
    scrollRef.current.classList.remove("active");
  };

  const onMouseUp = () => {
    isDown = false;
    scrollRef.current.classList.remove("active");
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // prędkość scrolla
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  function RecenterMap({ coords }) {
    const map = useMap();
    useEffect(() => {
      if (coords) {
        map.setView(coords, map.getZoom());
      }
    }, [coords]);
    return null;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="manage-business-wrapper">
      <div className="manage-business-main">
        {businessData.profilePictureUrl != "" && (
          <img
            src={businessData.profilePictureUrl}
            alt="image"
            className={`business-profile-image ${
              businessData.businessPhotos.length > 0 && "many-photos"
            }`}
          />
        )}
        {businessData.businessPhotos.length > 0 && (
          <div className="business-image-gallery-wrapper">
            {businessData.businessPhotos.slice(0, 6).map((photo, index) => (
              <img
                key={index}
                src={photo.imageUrl}
                alt="image"
                className="business-image-gallery"
                onClick={() => {
                  setPhotoIndexForGalleryModal(index);
                }}
              />
            ))}
          </div>
        )}
        <div className="manage-business-main-header">
          <h1>{businessData.name}</h1>
          <p>
            {businessData.address +
              ", " +
              businessData.postalCode +
              ", " +
              businessData.city}
          </p>
        </div>
        <div className="manage-business-main-services">
          <div className="services-header">
            <h2>Services</h2>
            <div className="input-wrapper">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="input-icon"
              />
              <input
                type="text"
                placeholder="Search for service"
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="services">
            <hr className="divider" />
            {filteredServices.map((service) => (
              <div key={service.id}>
                {activeServiceId == service.id && (
                  <ServiceModal
                    service={service}
                    setActiveServiceId={setActiveServiceId}
                  />
                )}
                <div className="services-group">
                  <div className="name-desc">
                    <h4>{service.name}</h4>
                    <span>
                      {service.description &&
                        (service.description.split(" ").length > 10
                          ? service.description
                              .split(" ")
                              .slice(0, 10)
                              .join(" ") + "..."
                          : service.description)}
                    </span>
                    {service.description &&
                      service.description.split(" ").length > 10 && (
                        <div
                          className="services-group-button"
                          onClick={() => {
                            setActiveServiceId(service.id);
                          }}
                        >
                          <FontAwesomeIcon
                            className="circle-icon"
                            icon={faCircle}
                          />
                          <FontAwesomeIcon
                            className="circle-icon"
                            icon={faCircle}
                          />
                          <FontAwesomeIcon
                            className="circle-icon"
                            icon={faCircle}
                          />
                        </div>
                      )}
                  </div>
                  <div className="book-details">
                    <div className="price-duration">
                      <h4>{service.price.toFixed(2) + " zł"}</h4>
                      <span>{service.durationMinutes + "min"}</span>
                    </div>
                    <button>Book</button>
                  </div>
                </div>
                <hr className="divider" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <aside className="manage-business-aside">
        <div className="gift-cards">
          {/* to implement */}
          <h3>Gift cards</h3>
          <p>Looking for the perfect present? Explore available Gift Cards.</p>
          <button className="gift-cards-button">Show Gift Cards</button>
        </div>

        <MapContainer
          center={{ lat: 0, lng: 0 }}
          zoom={15}
          className="manage-business-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {coords && (
            <Marker position={coords}>
              <Popup>{businessData.name}</Popup>
            </Marker>
          )}
          <RecenterMap coords={coords} />
        </MapContainer>

        <div className="manage-business-aside-main">
          <div className="manage-business-about">
            <h4>About us</h4>
            <p
              className="about-text"
              onClick={() => {
                setShowMore((prev) => !prev);
              }}
            >
              {businessData.description &&
                (businessData.description.split(" ").length >
                DESCRIPTION_PREVIEW_WORDS
                  ? !showMore
                    ? businessData.description
                        .split(" ")
                        .slice(0, DESCRIPTION_PREVIEW_WORDS)
                        .join(" ") + "..."
                    : businessData.description
                  : businessData.description)}
            </p>
            {businessData.description &&
              businessData.description.length > 220 && (
                <span
                  className="show-more"
                  onClick={() => {
                    setShowMore((prev) => !prev);
                  }}
                >
                  {!showMore ? "Show more " : "Show less "}
                  <FontAwesomeIcon
                    icon={showMore ? faChevronUp : faChevronDown}
                  />
                </span>
              )}
          </div>
          <div className="manage-business-employees">
            <h4>Staff</h4>
            <div
              className="manage-business-employees-avatars"
              ref={scrollRef}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            >
              {businessData.employees.map((employee) => (
                <div className="employee-avatar-group" key={employee.id}>
                  {employee.imageUrl ? (
                    <img className="employee-avatar" src={employee.imageUrl} />
                  ) : (
                    <div className="employee-avatar-placeholder">
                      {employee.firstName?.slice(0, 1)}
                    </div>
                  )}
                  <label>{employee.firstName}</label>
                  {/* should htmlFor be added? */}
                </div>
              ))}
            </div>
          </div>
          <div className="manage-business-business-hours">
            <h4>Business hours</h4>
            {businessData.openingHours.map((day, idx) => (
              <div key={idx} className="business-hours-group">
                <p
                  className={
                    weekDays[today.getDay()] === day.dayOfWeek
                      ? "day-of-week-bold"
                      : ""
                  }
                >
                  {day.dayOfWeek}
                </p>
                <p
                  className={
                    weekDays[today.getDay()] === day.dayOfWeek
                      ? "day-of-week-bold"
                      : ""
                  }
                >
                  {day.isOpen
                    ? day.openTime.slice(0, 5) +
                      " - " +
                      day.closeTime.slice(0, 5)
                    : "Closed"}
                </p>
              </div>
            ))}
          </div>
          <div className="manage-business-details">
            <h4>Business details</h4>
            <p>
              {businessData.owner.firstName + " " + businessData.owner.lastName}
            </p>
            <div>
              <FontAwesomeIcon
                icon={faMobileScreen}
                style={{ color: "#959595" }}
              />
              <p>{businessData.phoneNumber}</p>
            </div>
            <div>
              <FontAwesomeIcon icon={faEnvelope} style={{ color: "#959595" }} />
              <p>{businessData.email}</p>
            </div>
          </div>
        </div>
      </aside>
      {photoIndexForGalleryModal != null && (
        <BusinessPhotosGallery
          photoIndexForGalleryModal={photoIndexForGalleryModal}
          setPhotoIndexForGalleryModal={setPhotoIndexForGalleryModal}
          photos={businessData.businessPhotos}
        />
      )}
    </div>
  );
}

export default ManageBusiness;
