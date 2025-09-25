import { Badge } from "@/components/ui/badge";
import { Property } from "@/data/properties";
import { Bed, Bath, Square, MapPin, Calendar, Tag } from "lucide-react";

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const formatPrice = (price: number) => {
    if (property.status === "for-rent") {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="property-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary mb-2">
              {formatPrice(property.price)}
            </div>
            <Badge className={property.status === "for-sale" ? "bg-success" : "bg-info"}>
              {property.status === "for-sale" ? "For Sale" : "For Rent"}
            </Badge>
          </div>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Bed className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{property.bedrooms}</div>
            <div className="text-sm text-muted-foreground">Bedrooms</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Bath className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{property.bathrooms}</div>
            <div className="text-sm text-muted-foreground">Bathrooms</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Square className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{property.area.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Sq Ft</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Tag className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{property.type}</div>
            <div className="text-sm text-muted-foreground">Type</div>
          </div>
        </div>

        {/* Date Added */}
        <div className="flex items-center pt-4 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Listed on {formatDate(property.dateAdded)}</span>
        </div>
      </div>

      {/* Description */}
      <div className="property-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
        <p className="text-muted-foreground leading-relaxed">{property.description}</p>
      </div>

      {/* Features */}
      <div className="property-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Features & Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {property.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="property-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Location</h2>
        <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive map will be integrated here</p>
            <p className="text-sm text-muted-foreground mt-1">
              Coordinates: {property.coordinates.lat}, {property.coordinates.lng}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;