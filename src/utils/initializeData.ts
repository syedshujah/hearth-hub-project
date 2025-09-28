import { store } from '@/store';
import { addProperty, PropertyFormData } from '@/store/propertySlice';

// Sample properties to initialize the app with some data
const sampleProperties: PropertyFormData[] = [
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
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"]
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
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"]
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
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"]
  }
];

export const initializeSampleData = () => {
  const state = store.getState();
  
  // Only add sample data if no properties exist
  if (state.properties.properties.length === 0) {
    sampleProperties.forEach(property => {
      store.dispatch(addProperty(property));
    });
    console.log('Sample properties added to Redux store');
  }
};

export default initializeSampleData;
