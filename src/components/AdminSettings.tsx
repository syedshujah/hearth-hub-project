import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Database, Mail, Shield, Globe, Bell, Palette } from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "PropertyHub",
    siteDescription: "Your trusted real estate platform",
    contactEmail: "admin@propertyhub.com",
    supportEmail: "support@propertyhub.com",
    timezone: "UTC-5",
    language: "en",
    currency: "USD"
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    enableTwoFactor: false,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableCaptcha: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserRegistration: true,
    newPropertyListing: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: true
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    autoApproveProperties: false,
    enablePropertyComments: true,
    maxFileUploadSize: 10,
    enableAnalytics: true
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "All system settings have been updated successfully.",
      });
      setLoading(false);
    }, 1500);
  };

  const handleResetSettings = () => {
    // Reset to default values
    setGeneralSettings({
      siteName: "PropertyHub",
      siteDescription: "Your trusted real estate platform",
      contactEmail: "admin@propertyhub.com",
      supportEmail: "support@propertyhub.com",
      timezone: "UTC-5",
      language: "en",
      currency: "USD"
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="property-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={generalSettings.siteDescription}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                    <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                    <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                    <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="property-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Verification</Label>
                <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
              </div>
              <Switch
                checked={securitySettings.requireEmailVerification}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireEmailVerification: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Enable 2FA for admin accounts</p>
              </div>
              <Switch
                checked={securitySettings.enableTwoFactor}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: checked }))}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Password Min Length</Label>
                <Input
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                  min="6"
                  max="20"
                />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (min)</Label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  min="5"
                  max="120"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Login Attempts</Label>
                <Input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                  min="3"
                  max="10"
                />
              </div>
              <div className="flex items-center justify-between pt-6">
                <Label>Enable CAPTCHA</Label>
                <Switch
                  checked={securitySettings.enableCaptcha}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableCaptcha: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="property-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable system email notifications</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Notification Types</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">New User Registration</Label>
                <Switch
                  checked={notificationSettings.newUserRegistration}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newUserRegistration: checked }))}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">New Property Listing</Label>
                <Switch
                  checked={notificationSettings.newPropertyListing}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newPropertyListing: checked }))}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">System Alerts</Label>
                <Switch
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">Weekly Reports</Label>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">Monthly Reports</Label>
                <Switch
                  checked={notificationSettings.monthlyReports}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, monthlyReports: checked }))}
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="property-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>System Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
              </div>
              <Switch
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <Switch
                checked={systemSettings.allowRegistration}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, allowRegistration: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Approve Properties</Label>
                <p className="text-sm text-muted-foreground">Automatically approve new listings</p>
              </div>
              <Switch
                checked={systemSettings.autoApproveProperties}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoApproveProperties: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Property Comments</Label>
                <p className="text-sm text-muted-foreground">Enable comments on properties</p>
              </div>
              <Switch
                checked={systemSettings.enablePropertyComments}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enablePropertyComments: checked }))}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Max File Upload Size (MB)</Label>
              <Input
                type="number"
                value={systemSettings.maxFileUploadSize}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileUploadSize: parseInt(e.target.value) }))}
                min="1"
                max="100"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics Tracking</Label>
                <p className="text-sm text-muted-foreground">Enable user analytics</p>
              </div>
              <Switch
                checked={systemSettings.enableAnalytics}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableAnalytics: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="property-card">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">2.3GB</div>
              <div className="text-sm text-muted-foreground">Database Size</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <div className="text-2xl font-bold text-secondary">45MB</div>
              <div className="text-sm text-muted-foreground">Cache Size</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/10">
              <div className="text-2xl font-bold text-warning">12</div>
              <div className="text-sm text-muted-foreground">Pending Tasks</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
