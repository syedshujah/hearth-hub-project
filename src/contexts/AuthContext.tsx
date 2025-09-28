import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  location: string | null
  bio: string | null
  avatar_url: string | null
  role: 'user' | 'agent' | 'admin'
  status: 'active' | 'blocked' | 'pending'
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData?: Partial<Profile>) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  isAdmin: boolean
  isAgent: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: Partial<Profile>) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || null,
            phone: userData?.phone || null,
            location: userData?.location || null,
            role: userData?.role || 'user',
          }
        }
      })

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        })
        return { error }
      }

      if (data.user) {
        // Create profile in our custom table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: userData?.full_name || null,
              phone: userData?.phone || null,
              location: userData?.location || null,
              bio: userData?.bio || null,
              role: userData?.role || 'user',
              status: 'active',
            },
          ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }

        if (data.session) {
          // User has active session immediately (email confirmation disabled)
          toast({
            title: "Account Created",
            description: "Welcome! Your account has been created and you are now signed in.",
          })
        } else {
          // User created but no session (email confirmation required)
          toast({
            title: "Account Created",
            description: "Your account has been created successfully. To enable immediate sign-in, please disable email confirmation in your Supabase project settings.",
          })
        }
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Handle "Email not confirmed" error specifically
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          toast({
            title: "Account Found",
            description: "Your account exists but email confirmation is required. Please check your Supabase settings to disable email confirmation, or contact support.",
            variant: "destructive"
          })
          return { error }
        } else {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          })
          return { error }
        }
      }

      toast({
        title: "Welcome Back!",
        description: "You have been successfully signed in.",
      })

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive"
        })
        return { error }
      }

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      })

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        })
        return { error }
      }

      // Refresh profile
      await fetchProfile(user.id)

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isAgent = profile?.role === 'agent' || profile?.role === 'admin'

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin,
    isAgent,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
