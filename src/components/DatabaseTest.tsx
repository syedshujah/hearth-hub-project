import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getAllProperties, createProperty } from '@/services/propertyService';

const DatabaseTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing Supabase connection...');
      
      // Test 1: Basic connection
      const { data, error } = await supabase.from('properties').select('count').limit(1);
      if (error) {
        addResult(`❌ Connection failed: ${error.message}`);
      } else {
        addResult('✅ Supabase connection successful');
      }

      // Test 2: Check if tables exist
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['properties', 'profiles']);
      
      if (tableError) {
        addResult(`❌ Cannot check tables: ${tableError.message}`);
      } else {
        const tableNames = tables?.map(t => t.table_name) || [];
        addResult(`✅ Tables found: ${tableNames.join(', ')}`);
      }

      // Test 3: Authentication
      if (user) {
        addResult(`✅ User authenticated: ${user.email}`);
      } else {
        addResult('❌ No user authenticated');
      }

      // Test 4: Fetch properties
      const propertiesResult = await getAllProperties();
      if (propertiesResult.error) {
        addResult(`❌ Fetch properties failed: ${propertiesResult.error}`);
      } else {
        addResult(`✅ Properties fetched: ${propertiesResult.data?.length || 0} properties`);
      }

    } catch (error) {
      addResult(`❌ Test failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateProperty = async () => {
    if (!user) {
      addResult('❌ Must be logged in to create property');
      return;
    }

    setLoading(true);
    addResult('Testing property creation...');

    const testProperty = {
      title: 'Test Property',
      description: 'This is a test property created by the database test',
      price: 500000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      property_type: 'house' as const,
      location: 'Test City, Test State',
      address: '123 Test Street, Test City, Test State',
      amenities: ['Test Feature 1', 'Test Feature 2']
    };

    try {
      const result = await createProperty(testProperty);
      if (result.error) {
        addResult(`❌ Create property failed: ${result.error}`);
      } else {
        addResult(`✅ Property created successfully: ${result.data?.title}`);
      }
    } catch (error) {
      addResult(`❌ Create property error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={loading}>
            Test Connection
          </Button>
          <Button onClick={testCreateProperty} disabled={loading || !user}>
            Test Create Property
          </Button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          {testResults.length === 0 ? (
            <p className="text-gray-500">Click "Test Connection" to start testing...</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Make sure you've run the SQL setup in your Supabase dashboard</li>
            <li>Check that your .env file has correct Supabase credentials</li>
            <li>Sign in to test authenticated features</li>
            <li>Use this test to debug connection issues</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseTest;
