# Quick Supabase Setup Guide

## Step 1: Database Setup

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the entire content of `simple-database-setup.sql`
3. Click **Run** to execute the SQL
4. You should see "Database setup completed successfully!" message

## Step 2: Authentication Settings

1. Go to **Authentication** → **Settings** in Supabase
2. Find **"Enable email confirmations"** and **TURN IT OFF**
3. Save the settings

## Step 3: Check Environment Variables

Make sure your `.env` file has the correct values:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Test the Connection

1. Add this to your main page temporarily to test:

```tsx
import DatabaseTest from '@/components/DatabaseTest';

// Add this component to your page
<DatabaseTest />
```

2. Click "Test Connection" to verify everything works
3. Sign up/in and click "Test Create Property"

## Step 5: Common Issues & Solutions

### Issue: "relation 'properties' does not exist"
**Solution**: Run the SQL setup script in Step 1

### Issue: "Add Property" button stuck loading
**Solution**: 
- Check browser console for errors
- Make sure you're signed in
- Verify database tables exist

### Issue: "Property Listings" shows loading forever
**Solution**:
- Check if properties table has data
- Verify RLS policies are set correctly
- Check browser console for errors

### Issue: "Email not confirmed" error
**Solution**: Disable email confirmations in Step 2

## Step 6: Verify Everything Works

1. **Sign Up**: Should work immediately without email verification
2. **Add Property**: Should save to database and show success message
3. **View Listings**: Should show your added properties
4. **My Listings**: Should show properties you created with delete option

## Troubleshooting Commands

If you need to reset the database:

```sql
-- Delete all data (CAREFUL!)
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Then run the setup script again
```

## Success Indicators

✅ Sign up works without email confirmation  
✅ Add Property saves to database  
✅ Property Listings shows real data  
✅ My Listings shows user's properties  
✅ Delete property works  

If all these work, your Supabase integration is complete!
