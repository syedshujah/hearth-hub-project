import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAgent?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireAgent = false,
  fallback 
}: ProtectedRouteProps) => {
  const { user, profile, loading, isAdmin, isAgent } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive"
      });
    } else if (!loading && user && requireAdmin && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
    } else if (!loading && user && requireAgent && !isAgent) {
      toast({
        title: "Access Denied",
        description: "You need agent or admin privileges to access this page.",
        variant: "destructive"
      });
    }
  }, [user, profile, loading, requireAdmin, requireAgent, isAdmin, isAgent, toast]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading...</h3>
            <p className="text-muted-foreground text-center">
              Please wait while we verify your authentication.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground text-center">
              You need to sign in to access this page. Please use the login button in the navigation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check admin requirements
  if (requireAdmin && !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Shield className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-center">
              You need administrator privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check agent requirements
  if (requireAgent && !isAgent) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Shield className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-center">
              You need agent or administrator privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
