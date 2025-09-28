import PropertyCard from "@/components/PropertyCard";
import { dummyProperties } from "@/data/properties";
import { useEffect, useState } from "react";

const SavedProperties = () => {
  const storageKey = "savedPropertyIds";
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const loadSaved = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      const ids: number[] = raw ? JSON.parse(raw) : [];
      setSavedIds(ids);
    } catch {
      setSavedIds([]);
    }
  };

  useEffect(() => {
    loadSaved();
    const handler = () => loadSaved();
    window.addEventListener("saved-properties-changed", handler);
    return () => window.removeEventListener("saved-properties-changed", handler);
  }, []);

  const savedProperties = dummyProperties.filter(p => savedIds.includes(p.id));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Saved Properties</h2>
      
      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="property-card p-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">No Saved Properties</h3>
            <p className="text-muted-foreground">Start browsing properties and save your favorites here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedProperties;