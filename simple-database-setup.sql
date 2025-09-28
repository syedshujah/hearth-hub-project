-- Simple Database Setup for Real Estate App
-- Copy and paste this into your Supabase SQL Editor

-- 1. Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area INTEGER NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'condo', 'villa')),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create simple policies for properties
DROP POLICY IF EXISTS "Anyone can view approved properties" ON properties;
CREATE POLICY "Anyone can view approved properties" ON properties
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view own properties" ON properties;
CREATE POLICY "Users can view own properties" ON properties
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own properties" ON properties;
CREATE POLICY "Users can insert own properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own properties" ON properties;
CREATE POLICY "Users can update own properties" ON properties
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own properties" ON properties;
CREATE POLICY "Users can delete own properties" ON properties
  FOR DELETE USING (auth.uid() = owner_id);

-- 5. Create simple policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user', 
    'active'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Insert sample data (optional)
INSERT INTO properties (
  title, 
  description, 
  price, 
  bedrooms, 
  bathrooms, 
  area, 
  property_type, 
  location, 
  address, 
  owner_id, 
  status,
  amenities
) VALUES (
  'Sample Modern Villa',
  'Beautiful modern villa with stunning views and premium amenities. Perfect for families looking for luxury living.',
  850000,
  4,
  3,
  3200,
  'villa',
  'Beverly Hills, CA',
  '123 Luxury Lane, Beverly Hills, CA 90210',
  (SELECT id FROM auth.users LIMIT 1),
  'approved',
  ARRAY['Swimming Pool', 'Garage', 'Garden', 'Security System']
) ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully!' as message;
