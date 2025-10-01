import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { getEmailInitials } from "@/utils/avatar";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { markAsRead, markAllAsRead, deleteNotification } from "@/store/notificationSlice";
import AuthModal from "@/components/auth/AuthModal";
import { Bell, Search, Settings, User, LogOut, X, Check, Clock, AlertCircle, Calendar, UserPlus } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  onSearch?: (query: string) => void;
}

const DashboardHeader = ({ title, onSearch }: DashboardHeaderProps) => {
  const { toast } = useToast();
  const { user, profile, signOut, updateProfile, isAuthenticated } = useLocalAuth();
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(state => state.notifications);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const [profileForm, setProfileForm] = useState({
    name: profile?.full_name || "User",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    joinDate: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Unknown"
  });


  // Update profileForm when profile data changes
  useEffect(() => {
    setProfileForm({
      name: profile?.full_name || "User",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
      joinDate: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Unknown"
    });
  }, [profile, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      toast({
        title: "Search Performed",
        description: `Searching for: "${searchQuery}"`,
      });
      setIsSearchOpen(false);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    // Only mark current user's notifications as read
    myNotifications.filter(n => !n.read).forEach(n => dispatch(markAsRead(n.id)));
    toast({
      title: "Notifications Updated",
      description: "All your notifications marked as read",
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    dispatch(deleteNotification(notificationId));
  };

  const handleProfileUpdate = async () => {
    if (!profile) return;

    const updates = {
      full_name: profileForm.name,
      phone: profileForm.phone,
      location: profileForm.location,
      bio: profileForm.bio,
    };

    const { error } = await updateProfile(updates);
    
    if (!error) {
      setIsProfileOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <Check className="w-4 h-4 text-success" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-warning" />;
      case "error": return <X className="w-4 h-4 text-destructive" />;
      default: return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Only show notifications that belong to the logged-in user.
  // If a notification has a userId, it must match the current user's id to be visible.
  const myNotifications = notifications.filter(n => (n.userId ? n.userId === user?.id : true));
  const myUnreadCount = myNotifications.filter(n => !n.read).length;

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Search */}
              <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Search Dashboard</DialogTitle>
                    <DialogDescription>
                      Search for users, properties, or any content in the admin dashboard.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search Query</Label>
                      <Input
                        id="search"
                        placeholder="Enter your search query..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsSearchOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!searchQuery.trim()}>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Notifications */}
              <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="w-4 h-4" />
                    {myUnreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full text-xs flex items-center justify-center">
                        {myUnreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <div className="flex items-center justify-between p-3 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                      Mark all read
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {myNotifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      myNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b hover:bg-muted/50 cursor-pointer ${
                            !notification.read ? "bg-primary/5" : ""
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">
                                  {notification.title}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification.id);
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <Badge variant="secondary" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getEmailInitials(user?.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.full_name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {profile?.email || user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Profile Settings</DialogTitle>
                        <DialogDescription>
                          Update your profile information and preferences.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                              value={profileForm.name}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={profileForm.location}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Bio</Label>
                          <Textarea
                            value={profileForm.bio}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                          />
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {profileForm.joinDate}</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleProfileUpdate}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sign Out</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to sign out? You will need to log in again to access the admin dashboard.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSignOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Sign Out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Sign In / Get Started buttons for non-authenticated users */}
              <Button 
                variant="outline" 
                onClick={() => handleAuthClick("login")}
                className="flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
              <Button 
                onClick={() => handleAuthClick("signup")}
                className="flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Auth Modal for non-authenticated users */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultMode={authMode} 
      />
    </header>
  );
};

export default DashboardHeader;
