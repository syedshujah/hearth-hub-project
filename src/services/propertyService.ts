import { supabase } from '@/lib/supabase'

// Simplified Property type that matches what we expect
export interface Property {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  property_type: 'house' | 'apartment' | 'condo' | 'villa'
  status: 'approved' | 'pending' | 'rejected'
  location: string
  address: string
  latitude?: number | null
  longitude?: number | null
  images: string[]
  amenities: string[]
  owner_id: string
  views: number
  featured: boolean
  created_at: string
  updated_at: string
}

// Property update interface
export interface PropertyUpdate {
  title?: string
  description?: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  property_type?: 'house' | 'apartment' | 'condo' | 'villa'
  location?: string
  address?: string
  latitude?: number | null
  longitude?: number | null
  amenities?: string[]
  images?: string[]
  featured?: boolean
}

// Upload image to Supabase Storage
export const uploadPropertyImage = async (file: File, propertyId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

// Create a new property
export const createProperty = async (propertyData: Partial<Property>, images: File[] = []): Promise<{ data: Property | null; error: string | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: 'User not authenticated' }
    }

    console.log('Creating property with data:', propertyData)

    // Prepare the property data for insertion
    const insertData = {
      title: propertyData.title,
      description: propertyData.description,
      price: propertyData.price,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area,
      property_type: propertyData.property_type,
      location: propertyData.location,
      address: propertyData.address || propertyData.location,
      latitude: propertyData.latitude || null,
      longitude: propertyData.longitude || null,
      amenities: propertyData.amenities || [],
      images: [], // Will be updated after upload
      owner_id: user.id,
      status: 'approved', // Set to approved for immediate visibility
      views: 0,
      featured: false,
    }

    // Create property record
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert([insertData])
      .select()
      .single()

    if (propertyError) {
      console.error('Error creating property:', propertyError)
      return { data: null, error: `Database error: ${propertyError.message}` }
    }

    console.log('Property created successfully:', property)

    // Skip image upload for now to avoid complications
    // Just return the property as created
    return { data: property, error: null }
  } catch (error) {
    console.error('Error creating property:', error)
    return { data: null, error: 'Failed to create property. Please check your database connection.' }
  }
}

// Get all properties (public listings)
export const getAllProperties = async (): Promise<{ data: Property[] | null; error: string | null }> => {
  try {
    console.log('Fetching properties from Supabase...')
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
      return { data: null, error: `Database error: ${error.message}` }
    }

    console.log('Properties fetched successfully:', data?.length || 0)
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching properties:', error)
    return { data: null, error: 'Failed to fetch properties. Please check your database connection.' }
  }
}

// Get properties by user (user's own properties)
export const getUserProperties = async (userId?: string): Promise<{ data: Property[] | null; error: string | null }> => {
  try {
    let targetUserId = userId
    
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { data: null, error: 'User not authenticated' }
      }
      targetUserId = user.id
    }

    console.log('Fetching properties for user:', targetUserId)

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', targetUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user properties:', error)
      return { data: null, error: `Database error: ${error.message}` }
    }

    console.log('User properties fetched:', data?.length || 0)
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching user properties:', error)
    return { data: null, error: 'Failed to fetch user properties. Please check your database connection.' }
  }
}

// Get a single property by ID
export const getPropertyById = async (id: string): Promise<{ data: Property | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        profiles!properties_owner_id_fkey (
          full_name,
          phone,
          email,
          avatar_url
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching property:', error)
    return { data: null, error: 'Failed to fetch property' }
  }
}

// Update a property
export const updateProperty = async (id: string, updates: PropertyUpdate): Promise<{ data: Property | null; error: string | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('properties')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('owner_id', user.id) // Ensure user can only update their own properties
      .select()
      .single()

    if (error) {
      console.error('Error updating property:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error updating property:', error)
    return { data: null, error: 'Failed to update property' }
  }
}

// Delete a property
export const deleteProperty = async (id: string): Promise<{ error: string | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: 'User not authenticated' }
    }

    // First, get the property to check ownership and get image URLs
    const { data: property, error: fetchError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching property for deletion:', fetchError)
      return { error: fetchError.message }
    }

    // Delete images from storage if they exist
    if (property.images && property.images.length > 0) {
      const imagePaths = property.images.map(url => {
        // Extract file path from URL
        const urlParts = url.split('/')
        return `${property.id}/${urlParts[urlParts.length - 1]}`
      })

      const { error: storageError } = await supabase.storage
        .from('property-images')
        .remove(imagePaths)

      if (storageError) {
        console.error('Error deleting images:', storageError)
        // Continue with property deletion even if image deletion fails
      }
    }

    // Delete the property record
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id)

    if (error) {
      console.error('Error deleting property:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error('Error deleting property:', error)
    return { error: 'Failed to delete property' }
  }
}

// Increment property views
export const incrementPropertyViews = async (id: string): Promise<void> => {
  try {
    await supabase.rpc('increment_property_views', { property_id: id })
  } catch (error) {
    console.error('Error incrementing property views:', error)
  }
}

// Search properties
export const searchProperties = async (filters: {
  location?: string
  minPrice?: number
  maxPrice?: number
  propertyType?: string
  status?: string
  bedrooms?: number
  bathrooms?: number
}): Promise<{ data: Property[] | null; error: string | null }> => {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        profiles!properties_owner_id_fkey (
          full_name,
          phone,
          email,
          avatar_url
        )
      `)
      .eq('status', 'approved')

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }

    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType)
    }

    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms)
    }

    if (filters.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching properties:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error searching properties:', error)
    return { data: null, error: 'Failed to search properties' }
  }
}
