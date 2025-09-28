import PropertyCard from "@/components/PropertyCard";
import { useAppSelector } from "@/store/hooks";
import { selectApprovedProperties } from "@/store/selectors";

interface RelatedPropertiesProps {
  currentPropertyId: string;
}

const RelatedProperties = ({ currentPropertyId }: RelatedPropertiesProps) => {
  const properties = useAppSelector(selectApprovedProperties);
  
  // Get related properties (excluding current property)
  const relatedProperties = properties
    .filter(property => property.id !== currentPropertyId)
    .slice(0, 3);

  return (
    <section className="property-card p-8">
      <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
        Related Properties
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProperties.map((property, index) => (
          <div 
            key={property.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProperties;