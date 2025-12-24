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

  useEffect(() => {
    (async () => {
      try {
        const list = await authFetch("/businesses/me", { method: "GET" });

        const data = await list.json();
        if (!list.ok) {
          throw new Error(data.error);
        }
        setBusinessesList(data);
        setBusinessesFilteredList(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    setBusinessesFilteredList(
      businessesList.filter((business) =>
        business.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
    );
  }, [searchFilter, businessesList]);

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
        <div className="manage-business-header-subsription-filter">
          {/* This should enable filtering, decide in the future if the filtering feature is needed */}
          <p>Subscription:</p>
          <p>All {3}</p>
          <p>Active {2}</p>
          <p>Inactive {1}</p>
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
                  <td>{business.isActive == true ? <p>✅</p> : <p>❌</p>}</td>
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
