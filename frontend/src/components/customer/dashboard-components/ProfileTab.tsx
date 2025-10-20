import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import {
  Key,
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface UserProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    barangaySubdivision?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
}

const fetchUserProfile = async (
  userId: string | undefined,
  token: string | null
): Promise<UserProfileData> => {
  if (!userId || !token) {
    throw new Error("User ID or token is missing.");
  }
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user profile.");
  }
  return response.json();
};

const Label: React.FC<{
  children: React.ReactNode;
  icon?: React.ElementType;
}> = ({ children, icon: Icon }) => (
  <label className="text-sm font-medium text-gray-600 flex items-center gap-1 mb-1">
    {Icon && <Icon className="h-4 w-4 text-gray-500" />}
    {children}
  </label>
);

const DataDisplay: React.FC<{ value: string | undefined | null }> = ({
  value,
}) => (
  <p className="text-md font-medium bg-gray-50 p-2 rounded border border-gray-200 min-h-[40px]">
    {value || <span className="text-gray-400 italic">Not provided</span>}
  </p>
);

export const ProfileTab = () => {
  const { user: authUser, token } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery<UserProfileData>({
    queryKey: ["userProfile", authUser?._id],
    queryFn: () => fetchUserProfile(authUser?._id, token),
    enabled: !!authUser?._id && !!token,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error || !profileData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          Could not load user profile. Please try refreshing.
          {(error as Error)?.message && (
            <p className="text-sm mt-1">({(error as Error).message})</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-6 w-6" /> Profile Information
          </CardTitle>
          <CardDescription>Your personal and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <DataDisplay value={profileData.firstName} />
            </div>
            <div>
              <Label>Last Name</Label>
              <DataDisplay value={profileData.lastName} />
            </div>
            <div>
              <Label icon={Mail}>Email</Label>
              <DataDisplay value={profileData.email} />
            </div>
            <div>
              <Label icon={Phone}>Phone Number</Label>
              <DataDisplay value={profileData.phoneNumber} />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" /> Address
            </h3>
            {profileData.address ? (
              <p className="text-gray-700 leading-relaxed text-sm">
                {profileData.address.street || "[No Street]"},{" "}
                {profileData.address.barangaySubdivision ||
                  "[No Barangay/Subdivision]"}
                <br />
                {profileData.address.city || "[No City]"},{" "}
                {profileData.address.province || "[No Province]"}{" "}
                {profileData.address.postalCode || "[No Postal Code]"}
                <br />
                {profileData.address.country || "[No Country]"}
              </p>
            ) : (
              <p className="text-gray-500 italic text-sm">
                No address on file.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
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
