import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ServiceCategoryModal.css";
import { faArrowLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { authFetch } from "../../../../api/authFetch";

function EditServiceCategoryModal({
  setShowEditServiceCategoryModalId,
  businessId,
  serviceCategory,
  setServiceCategories,
  setSelectedCategoryId,
}) {
  const [newServiceCategory, setNewServiceCategory] = useState({
    id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    setNewServiceCategory(serviceCategory);
  }, []);

  function handleOnChange(e) {
    setNewServiceCategory((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmitCategory(e) {
    e.preventDefault();

    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/servicecategory/${serviceCategory.id}`,
        { method: "PUT", body: JSON.stringify(newServiceCategory) },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setServiceCategories((prev) =>
        prev.map((sc) =>
          sc.id === serviceCategory.id ? newServiceCategory : sc,
        ),
      );

      setShowEditServiceCategoryModalId(null);
    } catch (err) {
      console.warn(err);
    }
  }

  async function onDelete() {
    try {
      const response = await authFetch(
        `/businesses/me/${businessId}/servicecategory/${serviceCategory.id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setServiceCategories((prev) =>
        prev.filter((sc) => sc.id !== serviceCategory.id),
      );

      setSelectedCategoryId(-1);
      setShowEditServiceCategoryModalId(null);
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
                setShowEditServiceCategoryModalId(null);
              }}
            />
            <h1>Edit Category</h1>
          </div>
          <p>
            Here you can edit your custom category for your services.
            Description is optional and you are able to include it for this
            category at any moment.
          </p>
        </div>
        <div className="service-category-modal-card-body">
          <div className="form-group">
            <input
              type="text"
              value={newServiceCategory.name}
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
              value={newServiceCategory.description}
              id="description"
              placeholder=""
              onChange={handleOnChange}
            />
            <label htmlFor="description">Description</label>
          </div>
        </div>
        <div className="service-category-modal-card-buttons">
          <button
            className="button-bookuj service-category-modal-card-button-category-remove-box"
            onClick={() => {
              onDelete();
            }}
          >
            <FontAwesomeIcon
              className="service-category-modal-card-button-category-remove-box-icon"
              icon={faTrashCan}
            />
          </button>
          <button
            type="submit"
            className="button-bookuj service-category-modal-card-button-category-add-button"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditServiceCategoryModal;
