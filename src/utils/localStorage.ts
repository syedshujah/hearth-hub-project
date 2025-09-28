// Local storage keys
const STORAGE_KEYS = {
  USER: 'hearth_hub_user',
  PROFILE: 'hearth_hub_profile',
  AUTH_STATE: 'hearth_hub_auth_state'
} as const;

// User interface for localStorage
export interface LocalUser {
  id: string;
  email: string;
  created_at: string;
}

// Profile interface for localStorage
export interface LocalProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: 'user' | 'agent' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  created_at: string;
  updated_at: string;
}

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  lastLogin: string;
}

// User storage functions
export const userStorage = {
  // Save user data
  saveUser: (user: LocalUser): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  },

  // Get user data
  getUser: (): LocalUser | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  },

  // Remove user data
  removeUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  }
};

// Profile storage functions
export const profileStorage = {
  // Save profile data
  saveProfile: (profile: LocalProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profile }));
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
    }
  },

  // Get profile data
  getProfile: (): LocalProfile | null => {
    try {
      const profileData = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error getting profile from localStorage:', error);
      return null;
    }
  },

  // Update profile data
  updateProfile: (updates: Partial<LocalProfile>): LocalProfile | null => {
    try {
      const currentProfile = profileStorage.getProfile();
      if (!currentProfile) return null;

      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updated_at: new Date().toISOString()
      };

      profileStorage.saveProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile in localStorage:', error);
      return null;
    }
  },

  // Remove profile data
  removeProfile: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: null }));
    } catch (error) {
      console.error('Error removing profile from localStorage:', error);
    }
  }
};

// Auth state storage functions
export const authStorage = {
  // Save auth state
  saveAuthState: (authState: AuthState): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(authState));
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: authState }));
    } catch (error) {
      console.error('Error saving auth state to localStorage:', error);
    }
  },

  // Get auth state
  getAuthState: (): AuthState | null => {
    try {
      const authData = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error('Error getting auth state from localStorage:', error);
      return null;
    }
  },

  // Remove auth state
  removeAuthState: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isAuthenticated: false } }));
    } catch (error) {
      console.error('Error removing auth state from localStorage:', error);
    }
  }
};

// Clear all stored data
export const clearAllStorage = (): void => {
  userStorage.removeUser();
  profileStorage.removeProfile();
  authStorage.removeAuthState();
};

// Initialize user with default profile
export const createUserProfile = (email: string, additionalData?: Partial<LocalProfile>): { user: LocalUser; profile: LocalProfile } => {
  const now = new Date().toISOString();
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const user: LocalUser = {
    id: userId,
    email,
    created_at: now
  };

  const profile: LocalProfile = {
    id: userId,
    email,
    full_name: additionalData?.full_name || null,
    phone: additionalData?.phone || null,
    location: additionalData?.location || null,
    bio: additionalData?.bio || null,
    avatar_url: null,
    role: additionalData?.role || 'user',
    status: 'active',
    created_at: now,
    updated_at: now
  };

  return { user, profile };
};
