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
import { useToast } from "@/components/ui/use-toast"; // Corrected hook path

export const BusinessSettings: React.FC = () => {
  const { toast } = useToast();
  const [businessSettings, setBusinessSettings] = useState({
    defaultLeadTime: "6-8 weeks",
    // shippingRadius: "100", // Consider if this is needed
    warrantyPeriod: "5",
    // maxOrderValue: "5000000", // Consider if these limits are enforced
    // minOrderValue: "50000"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBusinessSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    // TODO: Implement backend API call to save business settings
    console.log("Saving Business Settings:", businessSettings);
    toast({
      title: "Business settings updated",
      description: "Your business configuration has been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Operations</CardTitle>
        <CardDescription>
          Configure business-specific operational settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="defaultLeadTime">Default Product Lead Time</Label>
            <Input
              id="defaultLeadTime"
              value={businessSettings.defaultLeadTime}
              onChange={handleChange}
              placeholder="e.g., 6-8 weeks"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="warrantyPeriod">
              Standard Warranty Period (years)
            </Label>
            <Input
              id="warrantyPeriod"
              type="number"
              value={businessSettings.warrantyPeriod}
              onChange={handleChange}
              placeholder="e.g., 5"
            />
          </div>
        </div>
        {/* Add inputs for other fields like min/max order value if needed */}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save business settings</Button>
      </CardFooter>
    </Card>
  );
};
