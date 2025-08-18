import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Shield, Sparkles } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // Show success message
      console.log("Reset link sent to:", email);
    }, 1500);
  };

  const handleLearnMore = () => {
    navigate("/");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-20 text-white/20">
        <Sparkles className="w-6 h-6 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute top-40 right-32 text-white/20">
        <Shield className="w-8 h-8 animate-pulse" style={{ animationDelay: '3s' }} />
      </div>
      <div className="absolute bottom-32 left-16 text-white/20">
        <Sparkles className="w-5 h-5 animate-pulse" style={{ animationDelay: '5s' }} />
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 min-h-screen">
        {/* Left side content */}
        <div className="p-8 lg:p-16 flex flex-col justify-center space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm font-medium">Secure Recovery</span>
            </div>
            
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                Forgot
                <br />
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Password?
                </span>
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-white to-white/50 rounded-full mb-8"></div>
            </div>
            
            <p className="text-xl text-white/90 leading-relaxed max-w-md">
              Smart Homes, Smart Choice. 
              <br />
              <span className="text-white/70">Effortless Living Starts Here.</span>
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleLearnMore}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
            >
              Learn More
            </button>
            
            <div className="flex items-center space-x-4 text-white/60 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <span>Reliable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side form */}
        <div className="flex justify-center items-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-white/70 text-sm">We'll send you a secure recovery link</p>
              </div>
              
              {isSubmitted ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Success State */}
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4 backdrop-blur-sm border border-green-400/30">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm text-white p-6 rounded-2xl border border-white/30">
                      <h3 className="font-semibold text-lg mb-2">Reset link sent!</h3>
                      <p className="text-sm text-white/80">
                        We've sent secure instructions to reset your password to{" "}
                        <span className="font-medium text-white">{email}</span>.
                        Please check your inbox.
                      </p>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                      <p className="text-sm text-white/70">
                        Didn't receive the email? Check your spam folder or{" "}
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="text-white font-medium underline hover:text-white/80 transition-colors"
                        >
                          try again
                        </button>
                      </p>
                      
                      <button
                        onClick={handleBackToLogin}
                        className="inline-flex items-center justify-center w-full bg-white/15 hover:bg-white/25 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 border border-white/30"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="email" className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5 group-focus-within:text-white transition-colors" />
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/30 text-white placeholder:text-white/50 focus:border-white focus:bg-white/15 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/15 focus:outline-none"
                        />
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Enter your email address and we'll send you a secure link to reset your password.
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#ff7961] to-[#ff5722] hover:from-[#ff5c41] hover:to-[#ff3d00] text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending secure link...</span>
                        </div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>
                  
                  <div className="text-center pt-4">
                    <button 
                      onClick={handleBackToLogin}
                      className="inline-flex items-center text-white/80 hover:text-white text-sm font-medium transition-colors group"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                      Back to Login
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-white/50 text-xs">
                🔒 Your security is our priority. All communications are encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;