// frontend/src/components/home/CustomerDashboardSection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Package, Bell, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // FIX: Use the unified AuthContext
import CustomerDashboard from "../customer/CustomerDashboard";
import { useNavigate } from "react-router-dom";

const CustomerDashboardSection = () => {
  const { isAuthenticated } = useAuth(); // FIX: Use the unified AuthContext
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Customer Portal</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access your personalized dashboard to track orders, receive
            notifications, and manage your prefab construction projects.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Card className="text-center p-6">
                  <CardHeader>
                    <User className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <CardTitle>Access Your Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      Login to view your orders, track progress, and receive
                      important updates from our team.
                    </p>
                    {/* FIX: Navigate to the main login page instead of opening a dialog */}
                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full"
                    >
                      Customer Login
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Order Tracking</h3>
                    <p className="text-sm text-gray-600">
                      Monitor your project progress in real-time
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <Bell className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Instant Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Get updates on order status changes
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Direct Communication</h3>
                    <p className="text-sm text-gray-600">
                      Receive messages from our admin team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // If authenticated, show the dashboard directly
          <CustomerDashboard />
        )}
      </div>
    </section>
  );
};

export default CustomerDashboardSection;
