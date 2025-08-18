import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-500 via-blue-500 to-blue-300 flex items-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side content */}
        <div className="p-4 lg:p-8 flex flex-col justify-center transform transition-all duration-1000 ease-out animate-in slide-in-from-left-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Join
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                  Us Today
                </span>
              </h1>
              <p className="text-xl text-white/90 font-light">
                Create your account and start your journey
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-transparent rounded-full transform transition-all duration-500 hover:w-32"></div>
            </div>
            
            <div className="space-y-4">
              <p className="text-white/90 text-lg">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-white font-semibold underline hover:text-blue-100 transition-colors duration-300 decoration-2 underline-offset-4 hover:decoration-blue-100"
                >
                  Sign in here
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
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-full border border-white/20">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-white/70">Fill in your details to get started</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-white/90">
                    First Name
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-300 ${
                      focusedField === 'firstName' ? 'text-blue-200 scale-110' : 'text-blue-100/70'
                    }`} />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 hover:bg-white/25 transition-all duration-300 focus:ring-2 focus:ring-blue-200/50 focus:scale-[1.02]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-white/90">
                    Last Name
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-300 ${
                      focusedField === 'lastName' ? 'text-blue-200 scale-110' : 'text-blue-100/70'
                    }`} />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 hover:bg-white/25 transition-all duration-300 focus:ring-2 focus:ring-blue-200/50 focus:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/90">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                    focusedField === 'email' ? 'text-blue-200 scale-110' : 'text-blue-100/70'
                  }`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 hover:bg-white/25 transition-all duration-300 focus:ring-2 focus:ring-blue-200/50 focus:scale-[1.02]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative group">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                    focusedField === 'password' ? 'text-blue-200 scale-110' : 'text-blue-100/70'
                  }`} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 hover:bg-white/25 transition-all duration-300 focus:ring-2 focus:ring-blue-200/50 focus:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70 hover:text-blue-200 transition-all duration-300 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-white/90">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                    focusedField === 'phone' ? 'text-blue-200 scale-110' : 'text-blue-100/70'
                  }`} />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+63 9xx xxx xxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 hover:bg-white/25 transition-all duration-300 focus:ring-2 focus:ring-blue-200/50 focus:scale-[1.02]"
                  />
                </div>
              </div>
              
              <div className="flex items-start space-x-3 py-2">
                <Checkbox 
                  id="terms" 
                  checked={agreesToTerms}
                  onCheckedChange={(checked) => setAgreesToTerms(checked as boolean)}
                  className="border-white/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-400 data-[state=checked]:to-red-400 data-[state=checked]:border-orange-400 transition-all duration-300 hover:border-white mt-1"
                />
                <label htmlFor="terms" className="text-sm text-white/90 leading-relaxed">
                  I agree to the{" "}
                  <Link 
                    to="/terms-conditions" 
                    className="text-white underline hover:text-blue-200 transition-colors duration-300 decoration-2 underline-offset-2"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link 
                    to="/privacy-policy" 
                    className="text-white underline hover:text-blue-200 transition-colors duration-300 decoration-2 underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
                disabled={isLoading || !agreesToTerms}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;