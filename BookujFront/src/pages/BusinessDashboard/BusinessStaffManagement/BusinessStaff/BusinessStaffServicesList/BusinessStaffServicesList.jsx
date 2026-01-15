function BusinessStaffServicesList({
  filteredGroupedEmployeeServicesList,
  serviceFilter,
  setServiceFilter,
}) {
  return (
    <>
      <div className="business-staff-content-details-body-search-service form-group">
        <input
          id="searchServices"
          value={serviceFilter}
          type="text"
          placeholder=""
          onChange={(e) => {
            setServiceFilter(e.target.value);
          }}
        />
        <label htmlFor="searchServices">Search for a service</label>
      </div>
      <div className="business-staff-content-details-body-service-group-wrapper">
        {filteredGroupedEmployeeServicesList?.map((category) => (
          <div
            key={category.categoryId}
            className="business-staff-content-details-body-category-group"
          >
            <div className="business-staff-content-details-body-category-name">
              {category.categoryName}
            </div>
            {category.services?.map((service) => (
              <div
                className="business-staff-content-details-body-service-group"
                key={service.id}
              >
                <div
                  className="business-staff-content-details-body-service-group-name"
                  style={{ paddingLeft: "1em" }}
                >
                  <span>{service.name}</span>
                </div>
                <div className="business-staff-content-details-body-service-group-duration-price">
                  <span style={{ opacity: "50%", fontSize: "18px" }}>
                    {service.durationMinutes + "min"}
                  </span>
                  <span>{service.price.toFixed(2) + " zł"}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default BusinessStaffServicesList;
