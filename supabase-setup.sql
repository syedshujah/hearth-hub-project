-- Supabase Setup SQL
-- Run this in your Supabase SQL Editor to set up the database

-- Create storage bucket for property images (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for property images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to increment property views
CREATE OR REPLACE FUNCTION increment_property_views(property_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET views = COALESCE(views, 0) + 1,
      updated_at = now()
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS (Row Level Security) on properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policies for properties table
CREATE POLICY "Public can view approved properties" ON properties FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own properties" ON properties FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own properties" ON properties FOR DELETE USING (auth.uid() = owner_id);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING gin(to_tsvector('english', location));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user', 'active');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sample data (optional - remove if you don't want sample data)
-- INSERT INTO properties (title, description, price, bedrooms, bathrooms, area, property_type, location, address, owner_id, status, images, amenities)
-- VALUES 
-- ('Sample Modern Villa', 'Beautiful modern villa with all amenities', 850000, 4, 3, 3200, 'villa', 'Beverly Hills, CA', '123 Luxury Lane, Beverly Hills, CA', (SELECT id FROM profiles LIMIT 1), 'approved', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'], ARRAY['Swimming Pool', 'Garage', 'Garden']);
