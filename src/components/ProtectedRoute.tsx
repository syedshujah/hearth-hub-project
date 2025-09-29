import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalAuth } from '@/contexts/LocalAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo = '/signup' }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useLocalAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Create returnTo parameter with current path
      const returnTo = encodeURIComponent(location.pathname + location.search);
      navigate(`${redirectTo}?returnTo=${returnTo}`, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo, location]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, return null (redirect will happen in useEffect)
  return null;
};

export default ProtectedRoute;
