import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // FIX: Use the single, unified AuthContext
import { useToast } from "@/components/ui/use-toast"; // FIX: Standardized toast import

// This component is wrapped by ProtectedCustomerRoute, so we don't need a separate login check here.
const CustomerProfile = () => {
  const { user } = useAuth(); // FIX: Use the unified 'user' object from useAuth
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // FIX: State now correctly reflects the nested 'address' structure from the backend User model
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: {
      street: "",
      barangay: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  // FIX: Use useEffect to safely populate state from the user object once it's available.
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        // Assuming the user object from backend contains these fields
        // @ts-ignore
        phoneNumber: user.phoneNumber || "",
        // @ts-ignore
        address: user.address
          ? {
              // @ts-ignore
              street: user.address.street || "",
              // @ts-ignore
              barangay: user.address.barangay || "",
              // @ts-ignore
              city: user.address.city || "",
              // @ts-ignore
              province: user.address.province || "",
              // @ts-ignore
              postalCode: user.address.postalCode || "",
              // @ts-ignore
              country: user.address.country || "",
            }
          : {
              street: "",
              barangay: "",
              city: "",
              province: "",
              postalCode: "",
              country: "",
            },
      });
    }
  }, [user]);

  const handleSave = () => {
    // TODO: In a real app, this would call an API to update the user data.
    // e.g., await updateUser(user._id, editData, token);
    console.log("Saving data:", editData);

    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset editData back to the original user state
    if (user) {
      // @ts-ignore
      setEditData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    }
    setIsEditing(false);
  };

  // Helper to format the date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Customer Profile</h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editData.firstName}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-lg font-medium">{user?.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editData.lastName}
                        onChange={(e) =>
                          setEditData({ ...editData, lastName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-lg font-medium">{user?.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        className="flex-1"
                      />
                    ) : (
                      <p className="text-lg">{user?.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={editData.phoneNumber}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                    ) : (
                      // @ts-ignore
                      <p className="text-lg">
                        {user?.phoneNumber || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* FIX: Updated inputs to handle nested address object */}
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      placeholder="Enter street address"
                      value={editData.address.street}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          address: {
                            ...editData.address,
                            street: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <p className="text-lg">
                      {/* @ts-ignore */}
                      {user?.address?.street || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="barangay">Barangay</Label>
                    {isEditing ? (
                      <Input
                        id="barangay"
                        placeholder="Barangay"
                        value={editData.address.barangay}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            address: {
                              ...editData.address,
                              barangay: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-lg">
                        {/* @ts-ignore */}
                        {user?.address?.barangay || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        placeholder="City"
                        value={editData.address.city}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            address: {
                              ...editData.address,
                              city: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-lg">
                        {/* @ts-ignore */}
                        {user?.address?.city || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="province">Province</Label>
                    {isEditing ? (
                      <Input
                        id="province"
                        placeholder="Province"
                        value={editData.address.province}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            address: {
                              ...editData.address,
                              province: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-lg">
                        {/* @ts-ignore */}
                        {user?.address?.province || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    {isEditing ? (
                      <Input
                        id="postalCode"
                        placeholder="Postal Code"
                        value={editData.address.postalCode}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            address: {
                              ...editData.address,
                              postalCode: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-lg">
                        {/* @ts-ignore */}
                        {user?.address?.postalCode || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    {isEditing ? (
                      <Input
                        id="country"
                        placeholder="Country"
                        value={editData.address.country}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            address: {
                              ...editData.address,
                              country: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-lg">
                        {/* @ts-ignore */}
                        {user?.address?.country || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer ID</span>
                    <Badge variant="secondary">{user?._id}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Account Status
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {/* @ts-ignore */}
                      <span>{formatDate(user?.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerProfile;
