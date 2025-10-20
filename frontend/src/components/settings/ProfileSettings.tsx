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
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import { Key } from "lucide-react";

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Update",
      description: "Profile update functionality not yet implemented.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Update your personal information. Password is changed separately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-firstName">First Name</Label>
              <Input
                id="profile-firstName"
                defaultValue={user?.firstName || ""}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-lastName">Last Name</Label>
              <Input
                id="profile-lastName"
                defaultValue={user?.lastName || ""}
                disabled
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              defaultValue={user?.email || ""}
              disabled
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <Key className="mr-2 h-4 w-4" /> Change Password
          </Button>
        </CardFooter>
      </Card>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </>
  );
};
