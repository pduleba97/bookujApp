import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Users from "./pages/Users/Users";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ManageBusinesses from "./pages/ManageBusinesses/ManageBusinesses";
import ManageBusiness from "./pages/ManageBusinesses/ManageBusiness";
import Profile from "./pages/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";
import CreateBusiness from "./pages/ManageBusinesses/CreateBusiness";
// import ServicesNavbar from "./components/ServicesNavbar/ServicesNavbar";
import BusinessDashboardLayout from "./pages/BusinessDashboard/BusinessDashboardLayout";
import BusinessDashboard from "./pages/BusinessDashboard/BusinessDashboard";
import BusinessSettings from "./pages/BusinessDashboard/BusinessSettings/BusinessSettings";
import BusinessServices from "./pages/BusinessDashboard/BusinessSettings/BusinessServices/BusinessServices";
import { Routes, Route, useLocation } from "react-router-dom";
import { getAccessToken, getUser } from "./api/sessionApi";
import { authRefresh } from "./api/authRefresh";
import "leaflet/dist/leaflet.css";
import BusinessDetails from "./pages/BusinessDashboard/BusinessSettings/BusinessDetails/BusinessDetails";
import BusinessGeneralInformation from "./pages/BusinessDashboard/BusinessSettings/BusinessDetails/BusinessGeneralInformation/BusinessGeneralInformation";
import BusinessCategory from "./pages/BusinessDashboard/BusinessSettings/BusinessDetails/BusinessCategory/BusinessCategory";
import BusinessPhotos from "./pages/BusinessDashboard/BusinessSettings/BusinessDetails/BusinessPhotos/BusinessPhotos";
import BusinessOpeningHours from "./pages/BusinessDashboard/BusinessSettings/BusinessDetails/BusinessOpeningHours/BusinessOpeningHours";
import BusinessStaffManagement from "./pages/BusinessDashboard/BusinessStaffManagement/BusinessStaffManagement";
import BusinessStaffForm from "./pages/BusinessDashboard/BusinessStaffManagement/BusinessStaff/BusinessStaffForm/BusinessStaffForm";
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith(
    "/manage-businesses/business/",
  );
  const [users, setUsers] = useState([
    { id: 1, name: "Piotr" },
    { id: 2, name: "Maciek" },
  ]);

  const [userData, setUserData] = useState(() => {
    const storedUser = getUser();
    return storedUser ? storedUser : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      let token = getAccessToken();
      if (!token) {
        try {
          await authRefresh();
          token = getAccessToken();
        } catch (err) {
          setIsLoggedIn(false);
          setUserData(null);
          return;
        }
      }
      setIsLoggedIn(!!token);
      setUserData(getUser());
    };
    initializeAuth();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar isLoggedIn={isLoggedIn} userData={userData} />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/users"
            element={<Users users={users} setUsers={setUsers} />}
          />
          <Route
            path="/login"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
            }
          />
          <Route
            path="/profile"
            element={<Profile setGeneralUserData={setUserData} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/manage-businesses" element={<ManageBusinesses />} />
          <Route path="/manage-businesses/add" element={<CreateBusiness />} />
          <Route
            path="/manage-businesses/preview/:businessId"
            element={<ManageBusiness />}
          />
          <Route
            path="/manage-businesses/business/:businessId/*"
            element={<BusinessDashboardLayout />}
          >
            <Route index element={<BusinessDashboard />} />
            <Route path="staff" element={<BusinessStaffManagement />} />
            <Route
              path="staff/add"
              element={<BusinessStaffForm mode="add" />}
            />
            <Route
              path="staff/edit/:id"
              element={<BusinessStaffForm mode="edit" />}
            />
            <Route path="settings" element={<BusinessSettings />} />
            <Route path="settings/services" element={<BusinessServices />} />
            <Route path="settings/details" element={<BusinessDetails />} />
            <Route
              path="settings/details/general-information"
              element={<BusinessGeneralInformation />}
            />{" "}
            <Route
              path="settings/details/category"
              element={<BusinessCategory />}
            />
            <Route
              path="settings/details/photos"
              element={<BusinessPhotos />}
            />
            <Route
              path="settings/details/opening-hours"
              element={<BusinessOpeningHours />}
            />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
