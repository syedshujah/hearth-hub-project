import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bed, Bath, Square, MapPin, Star } from "lucide-react";
import { Property } from "@/store/propertySlice";
import { useEffect, useState } from "react";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const storageKey = "savedPropertyIds";
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const ids: string[] = JSON.parse(raw);
      setIsSaved(ids.includes(property.id));
    } catch {}
  }, [property.id]);

  const toggleSave = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      let next: string[];
      if (ids.includes(property.id)) {
        next = ids.filter((id) => id !== property.id);
        setIsSaved(false);
      } else {
        next = [...ids, property.id];
        setIsSaved(true);
      }
      localStorage.setItem(storageKey, JSON.stringify(next));
      // Notify listeners that saved properties changed
      try {
        window.dispatchEvent(new Event("saved-properties-changed"));
      } catch {}
    } catch {}
  };

  const formatPrice = (price: number) => {
    // For now, just show the price as is since we don't have status in our simplified schema
    return `$${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-500";
      case 'pending':
        return "bg-yellow-500";
      case 'rejected':
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="property-card group cursor-pointer">
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"} 
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`${getStatusColor(property.status)} text-white border-0`}>
            {property.status === "approved" ? "Available" : property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-warning text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Heart Icon */}
        <button
          className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave();
          }}
          aria-label={isSaved ? "Remove from saved" : "Save property"}
        >
          <Heart
            className={`w-4 h-4 ${isSaved ? "text-destructive" : "text-muted-foreground"}`}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="p-6">
        {/* Price */}
        <div className="text-2xl font-bold text-primary mb-3">
          {formatPrice(property.price)}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.area} sq ft</span>
          </div>
        </div>

        {/* View Details Button */}
        <Link to={`/property/${property.id}`}>
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;