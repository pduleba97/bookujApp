import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ServiceCategoryModal.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { authFetch } from "../../../../api/authFetch";

function ServiceCategoryModal({
  setShowServiceCategoryModal,
  businessId,
  setServiceCatgories,
}) {
  const [serviceCategory, setServiceCategory] = useState({
    name: "",
    description: "",
  });

  function handleOnChange(e) {
    setServiceCategory((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmitCategory(e) {
    e.preventDefault();

    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/servicecategory`,
        { method: "POST", body: JSON.stringify(serviceCategory) }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setServiceCatgories((prev) => [...prev, data]);
      setShowServiceCategoryModal(false);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className="service-category-modal-overview">
      <form
        onSubmit={handleSubmitCategory}
        className="service-category-modal-card"
      >
        <div className="service-category-modal-card-header">
          <div className="service-category-modal-card-header-title">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="service-modal-card-header-close"
              onClick={() => {
                setShowServiceCategoryModal(false);
              }}
            />
            <h1>Add Category</h1>
          </div>
          <p>
            Here you can add a custom category for your services. Description is
            optional and you'll be able to include it for this category at any
            moment.
          </p>
        </div>
        <div className="service-category-modal-card-body">
          <div className="form-group">
            <input
              type="text"
              value={serviceCategory.name}
              id="name"
              placeholder=""
              required
              onChange={handleOnChange}
            />
            <label htmlFor="name">Category name</label>
          </div>

          <div className="form-group">
            <textarea
              type="text"
              value={serviceCategory.description}
              id="description"
              placeholder=""
              onChange={handleOnChange}
            />
            <label htmlFor="description">Description</label>
          </div>
        </div>
        <div className="service-category-modal-card-button">
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

export default ServiceCategoryModal;
