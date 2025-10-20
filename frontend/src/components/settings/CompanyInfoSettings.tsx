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

export const CompanyInfoSettings: React.FC = () => {
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = useState({
    name: "Prefab Container Solutions Inc.",
    email: "contact@prefabsolutions.com",
    phone: "(555) 123-4567",
    address: "123 Prefab Way, Building City, CA 94523",
    website: "www.prefabsolutions.com",
    taxId: "12-3456789",
    businessLicense: "BL-2024-001",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCompanyInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    // TODO: Implement backend API call to save company info
    console.log("Saving Company Info:", companyInfo);
    toast({
      title: "Company information updated",
      description: "Your company details have been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Update your company details and contact information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Company name</Label>
          <Input id="name" value={companyInfo.name} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={companyInfo.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              value={companyInfo.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={companyInfo.address}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={companyInfo.website}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              value={companyInfo.taxId}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessLicense">Business License</Label>
          <Input
            id="businessLicense"
            value={companyInfo.businessLicense}
            onChange={handleChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save changes</Button>
      </CardFooter>
    </Card>
  );
};
