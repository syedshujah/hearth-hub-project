import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { AlertTriangle, Send, User, Mail, Phone, MessageSquare, FileText, Clock, UserPlus, LogIn } from "lucide-react";

interface ComplaintFormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
}

interface Complaint {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  submittedAt: string;
  updatedAt: string;
}

const ComplaintPage = () => {
  const { toast } = useToast();
  const { user, profile, isAuthenticated } = useLocalAuth();
  
  const [formData, setFormData] = useState<ComplaintFormData>({
    name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      userId: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      category: 'property-issue',
      subject: 'Property listing inaccuracy',
      description: 'The property photos do not match the actual property condition.',
      priority: 'high',
      status: 'in-progress',
      submittedAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '2',
      userId: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      category: 'technical',
      subject: 'Website loading issues',
      description: 'The website is very slow and sometimes crashes when browsing properties.',
      priority: 'medium',
      status: 'resolved',
      submittedAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T16:45:00Z'
    }
  ]);

  const categories = [
    { value: 'property-issue', label: 'Property Issue' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'billing', label: 'Billing & Payment' },
    { value: 'service', label: 'Service Quality' },
    { value: 'agent-conduct', label: 'Agent Conduct' },
    { value: 'fraud', label: 'Fraud Report' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-purple-100 text-purple-800' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-600' }
  ];

  const handleInputChange = (field: keyof ComplaintFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a complaint.",
        variant: "destructive",
      });
      handleAuthClick("signup");
      return;
    }
    
    if (!formData.name || !formData.email || !formData.category || !formData.subject || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newComplaint: Complaint = {
        id: Date.now().toString(),
        userId: user.id,
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setComplaints(prev => [newComplaint, ...prev]);

      // Reset form
      setFormData({
        name: profile?.full_name || '',
        email: profile?.email || user?.email || '',
        phone: profile?.phone || '',
        category: '',
        subject: '',
        description: '',
        priority: 'medium'
      });

      toast({
        title: "Complaint Submitted Successfully",
        description: `Your complaint has been submitted with ID: ${newComplaint.id}. We'll review it shortly.`,
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    return priorities.find(p => p.value === priority)?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter complaints to show only current user's complaints
  const userComplaints = isAuthenticated && user 
    ? complaints.filter(complaint => complaint.userId === user.id)
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Submit a Complaint</h1>
            <p className="text-xl opacity-90">
              We take your concerns seriously. Submit your complaint and we'll work to resolve it promptly.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {!isAuthenticated ? (
            /* Authentication Required Section */
            <div className="max-w-2xl mx-auto text-center">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <LogIn className="w-8 h-8" />
                    Authentication Required
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Please sign in to submit and track your complaints
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    To ensure the security and privacy of your complaints, you need to be logged in to access this feature.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => handleAuthClick("login")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => handleAuthClick("signup")}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Complaint Form */}
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Submit New Complaint
                </CardTitle>
                <CardDescription>
                  Please provide detailed information about your complaint so we can assist you effectively.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Complaint Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complaint category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your complaint"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide a detailed description of your complaint, including any relevant dates, names, or reference numbers..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Complaint
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Complaints / Status */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Complaints
                  </CardTitle>
                  <CardDescription>
                    Track the status of your submitted complaints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userComplaints.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No complaints submitted yet</p>
                      </div>
                    ) : (
                      userComplaints.slice(0, 3).map((complaint) => (
                        <div key={complaint.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{complaint.subject}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                ID: {complaint.id}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getStatusColor(complaint.status)}>
                                {statuses.find(s => s.value === complaint.status)?.label}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                                {priorities.find(p => p.value === complaint.priority)?.label}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {complaint.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Submitted: {formatDate(complaint.submittedAt)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Immediate Help?</CardTitle>
                  <CardDescription>
                    For urgent matters, contact us directly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Emergency Hotline</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 911-HELP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">complaints@hearth-hub.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
        </div>
      </div>
      
      {/* Auth Modal for non-authenticated users */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultMode={authMode} 
      />
    </div>
  );
};

export default ComplaintPage;
