import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Briefcase } from "lucide-react";

const LoginCredentials = () => {
  const credentials = [
    {
      role: "Admin",
      email: "admin@example.com",
      password: "admin123",
      icon: Shield,
      color: "bg-red-500"
    },
    {
      role: "Agent",
      email: "agent@example.com", 
      password: "agent123",
      icon: Briefcase,
      color: "bg-blue-500"
    },
    {
      role: "User",
      email: "user@example.com",
      password: "user123", 
      icon: User,
      color: "bg-green-500"
    }
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Demo Login Credentials</CardTitle>
        <CardDescription className="text-center">
          Use these credentials to test the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {credentials.map((cred) => (
          <div key={cred.role} className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className={`p-2 rounded-full ${cred.color} text-white`}>
              <cred.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{cred.role}</span>
                <Badge variant="outline" className="text-xs">
                  {cred.role.toLowerCase()}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Email: <code className="text-xs bg-muted px-1 rounded">{cred.email}</code></div>
                <div>Password: <code className="text-xs bg-muted px-1 rounded">{cred.password}</code></div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-xs text-muted-foreground text-center mt-4 p-2 bg-muted rounded">
          💡 Your login state will persist after page refresh!
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginCredentials;
