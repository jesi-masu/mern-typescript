
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully",
      });
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 flex items-center">
      {/* Left side content */}
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-4 lg:p-8 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-white mb-2">Reset<br />Password</h1>
          <div className="w-24 h-1 bg-white/80 mb-8"></div>
          
          <p className="text-white/90 mb-8">
            Smart Homes, Smart Choice. Effortless Living Starts Here.
          </p>
          
          <Link to="/" className="w-fit">
            <Button 
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </Link>
        </div>

        {/* Right side form */}
        <div className="flex justify-center p-4">
          <div className="w-full max-w-md bg-white/20 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Create New Password</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100 h-5 w-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/30 border-white/30 text-white placeholder:text-blue-100 focus:border-white"
                  />
                </div>
                <p className="text-xs text-white/80">
                  Password must be at least 8 characters long and include a number and a special character.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100 h-5 w-5" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              
              <div className="text-center">
                <Link to="/login" className="text-white hover:text-white/80 underline text-sm">
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
