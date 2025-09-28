import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ManageUsers from "@/components/ManageUsers";
import ManageProperties from "@/components/ManageProperties";
import AnalyticsPage from "@/components/AnalyticsPage";
import AdminSettings from "@/components/AdminSettings";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
      case "settings":
        return <AdminSettings />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="property-card p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("users")}>
                <h3 className="text-lg font-semibold text-foreground mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-primary">2,547</p>
                <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
              </div>
              <div className="property-card p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("properties")}>
                <h3 className="text-lg font-semibold text-foreground mb-2">Total Properties</h3>
                <p className="text-3xl font-bold text-secondary">1,892</p>
                <p className="text-sm text-muted-foreground mt-2">+8% from last month</p>
              </div>
              <div className="property-card p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("properties")}>
                <h3 className="text-lg font-semibold text-foreground mb-2">Active Listings</h3>
                <p className="text-3xl font-bold text-success">1,634</p>
                <p className="text-sm text-muted-foreground mt-2">86% of total properties</p>
              </div>
              <div className="property-card p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("analytics")}>
                <h3 className="text-lg font-semibold text-foreground mb-2">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-warning">$45,230</p>
                <p className="text-sm text-muted-foreground mt-2">+15% from last month</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="property-card p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab("users")} 
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span>Manage Users</span>
                    <span className="text-sm text-muted-foreground">2,547 total</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("properties")} 
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span>Manage Properties</span>
                    <span className="text-sm text-muted-foreground">1,892 total</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("analytics")} 
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span>View Analytics</span>
                    <span className="text-sm text-muted-foreground">Real-time data</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("settings")} 
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span>System Settings</span>
                    <span className="text-sm text-muted-foreground">Configure platform</span>
                  </button>
                </div>
              </div>
              
              <div className="property-card p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New property approved</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Property pending review</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System backup completed</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute requireAdmin>
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
    </ProtectedRoute>
  );
};

export default AdminDashboard;