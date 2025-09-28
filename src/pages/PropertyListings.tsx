import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyGrid from "@/components/PropertyGrid";
import { useAppSelector } from "@/store/hooks";
import { selectApprovedProperties, selectLoading } from "@/store/selectors";
import { Property } from "@/store/propertySlice";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const PropertyListings = () => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const properties = useAppSelector(selectApprovedProperties);
  const loading = useAppSelector(selectLoading);
  const { toast } = useToast();

  useEffect(() => {
    // Set initial filtered properties when properties change
    setFilteredProperties(properties);
    
    if (properties.length === 0 && !loading) {
      toast({
        title: "No Properties Found",
        description: "No properties are currently available. Try adding some properties first.",
      });
    }
  }, [properties, loading, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-4">Property Listings</h1>
                <p className="text-lg text-muted-foreground">
                  Discover amazing properties for sale and rent ({properties.length} properties available)
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <PropertyFilters 
                    onFilterChange={setFilteredProperties}
                    allProperties={properties}
                  />
                </div>
                <div className="lg:col-span-3">
                  <PropertyGrid properties={filteredProperties} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyListings;