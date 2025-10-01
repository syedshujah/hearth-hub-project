import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectPropertiesByOwner, selectLastMessage } from "@/store/selectors";
import { updateProperty, deleteProperty, clearMessage } from "@/store/propertySlice";
import { Property, PropertyFormData } from "@/store/propertySlice";
import { updatePropertyWithNotification, deletePropertyWithNotification } from "@/store/propertyThunks";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { Search, Edit, Trash2, MapPin, Bed, Bath, Square, Calendar, Eye } from "lucide-react";

const ManagePropertiesRedux = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useLocalAuth();
  // Only pass user ID if authenticated, otherwise pass null to get empty array
  const properties = useAppSelector(selectPropertiesByOwner(isAuthenticated ? user?.id : null));
  const lastMessage = useAppSelector(selectLastMessage);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    property_type: "house" as 'house' | 'apartment' | 'condo' | 'villa',
    location: "",
    amenities: [] as string[],
  });

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesType = typeFilter === "all" || property.property_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle edit property
  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      property_type: property.property_type,
      location: property.location,
      amenities: property.amenities || [],
    });
    setIsEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingProperty) return;

    const updatedData: Partial<PropertyFormData> = {
      title: editForm.title,
      description: editForm.description,
      price: parseInt(editForm.price),
      bedrooms: parseInt(editForm.bedrooms),
      bathrooms: parseInt(editForm.bathrooms),
      area: parseInt(editForm.area),
      property_type: editForm.property_type,
      location: editForm.location,
      amenities: editForm.amenities,
    };

    dispatch(updatePropertyWithNotification({ 
      id: editingProperty.id, 
      data: updatedData,
      userId: user?.id || 'local-user'
    }));
    setIsEditDialogOpen(false);
    setEditingProperty(null);
  };

  // Handle delete property
  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (propertyToDelete) {
      dispatch(deletePropertyWithNotification({ 
        id: propertyToDelete.id,
        userId: user?.id || 'local-user'
      }));
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  // Listen to Redux messages
  useEffect(() => {
    if (lastMessage.type && lastMessage.message) {
      toast({
        title: lastMessage.type === 'success' ? 'Success' : 'Error',
        description: lastMessage.message,
        variant: lastMessage.type === 'error' ? 'destructive' : 'default',
      });
      // Clear the message after showing it
      dispatch(clearMessage());
    }
  }, [lastMessage, toast, dispatch]);

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

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  // Show authentication required message if user is not signed in
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Authentication Required</h3>
            <p className="text-muted-foreground">
              Please sign in to view and manage your property listings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Manage Properties ({filteredProperties.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Properties List */}
          <div className="space-y-4">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No properties found.</p>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Property Image */}
                      <div className="lg:w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={property.images && property.images.length > 0 
                            ? property.images[0] 
                            : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
                          }
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Property Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{property.title}</h3>
                              <Badge className={`${getStatusColor(property.status)} text-white border-0`}>
                                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-muted-foreground mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{property.location}</span>
                            </div>

                            <div className="text-2xl font-bold text-primary mb-3">
                              {formatPrice(property.price)}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                <span>{property.views} views</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Added {new Date(property.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProperty(property)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProperty(property)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update the property details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select 
                  value={editForm.property_type} 
                  onValueChange={(value: 'house' | 'apartment' | 'condo' | 'villa') => 
                    setEditForm(prev => ({ ...prev, property_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                <Input
                  id="edit-bedrooms"
                  type="number"
                  value={editForm.bedrooms}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bedrooms: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                <Input
                  id="edit-bathrooms"
                  type="number"
                  value={editForm.bathrooms}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bathrooms: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-area">Area (sq ft)</Label>
                <Input
                  id="edit-area"
                  type="number"
                  value={editForm.area}
                  onChange={(e) => setEditForm(prev => ({ ...prev, area: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{propertyToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManagePropertiesRedux;
