import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { useAppSelector } from "@/store/hooks";
import { selectFeaturedProperties } from "@/store/selectors";

const FeaturedProperties = () => {
  const featuredProperties = useAppSelector(selectFeaturedProperties).slice(0, 3);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties that offer 
            exceptional value and stunning features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProperties.length > 0 ? (
            featuredProperties.map((property) => (
              <div key={property.id} className="animate-fade-in">
                <PropertyCard property={property} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No featured properties available. Add some properties to get started!
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/listings">
            <Button size="lg" className="px-8 py-3 text-lg">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;