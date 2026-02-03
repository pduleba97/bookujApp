import { useState, useEffect } from "react";
import { authFetch } from "../../api/authFetch";
import "./Profile.css";
import { setAccessToken, setUser } from "../../api/sessionApi";
import { reduceImageSize } from "../../utils/imageUtils";
import { toast } from "react-toastify";

function Profile({
  // userData, setUserData
  setGeneralUserData,
}) {
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [userEditFormData, setUserEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const responseUser = await authFetch("/users/me", {
          method: "GET",
        });

        if (responseUser.status === 401) {
          throw new Error("Unauthorized");
        } else if (responseUser.status === 404) {
          throw new Error("User not found");
        } else {
          const data = await responseUser.json();
          setUserData(data);
          setAvatarUrl(data.imageUrl);
          console.log(data);
        }
      } catch (err) {
        console.warn(`${err}`);
      }
    })();
  }, []);

  if (!userData.firstName) return <p>Loading profile...</p>;

  const isPhoneValid = /^\+?\d{7,14}$/.test(userEditFormData.phoneNumber);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    userEditFormData.email,
  );
  const isNameValid = /^[A-Za-zÀ-ÖØ-öø-ÿĄąĆćĘęŁłŃńÓóŚśŹźŻż -]+$/.test(
    userEditFormData.firstName,
  );
  const isLastNameValid = /^[A-Za-zÀ-ÖØ-öø-ÿĄąĆćĘęŁłŃńÓóŚśŹźŻż -]+$/.test(
    userEditFormData.lastName,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      if (!/^\+?\d*$/.test(value)) return; // tylko cyfry
      if (value.length > 14) return; // max 9
    }
    setUserEditFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveEditButton = async (editMode) => {
    if (!editMode) {
      setUserEditFormData(userData);
      setEditMode(true);
    } else {
      const formData = new FormData();
      for (const key in userEditFormData) {
        if (userEditFormData[key] !== "") {
          formData.append(key, userEditFormData[key]);
        }
      }
      const fileInput = document.getElementById("avatar");
      if (fileInput.files.length > 0) {
        const reducedFile = await reduceImageSize(
          fileInput.files[0],
          240,
          240,
          true,
        );
        formData.append("file", reducedFile);
      }
      try {
        const userEditResponse = await authFetch(`/users/me/personalData`, {
          method: "PATCH",
          body: formData,
        });
        if (!userEditResponse.ok) {
          const err = await userEditResponse.json();
          throw new Error(err.error);
        } else {
          const data = await userEditResponse.json();
          setUserData(userEditFormData);
          if (data.data.imageUrl != null) {
            setAvatarUrl(data.data.imageUrl);
          }
          console.log(data.data.imageUrl);
        }
      } catch (err) {
        console.warn({ err });
      }
      setEditMode(false);
    }
  };

  const handleCancelButton = () => {
    setUserEditFormData(userData);
    setEditMode(false);
    setAvatarPreview(null);
  };

  async function handleToggleOwnerRole() {
    const newRole = userData.role === "Owner" ? "Client" : "Owner";

    try {
      const responseEditRole = await authFetch("/users/editRole", {
        method: "PUT",
        body: JSON.stringify(newRole),
      });

      const data = await responseEditRole.json();

      if (!responseEditRole.ok) {
        throw new Error(data.error);
      }

      setUserData((prev) => ({ ...prev, role: newRole }));
      setUser(data.userData);
      setAccessToken(data.accessToken);
      setGeneralUserData((prev) => ({ ...prev, role: newRole }));

      toast.success(
        `Your account status has been successfully changed to ${newRole}`,
      );
    } catch (err) {
      console.warn(err);
      toast.error(err.message);
    }
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  return (
    <>
      <div className="profile-wrapper">
        <div className="profile-header">
          <h2 className="profile-header-head-name">My Profile</h2>
          <div className="profile-header-head">
            <div className="profile-avatar">
              {editMode === false ? (
                <img
                  className="profile-avatar-img"
                  src={avatarUrl ? avatarUrl : "/images/default-avatar.png"}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/default-avatar.png";
                  }}
                />
              ) : (
                <>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                  <label className="profile-avatar-label" htmlFor="avatar">
                    <img
                      className="profile-avatar-img-edit"
                      src={
                        avatarPreview !== null
                          ? avatarPreview
                          : avatarUrl
                            ? avatarUrl
                            : ""
                      }
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "";
                      }}
                      alt=""
                    />
                  </label>
                </>
              )}
            </div>
            <div className="profile-header-head-body">
              <p className="profile-header-head-body-name">
                {userData.firstName} {userData.lastName}
              </p>
              <p>{userData.role}</p>
            </div>
          </div>
        </div>

        <div className="profile-mid">
          <div
            className={`profile-mid-header ${
              editMode === false ? "two-items" : "three-items"
            }`}
          >
            <h3 className="profile-mid-header-name">Personal Information</h3>
            <button
              className="button-bookuj button-edit-profile"
              disabled={
                editMode &&
                (!isPhoneValid ||
                  !isEmailValid ||
                  !isNameValid ||
                  !isLastNameValid)
              }
              onClick={() => handleSaveEditButton(editMode)}
            >
              {editMode ? "Save" : "Edit"}
              <div className="button-edit-profile-icon" />
            </button>
            {editMode && (
              <button
                className="button-bookuj button-edit-profile"
                onClick={() => handleCancelButton()}
              >
                Cancel
                <div className="button-cancel-profile-icon" />
              </button>
            )}
          </div>
          <div className="profile-mid-body">
            <div className="profile-mid-body-firstName">
              <p className="columnName">First Name</p>
              {editMode ? (
                <div>
                  <input
                    className="profile-edit-input"
                    type="text"
                    name="firstName"
                    value={userEditFormData.firstName}
                    onChange={handleChange}
                  />
                  {!isNameValid && (
                    <p className="input-error-message">Name is invalid</p>
                  )}
                </div>
              ) : (
                <p id="user-profile-firstName">{userData.firstName}</p>
              )}
            </div>
            <div className="profile-mid-body-lastName">
              <p className="columnName">Last Name</p>
              {editMode ? (
                <div>
                  <input
                    className="profile-edit-input"
                    type="text"
                    name="lastName"
                    value={userEditFormData.lastName}
                    onChange={handleChange}
                  />
                  {!isLastNameValid && (
                    <p className="input-error-message">Last name is invalid</p>
                  )}
                </div>
              ) : (
                <p id="user-profile-lastName">{userData.lastName}</p>
              )}
            </div>
            <div className="profile-mid-body-email">
              <p className="columnName">Email</p>
              {editMode ? (
                <div>
                  <input
                    className={`profile-edit-input ${
                      !isEmailValid ? "input-error" : ""
                    }`}
                    type="text"
                    name="email"
                    value={userEditFormData.email}
                    onChange={handleChange}
                  />
                  {!isEmailValid && (
                    <p className="input-error-message">Invalid email address</p>
                  )}
                </div>
              ) : (
                <p id="user-profile-email">{userData.email}</p>
              )}
            </div>
            <div className="profile-mid-body-phone">
              <p className="columnName">Phone</p>
              {editMode ? (
                <div>
                  <input
                    className={`profile-edit-input ${
                      !isPhoneValid ? "input-error" : ""
                    }`}
                    type="text"
                    name="phoneNumber"
                    value={userEditFormData.phoneNumber}
                    onChange={handleChange}
                  />
                  {!isPhoneValid && (
                    <p className="input-error-message">
                      Phone number has to have between 7 and 14 digits
                    </p>
                  )}
                </div>
              ) : (
                <p id="user-profile-phoneNumber">{userData.phoneNumber}</p>
              )}
            </div>
            <div className="profile-mid-body-role">
              <p className="columnName">Role</p>
              <p id="user-profile-role">{userData.role}</p>
            </div>
          </div>
        </div>
        <div className="profile-mid">
          <button
            id="user-profile-change-role-button"
            className={`button-bookuj button-become-owner ${
              userData.role === "Owner" && "button-remove-owner"
            } `}
            onClick={handleToggleOwnerRole}
          >
            {userData.role !== "Owner"
              ? "Change account status to business owner"
              : "Remove business owner status"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
