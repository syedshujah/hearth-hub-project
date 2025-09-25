import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyGrid from "@/components/PropertyGrid";
import { dummyProperties } from "@/data/properties";

const PropertyListings = () => {
  const [filteredProperties, setFilteredProperties] = useState(dummyProperties);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Property Listings</h1>
            <p className="text-lg text-muted-foreground">
              Discover amazing properties for sale and rent
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <PropertyFilters 
                onFilterChange={setFilteredProperties}
                allProperties={dummyProperties}
              />
            </div>
            <div className="lg:col-span-3">
              <PropertyGrid properties={filteredProperties} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyListings;