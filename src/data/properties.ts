export interface Property {
  id: number;
  title: string;
  price: number;
  type: "house" | "apartment" | "condo" | "villa";
  status: "for-rent" | "for-sale";
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq ft
  description: string;
  images: string[];
  features: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  dateAdded: string;
  featured: boolean;
}

export const dummyProperties: Property[] = [
  {
    id: 1,
    title: "Modern Luxury Villa with Pool",
    price: 850000,
    type: "villa",
    status: "for-sale",
    location: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    description: "Stunning modern villa featuring an open floor plan, high-end finishes, and a beautiful outdoor pool area. Perfect for entertaining with spacious living areas and a gourmet kitchen.",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    features: ["Swimming Pool", "Garage", "Garden", "Security System", "Modern Kitchen", "Walk-in Closet"],
    agent: {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah@propertyhub.com",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
    coordinates: { lat: 34.0736, lng: -118.4004 },
    dateAdded: "2024-01-15",
    featured: true
  },
  {
    id: 2,
    title: "Downtown Luxury Apartment",
    price: 3500,
    type: "apartment",
    status: "for-rent",
    location: "Manhattan, NY",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    description: "Beautiful downtown apartment with stunning city views. Features modern amenities, hardwood floors, and floor-to-ceiling windows. Prime location with easy access to public transportation.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop"
    ],
    features: ["City View", "Hardwood Floors", "Modern Kitchen", "Gym Access", "Concierge", "Balcony"],
    agent: {
      name: "Michael Chen",
      phone: "+1 (555) 987-6543",
      email: "michael@propertyhub.com",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    },
    coordinates: { lat: 40.7589, lng: -73.9851 },
    dateAdded: "2024-01-20",
    featured: true
  },
  {
    id: 3,
    title: "Charming Family House",
    price: 450000,
    type: "house",
    status: "for-sale",
    location: "Austin, TX",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    description: "Perfect family home in a quiet neighborhood. Features a spacious backyard, updated kitchen, and cozy living spaces. Great schools nearby and close to parks and shopping.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1628824621755-1a26b3b7a5c4?w=800&h=600&fit=crop"
    ],
    features: ["Backyard", "Updated Kitchen", "Fireplace", "Two-Car Garage", "Quiet Neighborhood"],
    agent: {
      name: "Emily Rodriguez",
      phone: "+1 (555) 456-7890",
      email: "emily@propertyhub.com",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face"
    },
    coordinates: { lat: 30.2672, lng: -97.7431 },
    dateAdded: "2024-01-10",
    featured: false
  },
  {
    id: 4,
    title: "Elegant Downtown Condo",
    price: 2800,
    type: "condo",
    status: "for-rent",
    location: "Seattle, WA",
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    description: "Stylish downtown condo with modern finishes and great amenities. Perfect for professionals seeking convenience and luxury. Walking distance to restaurants, shops, and public transit.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop"
    ],
    features: ["Modern Finishes", "Gym", "Rooftop Deck", "In-unit Laundry", "Downtown Location"],
    agent: {
      name: "David Park",
      phone: "+1 (555) 321-9876",
      email: "david@propertyhub.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    coordinates: { lat: 47.6062, lng: -122.3321 },
    dateAdded: "2024-01-25",
    featured: false
  },
  {
    id: 5,
    title: "Luxury Waterfront Villa",
    price: 1200000,
    type: "villa",
    status: "for-sale",
    location: "Miami, FL",
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    description: "Breathtaking waterfront villa with panoramic ocean views. Features private beach access, infinity pool, and luxury finishes throughout. Perfect for those seeking the ultimate waterfront lifestyle.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    ],
    features: ["Ocean View", "Private Beach", "Infinity Pool", "Luxury Finishes", "Private Dock"],
    agent: {
      name: "Isabella Martinez",
      phone: "+1 (555) 654-3210",
      email: "isabella@propertyhub.com",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
    },
    coordinates: { lat: 25.7617, lng: -80.1918 },
    dateAdded: "2024-01-05",
    featured: true
  },
  {
    id: 6,
    title: "Cozy Studio Apartment",
    price: 1800,
    type: "apartment",
    status: "for-rent",
    location: "San Francisco, CA",
    bedrooms: 0,
    bathrooms: 1,
    area: 450,
    description: "Charming studio apartment in the heart of the city. Efficient layout with modern amenities and great natural light. Perfect for young professionals or students.",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop"
    ],
    features: ["City Location", "Modern Amenities", "Natural Light", "Efficient Layout"],
    agent: {
      name: "James Wilson",
      phone: "+1 (555) 789-0123",
      email: "james@propertyhub.com",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
    },
    coordinates: { lat: 37.7749, lng: -122.4194 },
    dateAdded: "2024-01-30",
    featured: false
  }
];