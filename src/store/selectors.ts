import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Property } from './propertySlice';

// Basic selectors
export const selectProperties = (state: RootState) => state.properties.properties;
export const selectLoading = (state: RootState) => state.properties.loading;
export const selectError = (state: RootState) => state.properties.error;
export const selectLastMessage = (state: RootState) => state.properties.lastMessage;

// Get property by ID
export const selectPropertyById = (id: string) =>
  createSelector(
    [selectProperties],
    (properties) => properties.find(property => property.id === id)
  );

// Get approved properties (equivalent to getAllProperties from original service)
export const selectApprovedProperties = createSelector(
  [selectProperties],
  (properties) => properties.filter(property => property.status === 'approved')
);

// Search properties with filters
export const selectFilteredProperties = (filters: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
}) =>
  createSelector(
    [selectApprovedProperties],
    (properties) => {
      return properties.filter(property => {
        // Location filter
        if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }

        // Price filters
        if (filters.minPrice && property.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice && property.price > filters.maxPrice) {
          return false;
        }

        // Property type filter
        if (filters.propertyType && property.property_type !== filters.propertyType) {
          return false;
        }

        // Bedrooms filter
        if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
          return false;
        }

        // Bathrooms filter
        if (filters.bathrooms && property.bathrooms < filters.bathrooms) {
          return false;
        }

        return true;
      });
    }
  );

// Get featured properties
export const selectFeaturedProperties = createSelector(
  [selectApprovedProperties],
  (properties) => properties.filter(property => property.featured)
);

// Get recent properties (last 10)
export const selectRecentProperties = createSelector(
  [selectApprovedProperties],
  (properties) => properties.slice(0, 10)
);

// Get properties count
export const selectPropertiesCount = createSelector(
  [selectApprovedProperties],
  (properties) => properties.length
);
