import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Edit, Trash2, Eye, MapPin, Bed, Bath, Square } from "lucide-react";

const MyListings = () => {
  const { toast } = useToast();
  
  // Mock user listings data
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "Manhattan, NY",
      price: 3500,
      status: "for-rent",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
      views: 234,
      inquiries: 12,
      dateAdded: "2024-01-20"
    },
    {
      id: 2,
      title: "Suburban Family House",
      location: "Austin, TX",
      price: 450000,
      status: "for-sale",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop",
      views: 89,
      inquiries: 5,
      dateAdded: "2024-01-15"
    },
    {
      id: 3,
      title: "Luxury Beach Villa",
      location: "Miami, FL",
      price: 1200000,
      status: "for-sale",
      bedrooms: 5,
      bathrooms: 4,
      area: 4200,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop",
      views: 456,
      inquiries: 23,
      dateAdded: "2024-01-10"
    }
  ]);

  const formatPrice = (price: number, status: string) => {
    if (status === "for-rent") {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
  };

  const handleEdit = (id: number) => {
    toast({
      title: "Edit Property",
      description: "Edit functionality will be implemented.",
    });
  };

  const handleDelete = (id: number) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
    toast({
      title: "Property Deleted",
      description: "Your property has been removed from listings.",
      variant: "destructive"
    });
  };

  const handleView = (id: number) => {
    window.open(`/property/${id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My Property Listings</h2>
        <p className="text-muted-foreground">{listings.length} properties</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="property-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Property Image */}
                <div className="md:w-64 flex-shrink-0">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 md:h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Property Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {listing.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">
                        {formatPrice(listing.price, listing.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={listing.status === "for-sale" ? "bg-success" : "bg-info"}>
                        {listing.status === "for-sale" ? "For Sale" : "For Rent"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleView(listing.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Property
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(listing.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(listing.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center text-sm text-muted-foreground space-x-6 mb-4">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{listing.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{listing.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      <span>{listing.area} sq ft</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-6">
                      <div>
                        <span className="font-semibold text-primary">{listing.views}</span>
                        <span className="text-muted-foreground ml-1">views</span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary">{listing.inquiries}</span>
                        <span className="text-muted-foreground ml-1">inquiries</span>
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      Listed on {new Date(listing.dateAdded).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <div className="property-card p-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Listed</h3>
            <p className="text-muted-foreground mb-4">
              You haven't added any properties yet. Start by adding your first property.
            </p>
            <Button>Add Your First Property</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;