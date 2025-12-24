import { Outlet, useParams } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import "./BusinessDashboardLayout.css";

function BusinessDashboardLayout() {
  const { businessId } = useParams();
  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default BusinessDashboardLayout;
