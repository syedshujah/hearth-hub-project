import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']
type Profile = Database['public']['Tables']['profiles']['Row']
type Inquiry = Database['public']['Tables']['inquiries']['Row']
type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']

// Properties Service
export const propertiesService = {
  // Get all properties with optional filters
  async getProperties(filters?: {
    status?: string
    property_type?: string
    location?: string
    min_price?: number
    max_price?: number
    bedrooms?: number
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('properties')
      .select(`
        *,
        profiles!properties_owner_id_fkey (
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.property_type) {
      query = query.eq('property_type', filters.property_type)
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters?.min_price) {
      query = query.gte('price', filters.min_price)
    }
    if (filters?.max_price) {
      query = query.lte('price', filters.max_price)
    }
    if (filters?.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    return await query
  },

  // Get single property by ID
  async getProperty(id: string) {
    return await supabase
      .from('properties')
      .select(`
        *,
        profiles!properties_owner_id_fkey (
          full_name,
          email,
          phone,
          avatar_url
        )
      `)
      .eq('id', id)
      .single()
  },

  // Create new property
  async createProperty(property: PropertyInsert) {
    return await supabase
      .from('properties')
      .insert([property])
      .select()
      .single()
  },

  // Update property
  async updateProperty(id: string, updates: PropertyUpdate) {
    return await supabase
      .from('properties')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete property
  async deleteProperty(id: string) {
    return await supabase
      .from('properties')
      .delete()
      .eq('id', id)
  },

  // Increment property views
  async incrementViews(id: string) {
    const { data: property } = await supabase
      .from('properties')
      .select('views')
      .eq('id', id)
      .single()

    if (property) {
      return await supabase
        .from('properties')
        .update({ views: (property.views || 0) + 1 })
        .eq('id', id)
    }
  },

  // Get featured properties
  async getFeaturedProperties(limit = 6) {
    return await supabase
      .from('properties')
      .select(`
        *,
        profiles!properties_owner_id_fkey (
          full_name,
          email
        )
      `)
      .eq('featured', true)
      .eq('status', 'approved')
      .limit(limit)
      .order('created_at', { ascending: false })
  },

  // Search properties
  async searchProperties(query: string) {
    return await supabase
      .from('properties')
      .select(`
        *,
        profiles!properties_owner_id_fkey (
          full_name,
          email
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
  }
}

// Users/Profiles Service
export const usersService = {
  // Get all users with optional filters
  async getUsers(filters?: {
    role?: string
    status?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.role && filters.role !== 'all') {
      query = query.eq('role', filters.role)
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    return await query
  },

  // Get user by ID
  async getUser(id: string) {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
  },

  // Update user
  async updateUser(id: string, updates: Partial<Profile>) {
    return await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete user
  async deleteUser(id: string) {
    return await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
  },

  // Get user statistics
  async getUserStats() {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('role, status')

    if (error) return { error }

    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      blocked: users.filter(u => u.status === 'blocked').length,
      pending: users.filter(u => u.status === 'pending').length,
      admins: users.filter(u => u.role === 'admin').length,
      agents: users.filter(u => u.role === 'agent').length,
      users: users.filter(u => u.role === 'user').length,
    }

    return { data: stats, error: null }
  }
}

// Inquiries Service
export const inquiriesService = {
  // Get all inquiries
  async getInquiries(filters?: {
    status?: string
    property_id?: string
    user_id?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('inquiries')
      .select(`
        *,
        properties (
          title,
          location,
          price
        ),
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false })

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters?.property_id) {
      query = query.eq('property_id', filters.property_id)
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    return await query
  },

  // Create inquiry
  async createInquiry(inquiry: InquiryInsert) {
    return await supabase
      .from('inquiries')
      .insert([inquiry])
      .select()
      .single()
  },

  // Update inquiry status
  async updateInquiry(id: string, updates: { status?: string; message?: string }) {
    return await supabase
      .from('inquiries')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete inquiry
  async deleteInquiry(id: string) {
    return await supabase
      .from('inquiries')
      .delete()
      .eq('id', id)
  }
}

// Favorites Service
export const favoritesService = {
  // Get user favorites
  async getUserFavorites(userId: string) {
    return await supabase
      .from('favorites')
      .select(`
        *,
        properties (
          *,
          profiles!properties_owner_id_fkey (
            full_name,
            email
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  // Add to favorites
  async addToFavorites(userId: string, propertyId: string) {
    return await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
        property_id: propertyId
      }])
      .select()
      .single()
  },

  // Remove from favorites
  async removeFromFavorites(userId: string, propertyId: string) {
    return await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId)
  },

  // Check if property is favorited
  async isFavorited(userId: string, propertyId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single()

    return { isFavorited: !!data, error }
  }
}

// Analytics Service
export const analyticsService = {
  // Get dashboard statistics
  async getDashboardStats() {
    const [
      propertiesResult,
      usersResult,
      inquiriesResult
    ] = await Promise.all([
      supabase.from('properties').select('status, created_at, price'),
      supabase.from('profiles').select('role, status, created_at'),
      supabase.from('inquiries').select('status, created_at')
    ])

    const properties = propertiesResult.data || []
    const users = usersResult.data || []
    const inquiries = inquiriesResult.data || []

    // Calculate monthly revenue (assuming commission-based model)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyRevenue = properties
      .filter(p => {
        const createdDate = new Date(p.created_at)
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear &&
               p.status === 'approved'
      })
      .reduce((sum, p) => sum + (p.price * 0.03), 0) // 3% commission

    return {
      totalUsers: users.length,
      totalProperties: properties.length,
      activeListings: properties.filter(p => p.status === 'approved').length,
      pendingProperties: properties.filter(p => p.status === 'pending').length,
      monthlyRevenue,
      newInquiries: inquiries.filter(i => i.status === 'new').length,
      totalInquiries: inquiries.length
    }
  },

  // Get monthly trends
  async getMonthlyTrends() {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const [propertiesResult, usersResult] = await Promise.all([
      supabase
        .from('properties')
        .select('created_at, price, status')
        .gte('created_at', sixMonthsAgo.toISOString()),
      supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString())
    ])

    const properties = propertiesResult.data || []
    const users = usersResult.data || []

    // Group by month
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear()
      const monthStart = new Date(year, date.getMonth(), 1)
      const monthEnd = new Date(year, date.getMonth() + 1, 0)

      const monthProperties = properties.filter(p => {
        const createdDate = new Date(p.created_at)
        return createdDate >= monthStart && createdDate <= monthEnd
      })

      const monthUsers = users.filter(u => {
        const createdDate = new Date(u.created_at)
        return createdDate >= monthStart && createdDate <= monthEnd
      })

      const revenue = monthProperties
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + (p.price * 0.03), 0)

      monthlyData.push({
        month,
        properties: monthProperties.length,
        users: monthUsers.length,
        revenue: Math.round(revenue)
      })
    }

    return monthlyData
  }
}
