import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, Trash2, Shield, ShieldOff, Mail, Calendar, User } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "User" | "Agent" | "Admin";
  status: "Active" | "Blocked" | "Pending";
  joined: string;
  properties: number;
  lastLogin: string;
}

const ManageUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [users, setUsers] = useState<UserData[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active", joined: "2024-01-15", properties: 3, lastLogin: "2024-01-25" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Agent", status: "Active", joined: "2024-01-10", properties: 12, lastLogin: "2024-01-24" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "User", status: "Blocked", joined: "2024-01-08", properties: 0, lastLogin: "2024-01-20" },
    { id: 4, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", joined: "2023-12-01", properties: 0, lastLogin: "2024-01-25" },
    { id: 5, name: "Mike Brown", email: "mike@example.com", role: "Agent", status: "Pending", joined: "2024-01-20", properties: 5, lastLogin: "2024-01-23" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User" as "User" | "Agent" | "Admin",
    status: "Active" as "Active" | "Blocked" | "Pending"
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Active" ? "Blocked" : "Active" }
        : user
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: `User ${user?.status === "Active" ? "Blocked" : "Unblocked"}`,
      description: `${user?.name} has been ${user?.status === "Active" ? "blocked" : "unblocked"} successfully.`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the system.`,
      variant: "destructive"
    });
  };

  const handleEditUser = (user: UserData) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    setEditingUser(null);
    toast({
      title: "User Updated",
      description: `${user.name}'s information has been updated successfully.`,
    });
  };

  const handleAddUser = () => {
    const user: UserData = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...newUser,
      joined: new Date().toISOString().split('T')[0],
      properties: 0,
      lastLogin: "Never"
    };
    setUsers(prev => [...prev, user]);
    setNewUser({ name: "", email: "", role: "User", status: "Active" });
    setIsAddDialogOpen(false);
    toast({
      title: "User Added",
      description: `${user.name} has been added to the system.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Manage Users</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account in the system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUser.role} onValueChange={(value: "User" | "Agent" | "Admin") => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="property-card">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Filter by Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Results</Label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                <span className="text-sm text-muted-foreground">{filteredUsers.length} users found</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="property-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined: {user.joined}</span>
                      </div>
                      <span>•</span>
                      <span>Properties: {user.properties}</span>
                      <span>•</span>
                      <span>Last login: {user.lastLogin}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={user.role === "Admin" ? "default" : user.role === "Agent" ? "secondary" : "outline"}>{user.role}</Badge>
                  <Badge variant={user.status === "Active" ? "default" : user.status === "Blocked" ? "destructive" : "secondary"}>{user.status}</Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information and permissions.</DialogDescription>
                      </DialogHeader>
                      {editingUser && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                              value={editingUser.name}
                              onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                              value={editingUser.email}
                              onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={editingUser.role} onValueChange={(value: "User" | "Agent" | "Admin") => setEditingUser(prev => prev ? { ...prev, role: value } : null)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Agent">Agent</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={editingUser.status} onValueChange={(value: "Active" | "Blocked" | "Pending") => setEditingUser(prev => prev ? { ...prev, status: value } : null)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Blocked">Blocked</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                        <Button onClick={() => editingUser && handleEditUser(editingUser)}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleToggleStatus(user.id)}
                    className={user.status === "Active" ? "text-destructive hover:text-destructive" : "text-success hover:text-success"}
                  >
                    {user.status === "Active" ? (
                      <>
                        <ShieldOff className="w-4 h-4 mr-1" />
                        Block
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-1" />
                        Unblock
                      </>
                    )}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {user.name}? This action cannot be undone and will remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="property-card">
          <CardContent className="p-12 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Users Found</h3>
            <p className="text-muted-foreground">No users match your current search and filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageUsers;
