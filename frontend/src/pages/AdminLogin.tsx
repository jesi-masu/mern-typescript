// frontend/src/pages/AdminLogin.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Mail, Lock, Shield } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin/dashboard");
      }, 1000);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-500 via-blue-500 to-blue-300 flex items-center relative overflow-hidden">
      {/* Left side content */}
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-4 lg:p-8 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-xl text-white/90 mb-2">
            Sign in to manage your platform
          </p>
          <div className="w-24 h-1 bg-white/80 mb-8"></div>

          <p className="text-white/90 mb-8">
            CamcoPrefab Administration Panel. Authorized Personnel Only.
          </p>

          <Link to="/" className="w-fit">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm"
            >
              Return to Website
            </Button>
          </Link>
        </div>

        {/* Right side form */}
        <div className="flex justify-center p-4">
          <div className="w-full max-w-md bg-white/20 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Sign in
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/30 border-white/30 text-white placeholder:text-blue-100 focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100 h-5 w-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/30 border-white/30 text-white placeholder:text-blue-100 focus:border-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ff7961] hover:bg-[#ff5c41] text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login to Dashboard"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/30">
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-white/90">
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
              <a
                href="/"
                className="mt-4 text-sm text-white hover:text-white/80 block text-center"
              >
                ← Return to main site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
