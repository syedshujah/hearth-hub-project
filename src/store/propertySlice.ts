import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Property interface (simplified from the original)
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  property_type: 'house' | 'apartment' | 'condo' | 'villa';
  status: 'approved' | 'pending' | 'rejected';
  location: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  amenities: string[];
  owner_id: string;
  views: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  // Contact information
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  map_image?: string;
}

// Form data interface for adding/editing properties
export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  property_type: 'house' | 'apartment' | 'condo' | 'villa';
  location: string;
  amenities: string[];
  images: string[];
}

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  lastMessage: {
    type: 'success' | 'error' | null;
    message: string;
  };
}

const initialState: PropertyState = {
  properties: [],
  loading: false,
  error: null,
  lastMessage: {
    type: null,
    message: ''
  }
};

// Helper function to generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set success/error message
    setMessage: (state, action: PayloadAction<{ type: 'success' | 'error' | null; message: string }>) => {
      state.lastMessage = action.payload;
    },

    // Clear message
    clearMessage: (state) => {
      state.lastMessage = { type: null, message: '' };
    },

    // Add new property
    addProperty: (state, action: PayloadAction<PropertyFormData & { owner_id?: string; featured?: boolean }>) => {
      const newProperty: Property = {
        id: generateId(),
        ...action.payload,
        address: action.payload.location,
        latitude: null,
        longitude: null,
        owner_id: action.payload.owner_id || 'local-user', // Use provided owner_id or default
        views: 0,
        featured: action.payload.featured || false,
        status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      state.properties.unshift(newProperty); // Add to beginning of array
      state.lastMessage = {
        type: 'success',
        message: `Property "${newProperty.title}" added successfully!`
      };
      state.error = null;
    },

    // Update existing property
    updateProperty: (state, action: PayloadAction<{ id: string; data: Partial<PropertyFormData> }>) => {
      const { id, data } = action.payload;
      const index = state.properties.findIndex(property => property.id === id);
      
      if (index !== -1) {
        state.properties[index] = {
          ...state.properties[index],
          ...data,
          updated_at: new Date().toISOString(),
        };
        state.lastMessage = {
          type: 'success',
          message: `Property "${state.properties[index].title}" updated successfully!`
        };
        state.error = null;
      } else {
        state.lastMessage = {
          type: 'error',
          message: 'Property not found!'
        };
      }
    },

    // Delete property
    deleteProperty: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const property = state.properties.find(p => p.id === id);
      
      if (property) {
        state.properties = state.properties.filter(property => property.id !== id);
        state.lastMessage = {
          type: 'success',
          message: `Property "${property.title}" deleted successfully!`
        };
        state.error = null;
      } else {
        state.lastMessage = {
          type: 'error',
          message: 'Property not found!'
        };
      }
    },

    // Get all properties (for consistency with the original API)
    getAllProperties: (state) => {
      // This is mainly for triggering any side effects if needed
      // The properties are already in the state
      state.loading = false;
      state.error = null;
    },

    // Get property by ID
    getPropertyById: (state, action: PayloadAction<string>) => {
      // This doesn't modify state, but can be used for consistency
      const property = state.properties.find(p => p.id === action.payload);
      if (!property) {
        state.error = 'Property not found';
      }
    },

    // Increment property views
    incrementViews: (state, action: PayloadAction<string>) => {
      const property = state.properties.find(p => p.id === action.payload);
      if (property) {
        property.views += 1;
      }
    },

    // Search/filter properties (this will be handled by selectors)
    searchProperties: (state, action: PayloadAction<{
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      propertyType?: string;
      bedrooms?: number;
      bathrooms?: number;
    }>) => {
      // This action can be used to trigger search functionality
      // The actual filtering will be done by selectors
      state.loading = false;
    },

    // Load initial data (for when app starts)
    loadProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Clear all properties (for resetting data)
    clearProperties: (state) => {
      state.properties = [];
      state.loading = false;
      state.error = null;
      state.lastMessage = { type: null, message: '' };
    },
  },
});

export const {
  setLoading,
  setError,
  setMessage,
  clearMessage,
  addProperty,
  updateProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  incrementViews,
  searchProperties,
  loadProperties,
  clearProperties,
} = propertySlice.actions;

export default propertySlice.reducer;
