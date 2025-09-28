import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";
import PropertyInfo from "@/components/PropertyInfo";
import AgentCard from "@/components/AgentCard";
import RelatedProperties from "@/components/RelatedProperties";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectPropertyById } from "@/store/selectors";
import { incrementViews } from "@/store/propertySlice";

const PropertyDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const property = useAppSelector(state => selectPropertyById(id || "")(state));
  const allProperties = useAppSelector(state => state.properties.properties);

  useEffect(() => {
    if (property && id) {
      dispatch(incrementViews(property.id));
    }
  }, [dispatch, id]); // Only depend on dispatch and id, not property

  // Debug information (only log once when property is found)
  useEffect(() => {
    if (property) {
      console.log("PropertyDetails Debug:", {
        id,
        property,
        allPropertiesCount: allProperties.length,
        allPropertyIds: allProperties.map(p => p.id)
      });
    }
  }, [id]); // Only log when ID changes

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Property Not Found</h1>
            <p className="text-lg text-muted-foreground">
              The property you're looking for doesn't exist.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <p><strong>Requested ID:</strong> {id}</p>
              <p><strong>Total Properties:</strong> {allProperties.length}</p>
              <p><strong>Available IDs:</strong></p>
              <ul className="text-sm">
                {allProperties.map(p => (
                  <li key={p.id} className="font-mono">{p.id} - {p.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PropertyImageCarousel images={property.images} />
              <PropertyInfo property={property} />
            </div>
            <div className="lg:col-span-1">
              {/* Contact Information Card */}
              <div className="property-card p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                {(property.contact_name || property.contact_email || property.contact_phone) ? (
                  <div className="space-y-4">
                    {property.contact_name && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {property.contact_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{property.contact_name}</p>
                          <p className="text-sm text-muted-foreground">Property Owner</p>
                        </div>
                      </div>
                    )}
                    
                    {property.contact_email && (
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <a 
                          href={`mailto:${property.contact_email}`}
                          className="text-primary hover:underline"
                        >
                          {property.contact_email}
                        </a>
                      </div>
                    )}
                    
                    {property.contact_phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-muted-foreground">Phone:</span>
                        <a 
                          href={`tel:${property.contact_phone}`}
                          className="text-primary hover:underline"
                        >
                          {property.contact_phone}
                        </a>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-3">
                        Interested in this property? Get in touch!
                      </p>
                      <div className="space-y-2">
                        {property.contact_email && (
                          <button 
                            onClick={() => window.open(`mailto:${property.contact_email}?subject=Inquiry about ${property.title}`, '_blank')}
                            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                          >
                            Send Email
                          </button>
                        )}
                        {property.contact_phone && (
                          <button 
                            onClick={() => window.open(`tel:${property.contact_phone}`, '_blank')}
                            className="w-full border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors text-sm"
                          >
                            Call Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    For more information about this property, please contact us.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-16">
            <RelatedProperties currentPropertyId={property.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetails;