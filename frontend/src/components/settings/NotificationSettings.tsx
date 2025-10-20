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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast"; // Corrected hook path

export const NotificationSettings: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    inventoryAlerts: true,
    customerMessages: false,
    systemUpdates: true,
    // marketingEmails: false // Removed if not needed
  });

  const handleCheckedChange = (
    id: keyof typeof notifications,
    checked: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSave = () => {
    // TODO: Implement backend API call to save notification preferences
    console.log("Saving Notification Settings:", notifications);
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configure how you receive system notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NotificationItem
          id="newOrders"
          label="New orders"
          description="Receive notifications when new orders are placed."
          checked={notifications.newOrders}
          onCheckedChange={handleCheckedChange}
        />
        <Separator />
        <NotificationItem
          id="orderUpdates"
          label="Order status updates"
          description="Get notified when order statuses change."
          checked={notifications.orderUpdates}
          onCheckedChange={handleCheckedChange}
        />
        <Separator />
        <NotificationItem
          id="inventoryAlerts"
          label="Inventory alerts"
          description="Receive alerts when product inventory is low (if applicable)."
          checked={notifications.inventoryAlerts}
          onCheckedChange={handleCheckedChange}
        />
        <Separator />
        <NotificationItem
          id="customerMessages"
          label="Customer messages"
          description="Get notified when customers send messages (if applicable)."
          checked={notifications.customerMessages}
          onCheckedChange={handleCheckedChange}
        />
        <Separator />
        <NotificationItem
          id="systemUpdates"
          label="System updates"
          description="Receive notifications about system maintenance and updates."
          checked={notifications.systemUpdates}
          onCheckedChange={handleCheckedChange}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save preferences</Button>
      </CardFooter>
    </Card>
  );
};

// Helper sub-component for notification items
interface NotificationItemProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (id: any, checked: boolean) => void;
}
const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}) => (
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <Label htmlFor={id} className="text-base">
        {label}
      </Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={(val) => onCheckedChange(id, val)}
    />
  </div>
);
