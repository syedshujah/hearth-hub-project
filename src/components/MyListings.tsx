import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProperties, deleteProperty, Property } from "@/services/propertyService";
import { MoreHorizontal, Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Loader2 } from "lucide-react";

const MyListings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getUserProperties();
        
        if (error) {
          toast({
            title: "Error Loading Properties",
            description: error,
            variant: "destructive"
          });
          return;
        }

        if (data) {
          setListings(data);
        }
      } catch (error) {
        toast({
          title: "Error Loading Properties",
          description: "Failed to fetch your properties",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [user, toast]);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Property",
      description: "Edit functionality will be implemented.",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteProperty(id);
      
      if (error) {
        toast({
          title: "Error Deleting Property",
          description: error,
          variant: "destructive"
        });
        return;
      }

      setListings(prev => prev.filter(listing => listing.id !== id));
      toast({
        title: "Property Deleted",
        description: "Your property has been removed from listings.",
      });
    } catch (error) {
      toast({
        title: "Error Deleting Property",
        description: "Failed to delete property",
        variant: "destructive"
      });
    }
  };

  const handleView = (id: string) => {
    window.open(`/property/${id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="property-card p-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">Sign In Required</h3>
          <p className="text-muted-foreground mb-4">
            Please sign in to view your property listings.
          </p>
        </div>
      </div>
    );
  }

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
                    src={listing.images && listing.images.length > 0 ? listing.images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop"}
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
                        {formatPrice(listing.price)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(listing.status)}
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
                        <span className="font-semibold text-primary">{listing.views || 0}</span>
                        <span className="text-muted-foreground ml-1">views</span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary">0</span>
                        <span className="text-muted-foreground ml-1">inquiries</span>
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      Listed on {new Date(listing.created_at).toLocaleDateString()}
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