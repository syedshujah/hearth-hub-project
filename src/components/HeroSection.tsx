import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import heroImage from "@/assets/hero-real-estate.jpg";

const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    type: "",
    priceRange: "",
  });

  const handleSearch = () => {
    // Navigate to listings with search parameters
    const params = new URLSearchParams();
    if (searchData.location) params.append("location", searchData.location);
    if (searchData.type) params.append("type", searchData.type);
    if (searchData.priceRange) params.append("price", searchData.priceRange);
    
    window.location.href = `/listings?${params.toString()}`;
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Beautiful real estate properties" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="block text-secondary"> Dream Home</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            Discover thousands of beautiful properties for sale and rent. 
            Your perfect home is just a search away.
          </p>

          {/* Search Bar */}
          <div className="property-card p-6 max-w-4xl mx-auto animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter location..."
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10 h-12"
                />
              </div>
              
              <Select value={searchData.type} onValueChange={(value) => setSearchData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="h-12">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Property Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={searchData.priceRange} onValueChange={(value) => setSearchData(prev => ({ ...prev, priceRange: value }))}>
                <SelectTrigger className="h-12">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Price Range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100000">$0 - $100K</SelectItem>
                  <SelectItem value="100000-500000">$100K - $500K</SelectItem>
                  <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                  <SelectItem value="1000000+">$1M+</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} className="h-12 text-lg font-semibold">
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/80">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5K+</div>
              <div className="text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;