import { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { 
  userStorage, 
  profileStorage, 
  authStorage, 
  clearAllStorage, 
  createUserProfile,
  LocalUser,
  LocalProfile,
  AuthState
} from '@/utils/localStorage'

interface AuthContextType {
  user: LocalUser | null
  profile: LocalProfile | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, userData?: Partial<LocalProfile>) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  updateProfile: (updates: Partial<LocalProfile>) => Promise<{ error: string | null }>
  isAdmin: boolean
  isAgent: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [profile, setProfile] = useState<LocalProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = userStorage.getUser()
        const storedProfile = profileStorage.getProfile()
        const authState = authStorage.getAuthState()

        if (storedUser && storedProfile && authState?.isAuthenticated) {
          setUser(storedUser)
          setProfile(storedProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        clearAllStorage()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Listen for real-time updates
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      setProfile(event.detail)
    }

    const handleAuthStateChange = (event: CustomEvent) => {
      if (!event.detail.isAuthenticated) {
        setUser(null)
        setProfile(null)
      }
    }

    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener)
    window.addEventListener('authStateChanged', handleAuthStateChange as EventListener)

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener)
      window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener)
    }
  }, [])

  const signUp = async (email: string, password: string, userData?: Partial<LocalProfile>) => {
    try {
      setLoading(true)

      // Simple validation
      if (!email || !password || password.length < 3) {
        toast({
          title: "Sign Up Failed",
          description: "Please enter a valid email and password (minimum 3 characters)",
          variant: "destructive"
        })
        return { error: "Invalid input" }
      }

      // Check if user already exists in localStorage
      const existingProfile = profileStorage.getProfile()
      if (existingProfile && existingProfile.email === email) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive"
        })
        return { error: "User already exists" }
      }

      // Create new user and profile for any email
      const { user: newUser, profile: newProfile } = createUserProfile(email, {
        full_name: userData?.full_name || email.split('@')[0],
        phone: userData?.phone || null,
        location: userData?.location || null,
        bio: userData?.bio || null,
        role: userData?.role || 'user'
      })

      // Save to localStorage
      userStorage.saveUser(newUser)
      profileStorage.saveProfile(newProfile)
      authStorage.saveAuthState({
        isAuthenticated: true,
        lastLogin: new Date().toISOString()
      })

      setUser(newUser)
      setProfile(newProfile)

      toast({
        title: "Account Created",
        description: `Welcome ${email}! Your account has been created successfully.`,
      })

      return { error: null }
    } catch (error) {
      return { error: "Failed to create account" }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Simple validation - accept any email with any password (minimum 3 characters)
      if (!email || !password || password.length < 3) {
        toast({
          title: "Sign In Failed",
          description: "Please enter a valid email and password (minimum 3 characters)",
          variant: "destructive"
        })
        return { error: "Invalid credentials" }
      }

      // Create or get existing user profile for this email
      let existingProfile = profileStorage.getProfile()
      let newUser: LocalUser
      let newProfile: LocalProfile

      if (existingProfile && existingProfile.email === email) {
        // Use existing profile for this email
        newUser = userStorage.getUser() || {
          id: existingProfile.id,
          email,
          created_at: existingProfile.created_at
        }
        newProfile = existingProfile
      } else {
        // Create new profile for any email
        const created = createUserProfile(email, {
          full_name: email.split('@')[0], // Use email username as default name
          role: 'user'
        })
        newUser = created.user
        newProfile = created.profile
      }

      // Save to localStorage
      userStorage.saveUser(newUser)
      profileStorage.saveProfile(newProfile)
      authStorage.saveAuthState({
        isAuthenticated: true,
        lastLogin: new Date().toISOString()
      })

      setUser(newUser)
      setProfile(newProfile)

      toast({
        title: "Welcome!",
        description: `Signed in as ${email}`,
      })

      return { error: null }
    } catch (error) {
      return { error: "Failed to sign in" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      clearAllStorage()
      setUser(null)
      setProfile(null)

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      })

      return { error: null }
    } catch (error) {
      return { error: "Failed to sign out" }
    }
  }

  const updateProfile = async (updates: Partial<LocalProfile>) => {
    try {
      if (!user || !profile) {
        return { error: 'No user logged in' }
      }

      const updatedProfile = profileStorage.updateProfile(updates)
      if (!updatedProfile) {
        return { error: 'Failed to update profile' }
      }

      setProfile(updatedProfile)

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      return { error: null }
    } catch (error) {
      return { error: "Failed to update profile" }
    }
  }

  const isAuthenticated = !!user && !!profile
  const isAdmin = profile?.role === 'admin'
  const isAgent = profile?.role === 'agent' || profile?.role === 'admin'

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin,
    isAgent,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useLocalAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useLocalAuth must be used within a LocalAuthProvider')
  }
  return context
}
