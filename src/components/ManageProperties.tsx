import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { dummyProperties } from "@/data/properties";

const ManageProperties = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Manage Properties</h2>
      
      <div className="space-y-4">
        {dummyProperties.slice(0, 5).map((property) => (
          <Card key={property.id} className="property-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <img src={property.images[0]} alt={property.title} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-muted-foreground">{property.location}</p>
                    <p className="text-primary font-bold">${property.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-success">Approved</Badge>
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageProperties;