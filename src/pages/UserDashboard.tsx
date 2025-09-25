import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "@/components/UserSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AddPropertyForm from "@/components/AddPropertyForm";
import MyListings from "@/components/MyListings";
import SavedProperties from "@/components/SavedProperties";
import ProfileSettings from "@/components/ProfileSettings";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "add-property":
        return <AddPropertyForm />;
      case "my-listings":
        return <MyListings />;
      case "saved":
        return <SavedProperties />;
      case "profile":
        return <ProfileSettings />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="property-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Total Listings</h3>
                <p className="text-3xl font-bold text-primary">12</p>
              </div>
              <div className="property-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Active Views</h3>
                <p className="text-3xl font-bold text-secondary">1,248</p>
              </div>
              <div className="property-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Inquiries</h3>
                <p className="text-3xl font-bold text-success">67</p>
              </div>
            </div>
            <div className="property-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Welcome Back!</h3>
              <p className="text-muted-foreground">
                Manage your properties, view analytics, and connect with potential buyers.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1">
          <DashboardHeader title="User Dashboard" />
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;