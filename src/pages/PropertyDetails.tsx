import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";
import PropertyInfo from "@/components/PropertyInfo";
import AgentCard from "@/components/AgentCard";
import RelatedProperties from "@/components/RelatedProperties";
import { dummyProperties } from "@/data/properties";

const PropertyDetails = () => {
  const { id } = useParams();
  const property = dummyProperties.find(p => p.id === parseInt(id || "0"));

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
              <AgentCard agent={property.agent} />
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