import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ManageUsers from "@/components/ManageUsers";
import ManageProperties from "@/components/ManageProperties";
import AnalyticsPage from "@/components/AnalyticsPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <ManageUsers />;
      case "properties":
        return <ManageProperties />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="property-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-primary">2,547</p>
              </div>
              <div className="property-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Total Properties</h3>
                <p className="text-3xl font-bold text-secondary">1,892</p>
              </div>
              <div className="property-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Active Listings</h3>
                <p className="text-3xl font-bold text-success">1,634</p>
              </div>
              <div className="property-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-warning">$45,230</p>
              </div>
            </div>
            <div className="property-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Admin Dashboard</h3>
              <p className="text-muted-foreground">
                Monitor platform activity, manage users and properties, and view detailed analytics.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1">
          <DashboardHeader title="Admin Dashboard" />
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;