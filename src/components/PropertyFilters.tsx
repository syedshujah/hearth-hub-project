import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Property } from "@/store/propertySlice";
import { Filter, X } from "lucide-react";

interface PropertyFiltersProps {
  onFilterChange: (properties: Property[]) => void;
  allProperties: Property[];
}

const PropertyFilters = ({ onFilterChange, allProperties }: PropertyFiltersProps) => {
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    features: [] as string[],
  });

  const [isOpen, setIsOpen] = useState(false);
  const locationHook = useLocation();

  const propertyTypes = ["house", "apartment", "condo", "villa"];
  const statusOptions = ["for-sale", "for-rent"];
  const bedroomOptions = ["1", "2", "3", "4", "5+"];
  const bathroomOptions = ["1", "2", "3", "4+"];
  
  // Extract unique features from all properties
  const allFeatures = Array.from(
    new Set(allProperties.flatMap(p => p.amenities || []))
  ).sort();

  const applyFilters = () => {
    let filtered = [...allProperties];

    if (filters.type) {
      filtered = filtered.filter(p => p.property_type === filters.type);
    }

    if (filters.status) {
      // For now, we'll just filter by approved status since that's what we have
      filtered = filtered.filter(p => p.status === 'approved');
    }

    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    const min = filters.minPrice ? Number(filters.minPrice) : undefined;
    const max = filters.maxPrice ? Number(filters.maxPrice) : undefined;
    if (min !== undefined) {
      filtered = filtered.filter(p => typeof p.price === 'number' && p.price >= min);
    }
    if (max !== undefined) {
      filtered = filtered.filter(p => typeof p.price === 'number' && p.price <= max);
    }

    if (filters.bedrooms) {
      const bedrooms = filters.bedrooms === "5+" ? 5 : parseInt(filters.bedrooms);
      filtered = filtered.filter(p => 
        filters.bedrooms === "5+" ? p.bedrooms >= bedrooms : p.bedrooms === bedrooms
      );
    }

    if (filters.bathrooms) {
      const bathrooms = filters.bathrooms === "4+" ? 4 : parseInt(filters.bathrooms);
      filtered = filtered.filter(p => 
        filters.bathrooms === "4+" ? p.bathrooms >= bathrooms : p.bathrooms === bathrooms
      );
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter(p => 
        filters.features.some(feature => p.amenities && p.amenities.includes(feature))
      );
    }

    onFilterChange(filtered);
  };

  // Initialize filters from URL query params (location, type, price)
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const qpLocation = params.get("location") || "";
    const qpType = params.get("type") || "";
    const qpPrice = params.get("price") || ""; // format: "min-max" or "min+"

    // Only update filters for provided params to avoid wiping user selections
    setFilters(prev => {
      let next = { ...prev };
      if (qpLocation) next.location = qpLocation;
      if (qpType) next.type = qpType;
      if (qpPrice) {
        const price = qpPrice.replace(/\s/g, "");
        if (price.includes("-")) {
          const [minStr, maxStr] = price.split("-");
          next.minPrice = minStr || "";
          next.maxPrice = maxStr || "";
        } else if (price.endsWith("+")) {
          next.minPrice = price.slice(0, -1);
          next.maxPrice = "";
        } else if (/^\d+$/.test(price)) {
          // Single number: treat as max price
          next.minPrice = "";
          next.maxPrice = price;
        }
      }
      return next;
    });
  }, [locationHook.search]);

  const clearFilters = () => {
    setFilters({
      type: "",
      status: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      features: [],
    });
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [filters, allProperties]);

  return (
    <div className="property-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        </div>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        {/* Property Type */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {status === "for-sale" ? "For Sale" : "For Rent"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            placeholder="Enter location"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
            />
            <Input
              placeholder="Max price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select value={filters.bedrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {bedroomOptions.map(count => (
                <SelectItem key={count} value={count}>
                  {count} {count === "1" ? "Bedroom" : "Bedrooms"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Select value={filters.bathrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select bathrooms" />
            </SelectTrigger>
            <SelectContent>
              {bathroomOptions.map(count => (
                <SelectItem key={count} value={count}>
                  {count} {count === "1" ? "Bathroom" : "Bathrooms"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <Label>Features</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allFeatures.slice(0, 8).map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={filters.features.includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                />
                <Label htmlFor={feature} className="text-sm font-normal">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;