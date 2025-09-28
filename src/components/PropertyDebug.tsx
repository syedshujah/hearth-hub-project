import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PropertyDebug = () => {
  const properties = useAppSelector(state => state.properties.properties);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Property Debug Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Total Properties: {properties.length}</h3>
          </div>
          
          {properties.length === 0 ? (
            <p className="text-muted-foreground">No properties found. Try adding a property first.</p>
          ) : (
            <div className="space-y-3">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{property.title}</h4>
                      <p className="text-sm text-muted-foreground">ID: <code className="bg-muted px-1 rounded">{property.id}</code></p>
                      <p className="text-sm">Price: ${property.price.toLocaleString()}</p>
                      <p className="text-sm">Location: {property.location}</p>
                      <p className="text-sm">Images: {property.images?.length || 0}</p>
                      <p className="text-sm">Status: {property.status}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link to={`/property/${property.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          console.log("Property Data:", property);
                          alert(`Property ID: ${property.id}\nTitle: ${property.title}\nImages: ${property.images?.length || 0}`);
                        }}
                      >
                        Debug Info
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDebug;
