import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"; // Corrected hook path

export const SystemSettings: React.FC = () => {
  const { toast } = useToast();
  const [systemSettings, setSystemSettings] = useState({
    currency: "PHP",
    timezone: "Asia/Manila",
    dateFormat: "YYYY-MM-DD", // Changed default to ISO format
    // leadTimeBuffer: "2", // Removed if not actively used
    autoBackup: true,
    maintenanceMode: false,
  });

  const handleValueChange = (
    key: keyof typeof systemSettings,
    value: string | boolean
  ) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // TODO: Implement backend API call to save system settings
    console.log("Saving System Settings:", systemSettings);
    toast({
      title: "System settings updated",
      description: "Your system configuration has been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure system-wide settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select
              value={systemSettings.currency}
              onValueChange={(v) => handleValueChange("currency", v)}
            >
              <SelectTrigger id="currency">
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
            <Select
              value={systemSettings.timezone}
              onValueChange={(v) => handleValueChange("timezone", v)}
            >
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Manila">Asia/Manila (PHT)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">
                  America/New_York (ET)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select
              value={systemSettings.dateFormat}
              onValueChange={(v) => handleValueChange("dateFormat", v)}
            >
              <SelectTrigger id="dateFormat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoBackup">Automatic Backup</Label>
            <p className="text-sm text-muted-foreground">
              Enable automatic daily backups of system data.
            </p>
          </div>
          <Switch
            id="autoBackup"
            checked={systemSettings.autoBackup}
            onCheckedChange={(v) => handleValueChange("autoBackup", v)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">
              Temporarily disable access for system updates.
            </p>
          </div>
          <Switch
            id="maintenanceMode"
            checked={systemSettings.maintenanceMode}
            onCheckedChange={(v) => handleValueChange("maintenanceMode", v)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save settings</Button>
      </CardFooter>
    </Card>
  );
};
