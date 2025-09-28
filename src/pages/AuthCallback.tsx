import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Verification Failed",
            description: error.message,
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        if (data.session) {
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. Welcome!",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Verification Complete",
            description: "Please sign in to continue.",
          });
          navigate("/");
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Something went wrong",
          description: "Please try signing in again.",
          variant: "destructive"
        });
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Verifying your email...</h3>
          <p className="text-muted-foreground text-center">
            Please wait while we confirm your email address.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
