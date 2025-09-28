import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const ManageUsers = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active", joined: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Agent", status: "Active", joined: "2024-01-10" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "User", status: "Blocked", joined: "2024-01-08" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Manage Users</h2>
      
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="property-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Joined: {user.joined}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={user.role === "Agent" ? "default" : "secondary"}>{user.role}</Badge>
                  <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
                  <Button variant="outline" size="sm">Block</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;