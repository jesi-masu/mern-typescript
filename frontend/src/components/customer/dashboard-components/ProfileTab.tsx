// src/components/customer/dashboard-components/ProfileTab.tsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export const ProfileTab = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  First Name
                </label>
                <p className="text-lg">{user.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <p className="text-lg">{user.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Customer ID
                </label>
                <p className="text-lg">{user._id}</p>
              </div>
              {/* Add other user fields as needed */}
            </>
          ) : (
            <p>Could not load user profile.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
