import "./BusinessStaffForm.css";
import { faUserTie, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Switch from "react-ios-switch";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../../../../utils/imageUtils";
import HandlePhotoModal from "../../../BusinessSettings/BusinessDetails/BusinessPhotos/HandlePhotoModal";
import PlaceholderCalendar from "../../../../../utils/PlaceholderCalendar";
import { authFetch } from "../../../../../api/authFetch";
import HandleAddStaffServicesModal from "./HandleAddStaffServicesModal";

function BusinessStaffForm({ mode }) {
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const { id, businessId } = useParams();
  const avatarInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    role: "Employee",
    position: "",
    description: "",
    employeeServices: [],
  });
  const [avatarPreview, setAvatarPreview] = useState();
  const [createAccount, setCreateAccount] = useState(false);

  const [currentImageFile, setCurrentImageFile] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppingFile, setCroppingFile] = useState(null);

  const [showPhotoMenuModal, setShowPhotoMenuModal] = useState(false);
  const [showAddServicesModal, setShowAddServicesModal] = useState(false);

  const roles = ["Owner", "Manager", "Employee", "Receptionist"];
  const emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$";

  useEffect(() => {
    const fetchStaff = async () => {
      if (isEdit) {
        const staff = await getStaffById(id);
        if (staff) {
          setFormData(staff);
          setAvatarPreview(staff.imageUrl);
          setCreateAccount(staff.email ? true : false);
        }
      }
    };
    fetchStaff();
  }, [id, isEdit]);

  async function getStaffById(id) {
    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/employees/${id}`,
        { method: "GET" }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

  function handleOnChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("File is too large. Maximum size is 4MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file!");
      return;
    }
    setCurrentImageFile(file);
    setCroppingFile(URL.createObjectURL(file));
    e.target.value = null;
  };

  async function handleCroppedImage() {
    const croppedImageBlob = await getCroppedImg(
      currentImageFile,
      croppedAreaPixels
    );
    const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
    setAvatarPreview(croppedImageUrl);
    setCurrentImageFile(croppedImageBlob);
    if (isEdit) {
      await addCroppedImage(croppedImageBlob, id);
      setCurrentImageFile(null);
      setCroppedAreaPixels(null);
    }
    setCroppingFile(null);
  }

  async function addCroppedImage(file, employeeId) {
    try {
      const form = new FormData();
      form.append("avatarFile", file);

      const response = await authFetch(
        `/businesses/me/${businessId}/employees/${employeeId}/avatar`,
        {
          method: "PUT",
          body: form,
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setAvatarPreview(data.imageUrl);
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      email: formData.email || null,
      phoneNumber: formData.phoneNumber || null,
      position: formData.position || null,
      description: formData.description || null,
    };

    let employeeId = null;

    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/employees${isEdit ? `/${id}` : ""}`,
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      employeeId = data.id;
      if (currentImageFile) {
        await addCroppedImage(currentImageFile, employeeId);
        setCurrentImageFile(null);
        setCroppedAreaPixels(null);
      }

      if (!isEdit) navigate(`/manage-businesses/business/${businessId}/staff`);
    } catch (err) {
      console.warn(err);
    }

    const selectedServicesIds = formData.employeeServices.map((es) => {
      return es.serviceId;
    });
    const servicesPayload = { serviceIds: selectedServicesIds };

    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/employees/${employeeId}/services`,
        {
          method: "PUT",
          body: JSON.stringify(servicesPayload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to assign services");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <form className="business-staff-form-wrapper" onSubmit={handleSubmit}>
      <div className="business-staff-form-header">
        <div className="business-staff-form-header-back">
          <Link to={`/manage-businesses/business/${businessId}/staff/`}>
            <FontAwesomeIcon
              icon={faXmark}
              style={{ fontSize: "36px", cursor: "pointer" }}
            />
          </Link>
          <h1>{isEdit ? "Edit employee" : "Add new employee"}</h1>
        </div>
        <div className="business-staff-form-header-save">
          <button type="submit">Save</button>
        </div>
      </div>
      <div className="business-staff-form-card">
        <div className="business-staff-form-employee">
          <div className="business-staff-form-employee-avatar">
            <input
              id="avatarImage"
              type="file"
              ref={avatarInputRef}
              onChange={async (e) => {
                handleFileInput(e);
              }}
              accept="image/*"
              style={{ display: "none" }}
            />

            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt=""
                className="business-staff-form-employee-avatar-body"
                onClick={() => {
                  setShowPhotoMenuModal(true);
                }}
              />
            ) : (
              <label
                htmlFor="avatarImage"
                className="business-staff-form-employee-avatar-body"
              >
                <FontAwesomeIcon
                  className="camera-icon"
                  icon={faUserTie}
                  style={{ fontSize: "36px" }}
                />
                <p>Add Avatar</p>
              </label>
            )}
          </div>

          <div className="form-group">
            <input
              value={formData.firstName ?? ""}
              id="firstName"
              placeholder=""
              required
              onChange={handleOnChange}
            />
            <label htmlFor="firstName">First name (required)</label>
          </div>

          <div className="form-group">
            <input
              value={formData.lastName ?? ""}
              id="lastName"
              placeholder=""
              required
              onChange={handleOnChange}
            />
            <label htmlFor="lastName">Last name (required)</label>
          </div>

          <div className="form-group">
            <input
              value={formData.phoneNumber ?? ""}
              id="phoneNumber"
              placeholder=""
              onChange={handleOnChange}
            />
            <label htmlFor="phoneNumber">Phone number</label>
          </div>

          <div className="form-group">
            <input
              id="email"
              value={formData.email ?? ""}
              disabled={!createAccount || formData.userId}
              type="email"
              pattern={emailRegex}
              className={`${
                (createAccount == false || formData.userId) && "email-disabled"
              }`}
              placeholder=""
              required={createAccount}
              onChange={handleOnChange}
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="business-staff-form-employee-switch-group">
            <div>
              <Switch
                id="business-staff-form-employee-switch-toggler"
                checked={createAccount}
                disabled={isEdit && formData.userId}
                onChange={() => {
                  setCreateAccount((prev) => !prev);
                  setFormData((prev) => ({ ...prev, email: "" }));
                }}
              />
            </div>

            <div>
              <h4>Create an account and invite an employee</h4>
              <p>
                We'll send an invitation to your employee so they can log in and
                manage their account.
              </p>
            </div>
          </div>

          <div className={`form-group ${formData.role != null && "has-value"}`}>
            <select
              value={formData.role ?? ""}
              id="role"
              placeholder=""
              required
              onChange={handleOnChange}
            >
              {roles.map((role, idx) => (
                <option key={idx} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <label htmlFor="role">Role</label>
          </div>

          <div className="form-group">
            <input
              value={formData.position ?? ""}
              id="position"
              placeholder=""
              onChange={handleOnChange}
            />
            <label htmlFor="position">Position</label>
          </div>

          <div className="form-group">
            <textarea
              value={formData.description ?? ""}
              id="description"
              placeholder=""
              onChange={handleOnChange}
            />
            <label htmlFor="position">Employee description</label>
          </div>
        </div>
        <div className="business-staff-form-services">
          <div className="business-staff-form-services-header">
            <div className="business-staff-form-services-header-services">
              Services
            </div>
          </div>

          {formData.employeeServices?.length == 0 ? (
            <div className="business-staff-form-services-body-empty">
              <PlaceholderCalendar />
              <p>Assign the services offered by the business to the employee</p>
              <div className="business-staff-form-services-body-empty-button-container">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddServicesModal(true);
                  }}
                >
                  Assign services
                </button>
              </div>
            </div>
          ) : (
            <div className="business-staff-form-services-body">
              <div>
                {formData.employeeServices?.map((service) => (
                  <div
                    className="business-staff-form-services-body-service-group"
                    key={service.id}
                  >
                    <div className="business-staff-form-services-body-service-group-name">
                      <span>{service.name}</span>
                    </div>
                    <div className="business-staff-form-services-body-service-group-duration-price">
                      <span style={{ opacity: "50%", fontSize: "18px" }}>
                        {service.durationMinutes + "min"}
                      </span>
                      <span>{service.price.toFixed(2) + " zł"}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="business-staff-form-services-body-button-container">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddServicesModal(true);
                  }}
                >
                  Edit services
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPhotoMenuModal && (
        <HandlePhotoModal
          openFilePicker={() => avatarInputRef.current?.click()}
          setShowModal={setShowPhotoMenuModal}
          selectedPhoto={"employeeAvatar"}
          setSelectedPhoto={null}
          businessId={businessId}
          setLogoPreview={null}
          setImagePreview={setAvatarPreview}
          employeeId={id}
        />
      )}

      {showAddServicesModal && (
        <HandleAddStaffServicesModal
          name={
            formData.firstName && formData.lastName
              ? `${formData.firstName + " " + formData.lastName}`
              : "Employee"
          }
          setShowAddServicesModal={setShowAddServicesModal}
          businessId={businessId}
          employeeId={id}
          employeeServices={formData.employeeServices}
          setFormData={setFormData}
        />
      )}

      {croppingFile && (
        <div className="crop-container-overlay">
          <div>
            <div className="crop-container-overlay-back">
              <FontAwesomeIcon
                icon={faXmark}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentImageFile(null);
                  setCroppedAreaPixels(null);
                  setCroppingFile(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
              />
              <p>Adjust</p>
            </div>
            <Cropper
              image={croppingFile}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              cropShape={"round"}
              onCropComplete={(croppedArea, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
            />
            <button
              type="button"
              className="crop-container-overlay-add-button"
              onClick={handleCroppedImage}
            >
              ADD
            </button>
            <p className="crop-container-overlay-info">
              Adjust the size of the grid to crop your image. You can also drag
              your photo to reposition it.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}

export default BusinessStaffForm;
