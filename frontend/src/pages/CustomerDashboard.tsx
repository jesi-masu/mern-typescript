// frontend/src/pages/CustomerDashboard.tsx
import React from "react";
import Layout from "@/components/Layout";
import CustomerDashboard from "@/components/customer/CustomerDashboard";

/**
 * Renders the main customer dashboard page.
 * Note: This component is wrapped by `ProtectedCustomerRoute` in `App.tsx`,
 * which handles the authentication check. Therefore, this component can
 * assume that a user is authenticated.
 */
const CustomerDashboardPage = () => {
  return (
    <Layout>
      {/* The CustomerDashboard component contains the main UI for the authenticated customer. */}
      <CustomerDashboard />
    </Layout>
  );
};

export default CustomerDashboardPage;
