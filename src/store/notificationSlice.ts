import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  userId?: string; // To associate notifications with specific users
  propertyId?: string; // For property-related notifications
  actionType?: 'property_created' | 'property_updated' | 'property_deleted' | 'system' | 'user_action';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      // Add to beginning of array (newest first)
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications to prevent memory issues
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
      
      // Update unread count
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },

    deleteNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].read;
        state.notifications.splice(index, 1);
        if (wasUnread) {
          state.unreadCount = state.notifications.filter(n => !n.read).length;
        }
      }
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    // Load notifications from localStorage
    loadNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },

    // Property-specific notification creators
    addPropertyCreatedNotification: (state, action: PayloadAction<{ propertyTitle: string; propertyId: string; userId?: string }>) => {
      const { propertyTitle, propertyId, userId } = action.payload;
      const notification: Notification = {
        id: `property_created_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: "Property Created Successfully",
        message: `Your property "${propertyTitle}" has been created and is now live on the platform.`,
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false,
        userId,
        propertyId,
        actionType: 'property_created',
      };
      
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
      
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },

    addPropertyUpdatedNotification: (state, action: PayloadAction<{ propertyTitle: string; propertyId: string; userId?: string }>) => {
      const { propertyTitle, propertyId, userId } = action.payload;
      const notification: Notification = {
        id: `property_updated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: "Property Updated",
        message: `Your property "${propertyTitle}" has been updated successfully.`,
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false,
        userId,
        propertyId,
        actionType: 'property_updated',
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
      
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },

    addPropertyDeletedNotification: (state, action: PayloadAction<{ propertyTitle: string; userId?: string }>) => {
      const { propertyTitle, userId } = action.payload;
      const notification: Notification = {
        id: `property_deleted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: "Property Deleted",
        message: `Your property "${propertyTitle}" has been deleted successfully.`,
        type: 'warning',
        timestamp: new Date().toISOString(),
        read: false,
        userId,
        actionType: 'property_deleted',
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
      
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  loadNotifications,
  addPropertyCreatedNotification,
  addPropertyUpdatedNotification,
  addPropertyDeletedNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
