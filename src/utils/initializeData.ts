import { store } from '@/store';
import { addProperty, clearProperties, PropertyFormData } from '@/store/propertySlice';

// Extended PropertyFormData to include featured flag
interface ExtendedPropertyFormData extends PropertyFormData {
  featured?: boolean;
}

// Sample properties to initialize the app with some data
const sampleProperties: ExtendedPropertyFormData[] = [
  {
    title: "Modern Downtown Apartment",
    description: "Beautiful modern apartment in the heart of the city with stunning skyline views. Features include hardwood floors, stainless steel appliances, and a spacious balcony.",
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    property_type: "apartment",
    location: "Manhattan, NY",
    amenities: ["Modern Kitchen", "City View", "Balcony", "Hardwood Floors"],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"],
    featured: true
  },
  {
    title: "Suburban Family House",
    description: "Spacious family home with large backyard, perfect for children and pets. Updated kitchen, finished basement, and attached garage.",
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    property_type: "house",
    location: "Austin, TX",
    amenities: ["Garden", "Garage", "Modern Kitchen", "Fireplace"],
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"],
    featured: true
  },
  {
    title: "Luxury Beach Villa",
    description: "Stunning beachfront villa with private pool and direct ocean access. Premium finishes throughout, chef's kitchen, and multiple outdoor entertaining areas.",
    price: 1200000,
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    property_type: "villa",
    location: "Miami, FL",
    amenities: ["Swimming Pool", "Garden", "Modern Kitchen", "City View", "Walk-in Closet"],
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"],
    featured: false
  },
  {
    title: "Cozy Studio Loft",
    description: "Charming studio loft in trendy neighborhood with exposed brick walls, high ceilings, and modern amenities. Perfect for young professionals.",
    price: 320000,
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    property_type: "apartment",
    location: "Brooklyn, NY",
    amenities: ["Exposed Brick", "High Ceilings", "Modern Kitchen", "Hardwood Floors"],
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"],
    featured: false
  },
  {
    title: "Executive Penthouse",
    description: "Luxurious penthouse with panoramic city views, private elevator, and rooftop terrace. Premium finishes and smart home technology throughout.",
    price: 2500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    property_type: "condo",
    location: "San Francisco, CA",
    amenities: ["City View", "Rooftop Terrace", "Smart Home", "Private Elevator", "Modern Kitchen"],
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"],
    featured: false
  }
];

export const initializeSampleData = () => {
  const state = store.getState();
  
  // Clear existing properties and add fresh sample data
  // This ensures we always have the latest sample data with featured properties
  store.dispatch(clearProperties());
  
  sampleProperties.forEach(property => {
    // Add sample properties with a dummy owner_id so they don't appear in user dashboards
    store.dispatch(addProperty({ ...property, owner_id: 'demo-user' }));
  });
  console.log('Sample properties added to Redux store with featured properties');
};

export default initializeSampleData;
