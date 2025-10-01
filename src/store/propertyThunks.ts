import { createAsyncThunk } from '@reduxjs/toolkit';
import { PropertyFormData } from './propertySlice';
import { addProperty, updateProperty, deleteProperty } from './propertySlice';
import { addPropertyCreatedNotification, addPropertyUpdatedNotification, addPropertyDeletedNotification } from './notificationSlice';
import { AppDispatch, RootState } from './index';
import { generateRealisticMapImage } from '@/utils/mapUtils';

// Thunk for creating property with notification
export const createPropertyWithNotification = createAsyncThunk<
  void,
  { propertyData: PropertyFormData & { owner_id?: string }; userId?: string; userProfile?: any },
  { dispatch: AppDispatch; state: RootState }
>(
  'properties/createWithNotification',
  async ({ propertyData, userId, userProfile }, { dispatch, getState }) => {
    // Generate map image for the location
    const mapImage = generateRealisticMapImage(propertyData.location);
    
    // Enhanced property data with contact info and map
    const enhancedPropertyData = {
      ...propertyData,
      // Add contact information from user profile
      contact_name: userProfile?.full_name || 'Property Owner',
      contact_email: userProfile?.email || 'contact@example.com',
      contact_phone: userProfile?.phone || 'Phone not provided',
      // Add map image
      map_image: mapImage,
      // Add map to images array
      images: [...propertyData.images, mapImage],
      // Ensure owner_id is set
      owner_id: propertyData.owner_id || userId || 'local-user'
    };
    
    // Add the property with enhanced data
    dispatch(addProperty(enhancedPropertyData as PropertyFormData & { owner_id: string }));
    
    // Get the newly created property (it will be the first one since we unshift)
    const state = getState();
    const newProperty = state.properties.properties[0];
    
    if (newProperty) {
      // Dispatch notification
      dispatch(addPropertyCreatedNotification({
        propertyTitle: newProperty.title,
        propertyId: newProperty.id,
        userId: userId || 'local-user'
      }));
    }
  }
);

// Thunk for updating property with notification
export const updatePropertyWithNotification = createAsyncThunk<
  void,
  { id: string; data: Partial<PropertyFormData>; userId?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'properties/updateWithNotification',
  async ({ id, data, userId }, { dispatch, getState }) => {
    // Get property title before update
    const state = getState();
    const property = state.properties.properties.find(p => p.id === id);
    const propertyTitle = property?.title || 'Unknown Property';
    
    // Update the property
    dispatch(updateProperty({ id, data }));
    
    // Dispatch notification
    dispatch(addPropertyUpdatedNotification({
      propertyTitle,
      propertyId: id,
      userId: userId || 'local-user'
    }));
  }
);

// Thunk for deleting property with notification
export const deletePropertyWithNotification = createAsyncThunk<
  void,
  { id: string; userId?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  'properties/deleteWithNotification',
  async ({ id, userId }, { dispatch, getState }) => {
    // Get property title before deletion
    const state = getState();
    const property = state.properties.properties.find(p => p.id === id);
    const propertyTitle = property?.title || 'Unknown Property';
    
    // Delete the property
    dispatch(deleteProperty(id));
    
    // Dispatch notification
    dispatch(addPropertyDeletedNotification({
      propertyTitle,
      userId: userId || 'local-user'
    }));
  }
);
