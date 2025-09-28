import { store } from '@/store';
import { 
  addProperty, 
  updateProperty, 
  deleteProperty, 
  incrementViews,
  PropertyFormData,
  Property 
} from '@/store/propertySlice';
import { 
  selectApprovedProperties, 
  selectPropertyById, 
  selectFilteredProperties 
} from '@/store/selectors';

// Helper function to convert File to base64 string for localStorage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Helper function to process images
const processImages = async (images: File[]): Promise<string[]> => {
  const imagePromises = images.map(file => fileToBase64(file));
  return Promise.all(imagePromises);
};

// Create a new property
export const createProperty = async (
  propertyData: Partial<Property>, 
  images: File[] = []
): Promise<{ data: Property | null; error: string | null }> => {
  try {
    // Process images to base64
    const processedImages = await processImages(images);

    // Prepare the property data
    const formData: PropertyFormData = {
      title: propertyData.title || '',
      description: propertyData.description || '',
      price: propertyData.price || 0,
      bedrooms: propertyData.bedrooms || 0,
      bathrooms: propertyData.bathrooms || 0,
      area: propertyData.area || 0,
      property_type: propertyData.property_type || 'house',
      location: propertyData.location || '',
      amenities: propertyData.amenities || [],
      images: processedImages,
    };

    // Validate required fields
    if (!formData.title || !formData.location || !formData.price) {
      return { data: null, error: 'Missing required fields' };
    }

    // Dispatch the action
    store.dispatch(addProperty(formData));

    // Get the newly added property (it will be the first in the array)
    const state = store.getState();
    const newProperty = state.properties.properties[0];

    return { data: newProperty, error: null };
  } catch (error) {
    console.error('Error creating property:', error);
    return { data: null, error: 'Failed to create property' };
  }
};

// Get all approved properties
export const getAllProperties = async (): Promise<{ data: Property[] | null; error: string | null }> => {
  try {
    const state = store.getState();
    const properties = selectApprovedProperties(state);
    return { data: properties, error: null };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { data: null, error: 'Failed to fetch properties' };
  }
};

// Get a single property by ID
export const getPropertyById = async (id: string): Promise<{ data: Property | null; error: string | null }> => {
  try {
    const state = store.getState();
    const property = selectPropertyById(id)(state);
    
    if (!property) {
      return { data: null, error: 'Property not found' };
    }

    return { data: property, error: null };
  } catch (error) {
    console.error('Error fetching property:', error);
    return { data: null, error: 'Failed to fetch property' };
  }
};

// Update a property
export const updatePropertyById = async (
  id: string, 
  updates: Partial<PropertyFormData>
): Promise<{ data: Property | null; error: string | null }> => {
  try {
    // Dispatch the update action
    store.dispatch(updateProperty({ id, data: updates }));

    // Get the updated property
    const state = store.getState();
    const updatedProperty = selectPropertyById(id)(state);

    if (!updatedProperty) {
      return { data: null, error: 'Property not found' };
    }

    return { data: updatedProperty, error: null };
  } catch (error) {
    console.error('Error updating property:', error);
    return { data: null, error: 'Failed to update property' };
  }
};

// Delete a property
export const deletePropertyById = async (id: string): Promise<{ error: string | null }> => {
  try {
    store.dispatch(deleteProperty(id));
    return { error: null };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { error: 'Failed to delete property' };
  }
};

// Increment property views
export const incrementPropertyViews = async (id: string): Promise<void> => {
  try {
    store.dispatch(incrementViews(id));
  } catch (error) {
    console.error('Error incrementing property views:', error);
  }
};

// Search properties with filters
export const searchProperties = async (filters: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
}): Promise<{ data: Property[] | null; error: string | null }> => {
  try {
    const state = store.getState();
    const filteredProperties = selectFilteredProperties(filters)(state);
    return { data: filteredProperties, error: null };
  } catch (error) {
    console.error('Error searching properties:', error);
    return { data: null, error: 'Failed to search properties' };
  }
};

// Get user properties (for consistency, returns all properties since we don't have user auth)
export const getUserProperties = async (): Promise<{ data: Property[] | null; error: string | null }> => {
  return getAllProperties();
};

// Export the Property type for compatibility
export type { Property, PropertyFormData };
