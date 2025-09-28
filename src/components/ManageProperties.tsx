import { useState } from "react";
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
import { Search, Edit, Trash2, Check, X, Eye, MapPin, Bed, Bath, Square, Calendar, User } from "lucide-react";

interface PropertyData {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: "Approved" | "Pending" | "Rejected";
  owner: string;
  dateAdded: string;
  views: number;
  images: string[];
  description: string;
}

const ManageProperties = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(null);
  
  const [properties, setProperties] = useState<PropertyData[]>([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "Manhattan, NY",
      price: 850000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      type: "apartment",
      status: "Approved",
      owner: "John Doe",
      dateAdded: "2024-01-20",
      views: 234,
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop"],
      description: "Beautiful modern apartment in the heart of Manhattan with stunning city views."
    },
    {
      id: 2,
      title: "Suburban Family House",
      location: "Austin, TX",
      price: 450000,
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      type: "house",
      status: "Pending",
      owner: "Jane Smith",
      dateAdded: "2024-01-18",
      views: 89,
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop"],
      description: "Spacious family home with large backyard and modern amenities."
    },
    {
      id: 3,
      title: "Luxury Beach Villa",
      location: "Miami, FL",
      price: 1200000,
      bedrooms: 5,
      bathrooms: 4,
      area: 4200,
      type: "villa",
      status: "Rejected",
      owner: "Bob Wilson",
      dateAdded: "2024-01-15",
      views: 456,
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop"],
      description: "Stunning beachfront villa with private pool and ocean views."
    },
    {
      id: 4,
      title: "Downtown Condo",
      location: "Seattle, WA",
      price: 320000,
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      type: "condo",
      status: "Approved",
      owner: "Alice Johnson",
      dateAdded: "2024-01-12",
      views: 167,
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop"],
      description: "Cozy downtown condo perfect for young professionals."
    }
  ]);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (propertyId: number, newStatus: "Approved" | "Pending" | "Rejected") => {
    setProperties(prev => prev.map(property => 
      property.id === propertyId 
        ? { ...property, status: newStatus }
        : property
    ));
    const property = properties.find(p => p.id === propertyId);
    toast({
      title: `Property ${newStatus}`,
      description: `${property?.title} has been ${newStatus.toLowerCase()} successfully.`,
    });
  };

  const handleDeleteProperty = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    setProperties(prev => prev.filter(property => property.id !== propertyId));
    toast({
      title: "Property Deleted",
      description: `${property?.title} has been removed from the system.`,
      variant: "destructive"
    });
  };

  const handleEditProperty = (property: PropertyData) => {
    setProperties(prev => prev.map(p => p.id === property.id ? property : p));
    setEditingProperty(null);
    toast({
      title: "Property Updated",
      description: `${property.title} has been updated successfully.`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved": return "default";
      case "Pending": return "secondary";
      case "Rejected": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Manage Properties</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{filteredProperties.length} properties found</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="property-card">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search Properties</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, location, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filter by Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
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
            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setStatusFilter("Pending")}>
                  Pending ({properties.filter(p => p.status === "Pending").length})
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="property-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1">
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="w-full md:w-32 h-32 object-cover rounded-lg" 
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{property.location}</span>
                        </div>
                        <div className="text-2xl font-bold text-primary mt-1">
                          ${property.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.bathrooms} baths</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Square className="w-4 h-4" />
                        <span>{property.area} sq ft</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Owner: {property.owner}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Added: {property.dateAdded}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{property.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 lg:ml-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(property.status)}>{property.status}</Badge>
                    <Badge variant="outline">{property.type}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {property.status === "Pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(property.id, "Approved")}
                          className="text-success hover:text-success"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(property.id, "Rejected")}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {property.status === "Rejected" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(property.id, "Approved")}
                        className="text-success hover:text-success"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingProperty(property)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Property</DialogTitle>
                          <DialogDescription>Update property information and details.</DialogDescription>
                        </DialogHeader>
                        {editingProperty && (
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Property Title</Label>
                                <Input
                                  value={editingProperty.title}
                                  onChange={(e) => setEditingProperty(prev => prev ? { ...prev, title: e.target.value } : null)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                  value={editingProperty.location}
                                  onChange={(e) => setEditingProperty(prev => prev ? { ...prev, location: e.target.value } : null)}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Price ($)</Label>
                                <Input
                                  type="number"
                                  value={editingProperty.price}
                                  onChange={(e) => setEditingProperty(prev => prev ? { ...prev, price: parseInt(e.target.value) } : null)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Bedrooms</Label>
                                <Input
                                  type="number"
                                  value={editingProperty.bedrooms}
                                  onChange={(e) => setEditingProperty(prev => prev ? { ...prev, bedrooms: parseInt(e.target.value) } : null)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Bathrooms</Label>
                                <Input
                                  type="number"
                                  value={editingProperty.bathrooms}
                                  onChange={(e) => setEditingProperty(prev => prev ? { ...prev, bathrooms: parseInt(e.target.value) } : null)}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Area (sq ft)</Label>
                                <Input
                                  type="number"
                                  value={editingProperty.area}
                                  onChange={(e) => setEditingProperty(prev => prev ? { ...prev, area: parseInt(e.target.value) } : null)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={editingProperty.type} onValueChange={(value) => setEditingProperty(prev => prev ? { ...prev, type: value } : null)}>
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
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={editingProperty.description}
                                onChange={(e) => setEditingProperty(prev => prev ? { ...prev, description: e.target.value } : null)}
                                rows={3}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingProperty(null)}>Cancel</Button>
                          <Button onClick={() => editingProperty && handleEditProperty(editingProperty)}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Property</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{property.title}"? This action cannot be undone and will remove the property from all listings.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProperty(property.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Property
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="property-card">
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Properties Found</h3>
            <p className="text-muted-foreground">No properties match your current search and filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageProperties;
