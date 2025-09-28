import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createProperty } from "@/services/propertyServiceRedux";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectLastMessage } from "@/store/selectors";
import { createPropertyWithNotification } from "@/store/propertyThunks";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { Upload, ImagePlus, X, Trash2 } from "lucide-react";

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    status: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    features: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user, profile } = useLocalAuth();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastMessage = useAppSelector(selectLastMessage);

  const propertyTypes = ["house", "apartment", "condo", "villa"];
  const statusOptions = ["for-sale", "for-rent"];
  const availableFeatures = [
    "Swimming Pool", "Garage", "Garden", "Security System", "Modern Kitchen",
    "Walk-in Closet", "Balcony", "Fireplace", "Hardwood Floors", "City View"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.type || !formData.price || 
          !formData.location || !formData.bedrooms || !formData.bathrooms || 
          !formData.area || !formData.description) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Prepare property data
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        property_type: formData.type as 'house' | 'apartment' | 'condo' | 'villa',
        location: formData.location,
        address: formData.location,
        latitude: null,
        longitude: null,
        amenities: formData.features,
        images: previews, // Use the preview URLs as images
      };

      // Create property using Redux with notification
      try {
        await dispatch(createPropertyWithNotification({
          propertyData,
          userId: user?.id || 'local-user',
          userProfile: profile
        })).unwrap();

        // Success toast
        toast({
          title: "Property Added Successfully!",
          description: `Your property "${formData.title}" has been added and a notification has been created.`,
        });
      } catch (error) {
        toast({
          title: "Error Adding Property",
          description: error as string || "Failed to create property",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Reset form
      setFormData({
        title: "",
        type: "",
        status: "",
        price: "",
        location: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        description: "",
        features: [],
      });
      
      // Reset images and previews
      setImages([]);
      setPreviews([]);
      
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error Adding Property",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: checked
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  // Image upload handlers
  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    
    // Convert files to base64 for persistence
    const base64Images: string[] = [];
    for (const file of files) {
      const base64 = await convertToBase64(file);
      base64Images.push(base64);
    }
    
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...base64Images]);
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
    // allow re-selecting the same file(s)
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setImages([]);
    setPreviews([]);
  };


  // Listen to Redux messages
  useEffect(() => {
    if (lastMessage.type && lastMessage.message) {
      toast({
        title: lastMessage.type === 'success' ? 'Success' : 'Error',
        description: lastMessage.message,
        variant: lastMessage.type === 'error' ? 'destructive' : 'default',
      });
    }
  }, [lastMessage, toast]);

  return (
    <Card className="property-card">
      <CardHeader>
        <CardTitle>Add New Property</CardTitle>
        <CardDescription>
          Fill in the details below to list your property
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                placeholder="e.g., Beautiful Family Home"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., New York, NY"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
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
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="850000"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="3"
                value={formData.bedrooms}
                onChange={(e) => handleChange("bedrooms", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="2"
                value={formData.bathrooms}
                onChange={(e) => handleChange("bathrooms", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area (sq ft)</Label>
            <Input
              id="area"
              type="number"
              placeholder="2500"
              value={formData.area}
              onChange={(e) => handleChange("area", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your property in detail..."
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features & Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableFeatures.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                  />
                  <Label htmlFor={feature} className="text-sm font-normal">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Property Images</Label>
              {previews.length > 0 && (
                <Button type="button" variant="outline" size="sm" onClick={clearAllImages}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove All
                </Button>
              )}
            </div>

            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/40 transition-colors"
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop images here, or
                    <Button type="button" variant="link" className="px-2" onClick={() => fileInputRef.current?.click()}>
                      browse files
                    </Button>
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to ~10MB each</p>
                </div>
                <div>
                  <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Select Images
                  </Button>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onFileInputChange}
            />
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-36 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background text-foreground border rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4"  />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding Property..." : "Add Property"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPropertyForm;