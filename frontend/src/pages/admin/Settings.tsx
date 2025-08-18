
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  
  // Company Information State
  const [companyInfo, setCompanyInfo] = useState({
    name: "Prefab Container Solutions Inc.",
    email: "contact@prefabsolutions.com",
    phone: "(555) 123-4567",
    address: "123 Prefab Way, Building City, CA 94523",
    website: "www.prefabsolutions.com",
    taxId: "12-3456789",
    businessLicense: "BL-2024-001"
  });

  // Notification State
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    inventoryAlerts: true,
    customerMessages: false,
    systemUpdates: true,
    marketingEmails: false
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    currency: "PHP",
    timezone: "Asia/Manila",
    dateFormat: "MM/DD/YYYY",
    leadTimeBuffer: "2",
    autoBackup: true,
    maintenanceMode: false
  });

  // Business Settings State
  const [businessSettings, setBusinessSettings] = useState({
    defaultLeadTime: "6-8 weeks",
    shippingRadius: "100",
    warrantyPeriod: "5",
    maxOrderValue: "5000000",
    minOrderValue: "50000"
  });

  const handleCompanyInfoSave = () => {
    // Here you would typically save to database
    toast({
      title: "Company information updated",
      description: "Your company details have been saved successfully.",
    });
  };

  const handleNotificationsSave = () => {
    // Here you would typically save to database
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handleSystemSettingsSave = () => {
    // Here you would typically save to database
    toast({
      title: "System settings updated",
      description: "Your system configuration has been saved.",
    });
  };

  const handleBusinessSettingsSave = () => {
    // Here you would typically save to database
    toast({
      title: "Business settings updated",
      description: "Your business configuration has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <div className="grid gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company name</Label>
              <Input 
                id="company-name" 
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input 
                  id="phone" 
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={companyInfo.website}
                  onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID</Label>
                <Input 
                  id="tax-id" 
                  value={companyInfo.taxId}
                  onChange={(e) => setCompanyInfo({...companyInfo, taxId: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-license">Business License</Label>
              <Input 
                id="business-license" 
                value={companyInfo.businessLicense}
                onChange={(e) => setCompanyInfo({...companyInfo, businessLicense: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCompanyInfoSave}>Save changes</Button>
          </CardFooter>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-orders">New orders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when new orders are placed.
                </p>
              </div>
              <Switch 
                id="new-orders" 
                checked={notifications.newOrders}
                onCheckedChange={(checked) => setNotifications({...notifications, newOrders: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="order-updates">Order status updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when order statuses change.
                </p>
              </div>
              <Switch 
                id="order-updates" 
                checked={notifications.orderUpdates}
                onCheckedChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inventory-alerts">Inventory alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when product inventory is low.
                </p>
              </div>
              <Switch 
                id="inventory-alerts" 
                checked={notifications.inventoryAlerts}
                onCheckedChange={(checked) => setNotifications({...notifications, inventoryAlerts: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="customer-messages">Customer messages</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when customers send messages.
                </p>
              </div>
              <Switch 
                id="customer-messages" 
                checked={notifications.customerMessages}
                onCheckedChange={(checked) => setNotifications({...notifications, customerMessages: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-updates">System updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about system maintenance and updates.
                </p>
              </div>
              <Switch 
                id="system-updates" 
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNotificationsSave}>Save preferences</Button>
          </CardFooter>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure system-wide settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHP">Philippine Peso (PHP)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Manila">Asia/Manila</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-time-buffer">Lead Time Buffer (weeks)</Label>
                <Input 
                  id="lead-time-buffer" 
                  type="number"
                  value={systemSettings.leadTimeBuffer}
                  onChange={(e) => setSystemSettings({...systemSettings, leadTimeBuffer: e.target.value})}
                />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-backup">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic daily backups of system data.
                </p>
              </div>
              <Switch 
                id="auto-backup" 
                checked={systemSettings.autoBackup}
                onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Put the system in maintenance mode for updates.
                </p>
              </div>
              <Switch 
                id="maintenance-mode" 
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSystemSettingsSave}>Save settings</Button>
          </CardFooter>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
            <CardDescription>
              Configure business-specific settings and limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-lead-time">Default Lead Time</Label>
                <Input 
                  id="default-lead-time" 
                  value={businessSettings.defaultLeadTime}
                  onChange={(e) => setBusinessSettings({...businessSettings, defaultLeadTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping-radius">Free Shipping Radius (miles)</Label>
                <Input 
                  id="shipping-radius" 
                  type="number"
                  value={businessSettings.shippingRadius}
                  onChange={(e) => setBusinessSettings({...businessSettings, shippingRadius: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warranty-period">Warranty Period (years)</Label>
                <Input 
                  id="warranty-period" 
                  type="number"
                  value={businessSettings.warrantyPeriod}
                  onChange={(e) => setBusinessSettings({...businessSettings, warrantyPeriod: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-order-value">Maximum Order Value (PHP)</Label>
                <Input 
                  id="max-order-value" 
                  type="number"
                  value={businessSettings.maxOrderValue}
                  onChange={(e) => setBusinessSettings({...businessSettings, maxOrderValue: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-order-value">Minimum Order Value (PHP)</Label>
              <Input 
                id="min-order-value" 
                type="number"
                value={businessSettings.minOrderValue}
                onChange={(e) => setBusinessSettings({...businessSettings, minOrderValue: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBusinessSettingsSave}>Save business settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
