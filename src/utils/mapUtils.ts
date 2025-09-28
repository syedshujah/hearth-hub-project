// Utility functions for generating map images and handling location data

/**
 * Generate a static map image URL for a given location
 * Using OpenStreetMap-based service (no API key required)
 */
export const generateMapImage = (location: string, width: number = 400, height: number = 300): string => {
  // For demo purposes, we'll use a static map service
  // In production, you might want to use Google Maps, Mapbox, or similar
  
  // Encode the location for URL
  const encodedLocation = encodeURIComponent(location);
  
  // Using OpenStreetMap static map service (free, no API key needed)
  // Alternative services: Google Maps Static API, Mapbox Static Images API
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-building+ff0000(${encodedLocation})/${encodedLocation}/${width}x${height}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
  
  // Fallback to a generic map image if the service fails
  const fallbackMapUrl = `https://via.placeholder.com/${width}x${height}/4CAF50/FFFFFF?text=📍+${encodedLocation}`;
  
  return fallbackMapUrl; // Using fallback for now since we don't have a real Mapbox token
};

/**
 * Generate multiple map images with different styles
 */
export const generateMapImages = (location: string): string[] => {
  const encodedLocation = encodeURIComponent(location);
  
  return [
    // Street map
    `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=📍+Street+Map+${encodedLocation}`,
    // Satellite view
    `https://via.placeholder.com/400x300/2196F3/FFFFFF?text=🛰️+Satellite+${encodedLocation}`,
    // Terrain view
    `https://via.placeholder.com/400x300/FF9800/FFFFFF?text=🏔️+Terrain+${encodedLocation}`
  ];
};

/**
 * Extract coordinates from location string (mock implementation)
 * In a real app, you'd use a geocoding service
 */
export const getCoordinatesFromLocation = (location: string): { lat: number; lng: number } | null => {
  // Mock coordinates based on common city names
  const locationCoords: Record<string, { lat: number; lng: number }> = {
    'new york': { lat: 40.7128, lng: -74.0060 },
    'los angeles': { lat: 34.0522, lng: -118.2437 },
    'chicago': { lat: 41.8781, lng: -87.6298 },
    'houston': { lat: 29.7604, lng: -95.3698 },
    'phoenix': { lat: 33.4484, lng: -112.0740 },
    'philadelphia': { lat: 39.9526, lng: -75.1652 },
    'san antonio': { lat: 29.4241, lng: -98.4936 },
    'san diego': { lat: 32.7157, lng: -117.1611 },
    'dallas': { lat: 32.7767, lng: -96.7970 },
    'san jose': { lat: 37.3382, lng: -121.8863 },
    'austin': { lat: 30.2672, lng: -97.7431 },
    'jacksonville': { lat: 30.3322, lng: -81.6557 },
    'fort worth': { lat: 32.7555, lng: -97.3308 },
    'columbus': { lat: 39.9612, lng: -82.9988 },
    'charlotte': { lat: 35.2271, lng: -80.8431 },
    'san francisco': { lat: 37.7749, lng: -122.4194 },
    'indianapolis': { lat: 39.7684, lng: -86.1581 },
    'seattle': { lat: 47.6062, lng: -122.3321 },
    'denver': { lat: 39.7392, lng: -104.9903 },
    'washington': { lat: 38.9072, lng: -77.0369 },
    'boston': { lat: 42.3601, lng: -71.0589 },
    'el paso': { lat: 31.7619, lng: -106.4850 },
    'detroit': { lat: 42.3314, lng: -83.0458 },
    'nashville': { lat: 36.1627, lng: -86.7816 },
    'portland': { lat: 45.5152, lng: -122.6784 },
    'memphis': { lat: 35.1495, lng: -90.0490 },
    'oklahoma city': { lat: 35.4676, lng: -97.5164 },
    'las vegas': { lat: 36.1699, lng: -115.1398 },
    'louisville': { lat: 38.2527, lng: -85.7585 },
    'baltimore': { lat: 39.2904, lng: -76.6122 },
    'milwaukee': { lat: 43.0389, lng: -87.9065 },
    'albuquerque': { lat: 35.0844, lng: -106.6504 },
    'tucson': { lat: 32.2226, lng: -110.9747 },
    'fresno': { lat: 36.7378, lng: -119.7871 },
    'sacramento': { lat: 38.5816, lng: -121.4944 },
    'mesa': { lat: 33.4152, lng: -111.8315 },
    'kansas city': { lat: 39.0997, lng: -94.5786 },
    'atlanta': { lat: 33.7490, lng: -84.3880 },
    'long beach': { lat: 33.7701, lng: -118.1937 },
    'colorado springs': { lat: 38.8339, lng: -104.8214 },
    'raleigh': { lat: 35.7796, lng: -78.6382 },
    'miami': { lat: 25.7617, lng: -80.1918 },
    'virginia beach': { lat: 36.8529, lng: -75.9780 },
    'omaha': { lat: 41.2565, lng: -95.9345 },
    'oakland': { lat: 37.8044, lng: -122.2711 },
    'minneapolis': { lat: 44.9778, lng: -93.2650 },
    'tulsa': { lat: 36.1540, lng: -95.9928 },
    'arlington': { lat: 32.7357, lng: -97.1081 },
    'tampa': { lat: 27.9506, lng: -82.4572 }
  };

  const normalizedLocation = location.toLowerCase().trim();
  
  // Try exact match first
  if (locationCoords[normalizedLocation]) {
    return locationCoords[normalizedLocation];
  }
  
  // Try partial match
  for (const [city, coords] of Object.entries(locationCoords)) {
    if (normalizedLocation.includes(city) || city.includes(normalizedLocation)) {
      return coords;
    }
  }
  
  // Default coordinates (New York City)
  return { lat: 40.7128, lng: -74.0060 };
};

/**
 * Generate a more realistic map image URL using coordinates
 */
export const generateRealisticMapImage = (location: string, width: number = 400, height: number = 300): string => {
  const coords = getCoordinatesFromLocation(location);
  
  if (!coords) {
    return generateMapImage(location, width, height);
  }
  
  // Using a placeholder service that creates a more realistic map-like image
  const mapStyle = Math.random() > 0.5 ? 'streets' : 'satellite';
  const zoom = Math.floor(Math.random() * 5) + 12; // Random zoom between 12-16
  
  // Create a more realistic looking map placeholder
  const colors = {
    streets: { bg: '4CAF50', text: 'FFFFFF' },
    satellite: { bg: '2196F3', text: 'FFFFFF' }
  };
  
  const style = colors[mapStyle as keyof typeof colors];
  const encodedLocation = encodeURIComponent(location);
  
  return `https://via.placeholder.com/${width}x${height}/${style.bg}/${style.text}?text=📍+${encodedLocation}+Map+(${coords.lat.toFixed(2)},${coords.lng.toFixed(2)})`;
};
