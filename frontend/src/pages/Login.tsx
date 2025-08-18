// frontend/src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Correctly import the unified hook

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth(); // Use the unified login function

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);

      if (user) {
        // Redirect based on role
        if (user.role === "admin" || user.role === "personnel") {
          navigate("/admin/dashboard");
        } else {
          // Redirect to the page they were trying to access, or home
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      // The login function in the context already handles the toast.
      // You can add more specific logic here if needed.
      console.error("Login component error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-500 via-blue-500 to-blue-300 flex items-center relative overflow-hidden font-inter">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side content */}
        <div className="p-4 lg:p-8 flex flex-col justify-center transform transition-all duration-1000 ease-out animate-in slide-in-from-left-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Welcome
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                  Back
                </span>
              </h1>
              <p className="text-xl text-white/90 font-light">
                Sign in to your account
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-transparent rounded-full transition-all duration-500 hover:w-32"></div>
            </div>

            <div className="space-y-4">
              <p className="text-white/90 text-lg">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-white font-semibold underline hover:text-blue-100 transition-colors duration-300 decoration-2 underline-offset-4 hover:decoration-blue-100"
                >
                  Create one now
                </Link>
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                Smart Homes, Smart Choice.
                <span className="block text-blue-100 font-medium">
                  Effortless Living Starts Here.
                </span>
              </p>
            </div>
            <Link to="/" className="w-fit group">
              <Button
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 group-hover:border-white/30"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side form */}
        <div className="flex justify-center p-4 transform transition-all duration-1000 ease-out animate-in slide-in-from-right-10 delay-300">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20 hover:shadow-3xl hover:shadow-black/30 transition-all duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-white/70">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white/90"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                      focusedField === "email"
                        ? "text-blue-200 scale-110"
                        : "text-blue-100/70"
                    }`}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 hover:bg-white/25 transition-all duration-300 focus:ring-2 focus:ring-blue-200/50 focus:scale-[1.02]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-white/90"
                  >
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                      focusedField === "password"
                        ? "text-blue-200 scale-110"
                        : "text-blue-100/70"
                    }`}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 hover:bg-white/25 transition-all duration-300 focus:ring-2 focus:ring-blue-200/50 focus:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70 hover:text-blue-200 transition-all duration-300 hover:scale-110"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-white/80 hover:text-blue-200 transition-colors duration-300 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
                disabled={isLoading}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-transparent px-4 text-white/70">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  className="rounded-full w-14 h-14 p-0 border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/10 backdrop-blur-md group"
                >
                  <span className="text-xl font-bold transition-transform duration-300 group-hover:scale-110">
                    G
                  </span>
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/30 text-center">
                <div className="flex items-center justify-center gap-2 text-white/90 mb-4">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Demo Accounts</span>
                </div>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="bg-white/10 rounded p-2">
                    <div className="font-medium">Admin Access:</div>
                    <div>admin@prefabplus.com / admin123</div>
                  </div>
                  <div className="bg-white/10 rounded p-2">
                    <div className="font-medium">Personnel Access:</div>
                    <div>personnel@prefabplus.com / personnel123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
