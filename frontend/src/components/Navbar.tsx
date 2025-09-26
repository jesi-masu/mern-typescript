import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // MOD: Imported useNavigate
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // MOD: Imported Badge
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  Package,
  LogOut,
  ShieldCheck,
  ShoppingCart, // MOD: Imported ShoppingCart icon
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext"; // MOD: Imported useCart hook
import CustomerNotifications from "@/components/customer/CustomerNotifications";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // MOD: Initialized useNavigate

  // MOD: Get cart items count using the useCart hook
  // We'll wrap this in a check to avoid calling the hook when not needed.
  const CartItemsCounter = () => {
    const { getTotalItems } = useCart();
    return getTotalItems();
  };
  const cartItemsCount =
    isAuthenticated && user?.role === "client" ? CartItemsCounter() : 0;
  // END MOD

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <nav className="bg-white/80 shadow-sm sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-950 transition-colors duration-300 hover:text-blue-600"
            >
              Camco Prefab
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Shop
            </Link>
            <Link
              to="/projects"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Projects
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact
            </Link>
            <Link
              to="/faq"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              FAQ
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* Bell Icon */}
                {user.role === "client" && <CustomerNotifications />}

                {/* MOD: START - Added Cart Icon */}
                {user.role === "client" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => navigate("/customer-dashboard?tab=shopping")}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-blue-600"
                      >
                        {cartItemsCount}
                      </Badge>
                    )}
                    <span className="sr-only">Open Cart</span>
                  </Button>
                )}
                {/* MOD: END - Added Cart Icon */}

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 border-2 border-transparent hover:border-blue-500 transition-colors">
                        <AvatarFallback className="bg-blue-600 text-white font-semibold">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {user.role === "admin" || user.role === "personnel" ? (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="cursor-pointer">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/customer-dashboard"
                            className="cursor-pointer"
                          >
                            <User className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/order-history" className="cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            <span>My Orders</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* MOD: START - Added Cart Icon for Mobile View */}
            {isAuthenticated && user && user.role === "client" && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/customer-dashboard?tab=shopping")}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-blue-600"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
                <span className="sr-only">Open Cart</span>
              </Button>
            )}
            {/* MOD: END - Added Cart Icon for Mobile View */}
            <Button variant="ghost" onClick={toggleMenu} size="icon">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/projects"
                className="text-gray-700 block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                to="/about"
                className="text-gray-700 block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="text-gray-700 block px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>

              <div className="border-t pt-4 mt-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {user.role === "admin" || user.role === "personnel" ? (
                      <Link
                        to="/admin/dashboard"
                        className="text-gray-700 flex items-center px-3 py-2 rounded-md hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" /> Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/customer-dashboard"
                          className="text-gray-700 flex items-center px-3 py-2 rounded-md hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                        <Link
                          to="/order-history"
                          className="text-gray-700 flex items-center px-3 py-2 rounded-md hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Package className="mr-2 h-4 w-4" /> My Orders
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-600 flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-2 pt-2">
                    <Link
                      to="/login"
                      className="w-1/2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link
                      to="/signup"
                      className="w-1/2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
