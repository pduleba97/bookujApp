import { useEffect, useState } from "react";
import "./ManageBusinesses.css";
import { authFetch } from "../../api/authFetch";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBriefcase,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

function ManageBusinesses() {
  const [businessesList, setBusinessesList] = useState([]);
  const [businessesFilteredList, setBusinessesFilteredList] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedVisibilityFilter, setSelectedVisibilityFilter] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const list = await authFetch("/businesses/me", { method: "GET" });

        const data = await list.json();
        if (!list.ok) {
          throw new Error(data.error);
        }
        setBusinessesList(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    let filtered = [...businessesList];

    if (selectedVisibilityFilter === 1)
      filtered = filtered.filter((b) => b.isActive);
    else if (selectedVisibilityFilter === 2)
      filtered = filtered.filter((b) => !b.isActive);

    filtered = filtered.filter((business) =>
      business.name.toLowerCase().includes(searchFilter.toLowerCase()),
    );

    setBusinessesFilteredList(filtered);
  }, [businessesList, selectedVisibilityFilter, searchFilter]);

  async function handleDeleteBusiness(businessId) {
    try {
      const response = await authFetch(`/businesses/me/${businessId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      if (response.ok)
        setBusinessesList((prev) => prev.filter((b) => b.id !== businessId));
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className="manage-businesses-wrapper">
      <div className="manage-business-top">
        <h2>Your Businesses</h2>

        <Link to="/manage-businesses/add" className="manage-business-button">
          <div className="add-icon" />
          <p>Add business</p>
        </Link>
      </div>
      <div className="manage-business-header">
        <div className="manage-business-header-visible-filter">
          <p>Visibility:</p>
          <p
            style={{
              fontWeight: selectedVisibilityFilter == 0 ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedVisibilityFilter(0);
            }}
          >
            All {businessesList.length}
          </p>
          <p
            style={{
              fontWeight: selectedVisibilityFilter == 1 ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedVisibilityFilter(1);
            }}
          >
            Active {businessesList.filter((b) => b.isActive).length}
          </p>
          <p
            style={{
              fontWeight: selectedVisibilityFilter == 2 ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedVisibilityFilter(2);
            }}
          >
            Inactive {businessesList.filter((b) => !b.isActive).length}
          </p>
        </div>
        <div className="manage-business-header-input-wrapper">
          <input
            value={searchFilter}
            className="manage-business-header-input"
            type="text"
            placeholder="Search businesses"
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="manage-business-body">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>City</th>
              <th>Address</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {businessesFilteredList.map((business) => {
              return (
                <tr key={business.id}>
                  <td>{business.name}</td>
                  <td>{business.category}</td>
                  <td>{business.city}</td>
                  <td>{business.address}</td>
                  <td>{business.isActive ? <p>✅</p> : <p>❌</p>}</td>
                  <td className="manage-business-actions">
                    <Link
                      to={`/manage-businesses/business/${business.id}`}
                      className="manage-business-action"
                    >
                      <FontAwesomeIcon
                        icon={faBriefcase}
                        style={{ color: "#8f8f8fff" }}
                      />
                      <span>Enter Business</span>
                    </Link>
                    <Link
                      to={`/manage-businesses/preview/${business.id}`}
                      className="manage-business-action"
                    >
                      <FontAwesomeIcon
                        icon={faHouse}
                        style={{ color: "#8f8f8fff" }}
                      />
                      <span>Preview Business</span>
                    </Link>

                    <div
                      className="manage-business-action"
                      onClick={() => {
                        handleDeleteBusiness(business.id);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        style={{ color: "#8f8f8fff" }}
                      />
                      <span>Remove Business</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageBusinesses;
