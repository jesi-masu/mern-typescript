import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main (customer) auth + app-level providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { OrderUpdatesProvider } from "./context/OrderUpdatesContext";

// Admin auth provider and protected route wrapper
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

// Public / Customer pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FAQ from "./pages/FAQ";
import Checkout from "./pages/Checkout";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerDashboardPage from "./pages/CustomerDashboard";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";

// Admin pages & layout
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductFormPage from "./pages/admin/ProductFormPage";
import ProductViewPage from "./pages/admin/ProductViewPage";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import AdminProjects from "./pages/admin/AdminProjects";
import Contracts from "./pages/admin/Contracts";
import Messages from "./pages/admin/Messages";
import CustomerUploads from "./pages/admin/CustomerUploads";
import ManagePersonnel from "./pages/admin/ManagePersonnel";
import RecordsUpload from "./pages/admin/RecordsUpload";
import ActivityLog from "./pages/admin/ActivityLog";

// Customer-protected route component
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Global providers: AuthProvider wraps the whole app (customer auth) */}
          <AuthProvider>
            <OrderUpdatesProvider>
              <CartProvider>
                <OrderProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/project/:id" element={<ProjectDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/faq" element={<FAQ />} />

                    {/* Customer Protected Routes */}
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedCustomerRoute>
                          <Checkout />
                        </ProtectedCustomerRoute>
                      }
                    />
                    <Route
                      path="/customer-profile"
                      element={
                        <ProtectedCustomerRoute>
                          <CustomerProfile />
                        </ProtectedCustomerRoute>
                      }
                    />
                    <Route
                      path="/customer-dashboard"
                      element={
                        <ProtectedCustomerRoute>
                          <CustomerDashboardPage />
                        </ProtectedCustomerRoute>
                      }
                    />
                    <Route
                      path="/order-history"
                      element={
                        <ProtectedCustomerRoute>
                          <OrderHistory />
                        </ProtectedCustomerRoute>
                      }
                    />
                    <Route
                      path="/order-tracking/:id"
                      element={
                        <ProtectedCustomerRoute>
                          <OrderTracking />
                        </ProtectedCustomerRoute>
                      }
                    />

                    {/* Admin route tree */}
                    <Route
                      path="/admin"
                      element={
                        <AdminAuthProvider>
                          <ProtectedAdminRoute>
                            <AdminLayout />
                          </ProtectedAdminRoute>
                        </AdminAuthProvider>
                      }
                    >
                      {/* Nested admin routes, rendered inside AdminLayout's <Outlet /> */}
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="products" element={<Products />} />
                      <Route
                        path="products/new"
                        element={<ProductFormPage />}
                      />
                      <Route
                        path="products/edit/:id"
                        element={<ProductFormPage />}
                      />
                      <Route
                        path="products/view/:id"
                        element={<ProductViewPage />}
                      />
                      <Route path="orders" element={<Orders />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="projects" element={<AdminProjects />} />
                      <Route path="contracts" element={<Contracts />} />
                      <Route path="messages" element={<Messages />} />
                      <Route
                        path="customer-uploads"
                        element={<CustomerUploads />}
                      />
                      <Route path="personnel" element={<ManagePersonnel />} />
                      <Route path="records" element={<RecordsUpload />} />
                      <Route path="activity" element={<ActivityLog />} />
                    </Route>

                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </OrderProvider>
              </CartProvider>
            </OrderUpdatesProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
