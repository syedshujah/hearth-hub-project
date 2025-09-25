import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { dummyProperties } from "@/data/properties";

const LatestListings = () => {
  // Sort by date added and take the latest 4
  const latestProperties = [...dummyProperties]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Latest Listings
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the newest properties added to our platform. 
            Fresh opportunities for your perfect home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {latestProperties.map((property, index) => (
            <div 
              key={property.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/listings">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Browse All Listings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestListings;