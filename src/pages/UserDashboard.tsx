import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "@/components/UserSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AddPropertyForm from "@/components/AddPropertyForm";
import ManagePropertiesRedux from "@/components/ManagePropertiesRedux";
import SavedProperties from "@/components/SavedProperties";
import ProfileSettings from "@/components/ProfileSettings";
import { useAppSelector } from "@/store/hooks";
import { selectPropertiesByOwner } from "@/store/selectors";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

interface UserDashboardProps {
  initialTab?: string;
}

const UserDashboard = ({ initialTab }: UserDashboardProps) => {
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const { user, isAuthenticated } = useLocalAuth();
  // Only pass user ID if authenticated, otherwise pass null to get empty array
  const properties = useAppSelector(selectPropertiesByOwner(isAuthenticated ? user?.id : null));

  const renderContent = () => {
    switch (activeTab) {
      case "add-property":
        return <AddPropertyForm />;
      case "my-listings":
        return <ManagePropertiesRedux />;
      case "saved":
        return <SavedProperties />;
      case "profile":
        return <ProfileSettings />;
      default:
        return (
          <div className="space-y-6">
            {!isAuthenticated ? (
              <div className="property-card p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">Welcome to Your Dashboard</h3>
                <p className="text-muted-foreground">
                  Please sign in to view your property listings, manage your properties, and access dashboard features.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="property-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Total Listings</h3>
                    <p className="text-3xl font-bold text-primary">{properties.length}</p>
                  </div>
                  <div className="property-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Total Views</h3>
                    <p className="text-3xl font-bold text-secondary">
                      {properties.reduce((sum, prop) => sum + prop.views, 0)}
                    </p>
                  </div>
                  <div className="property-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Average Price</h3>
                    <p className="text-3xl font-bold text-success">
                      ${properties.length > 0 ? Math.round(properties.reduce((sum, prop) => sum + prop.price, 0) / properties.length).toLocaleString() : '0'}
                    </p>
                  </div>
                </div>
                <div className="property-card p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Welcome Back!</h3>
                  <p className="text-muted-foreground">
                    Manage your properties, view analytics, and connect with potential buyers.
                    {properties.length === 0 && " Start by adding your first property!"}
                  </p>
                </div>
              </>
            )}
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