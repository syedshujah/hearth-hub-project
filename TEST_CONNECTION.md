# 🔧 Test Your Supabase Connection

## Quick Test Steps:

### 1. **Check Browser Console**
1. Open your app in browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for any error messages

### 2. **Test Database Setup**
1. Go to your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Run this test query:
```sql
SELECT * FROM properties LIMIT 5;
```
4. If you get an error, run the `simple-database-setup.sql` first

### 3. **Test Property Listings Page**
1. Go to `/listings` in your app
2. Check browser console for logs like:
   - "PropertyListings: Starting to fetch properties..."
   - "Properties fetched successfully: X"
3. If you see errors, they will show what's wrong

### 4. **Test Add Property**
1. Sign up/in to your app
2. Go to "Add Property"
3. Fill out the form with test data:
   - Title: "Test Property"
   - Type: "house"
   - Price: "500000"
   - Location: "Test City"
   - Bedrooms: "3"
   - Bathrooms: "2"
   - Area: "1500"
   - Description: "This is a test property"
4. Submit the form
5. Check console for success/error messages

## Common Error Messages & Solutions:

### ❌ "relation 'properties' does not exist"
**Solution**: Run the `simple-database-setup.sql` in Supabase SQL Editor

### ❌ "Failed to fetch properties from database"
**Solutions**:
- Check your `.env` file has correct Supabase URL and key
- Verify your Supabase project is active
- Run the database setup SQL

### ❌ "User not authenticated"
**Solutions**:
- Make sure you're signed in
- Check that email confirmation is disabled in Supabase Auth settings

### ❌ "RLS policy violation" or "permission denied"
**Solution**: Run the database setup SQL which includes the security policies

## Expected Success Messages:

✅ **Property Listings**: "Properties fetched successfully: X"  
✅ **Add Property**: "Property created successfully: Test Property"  
✅ **Sign Up**: "Welcome! Your account has been created and you are now signed in."  

## If Everything Fails:

1. **Reset Database**:
```sql
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
-- Then run simple-database-setup.sql again
```

2. **Check Environment Variables**:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. **Restart Development Server**:
```bash
npm run dev
# or
yarn dev
```

## Need More Help?

Add the `DatabaseTest` component to any page:
```tsx
import DatabaseTest from '@/components/DatabaseTest';

// Add this to your page
<DatabaseTest />
```

This will give you detailed connection testing and error reporting.
