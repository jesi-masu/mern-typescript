import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
} from "lucide-react";

const apiBase =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:4000";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // basic user fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // address fields required by backend
  const [street, setStreet] = useState("");
  const [barangaySubdivision, setBarangaySubdivision] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password ||
      !confirmPassword ||
      !street.trim() ||
      !barangaySubdivision.trim() ||
      !city.trim() ||
      !province.trim() ||
      !postalCode.trim() ||
      !country.trim()
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description:
          "Please make sure your password and confirm password match.",
      });
      return false;
    }

    if (!agreesToTerms) {
      toast({
        title: "Terms not accepted",
        description:
          "You must accept the Terms & Conditions and Privacy Policy.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: phoneNumber.trim(),
          password,
          address: {
            street: street.trim(),
            barangaySubdivision: barangaySubdivision.trim(),
            city: city.trim(),
            province: province.trim(),
            postalCode: postalCode.trim(),
            country: country.trim(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend returns { error: "..." } in various places
        toast({
          title: "Sign up failed",
          description: data?.error || "Unable to create account.",
        });
        setIsLoading(false);
        return;
      }

      // success: backend returns user info + token (per your authController)
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });

      // persist token/user for later authenticated requests
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data._id) {
        localStorage.setItem("user", JSON.stringify(data));
      }

      setIsLoading(false);
      navigate("/"); // or another protected route
    } catch (err: any) {
      console.error("Signup error:", err);
      toast({
        title: "Network error",
        description:
          err?.message || "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-500 via-blue-500 to-blue-300 flex items-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 py-12">
        {/* Left side content */}
        <div className="p-4 lg:p-8 flex flex-col justify-center">
          <div className="space-y-6 max-w-xl">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Join
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                  Us Today
                </span>
              </h1>
              <p className="text-xl text-white/90 font-light">
                Create your account and start your journey
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-transparent rounded-full" />
            </div>

            <div className="space-y-4">
              <p className="text-white/90 text-lg">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white font-semibold underline hover:text-blue-100 transition-colors duration-300"
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
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side form */}
        <div className="flex justify-center p-4">
          <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-full border border-white/20">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-white/70">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-white/90"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                        focusedField === "firstName"
                          ? "text-blue-200"
                          : "text-blue-100/70"
                      }`}
                    />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-9 bg-white/20 text-white placeholder:text-blue-100/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-white/90"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                        focusedField === "lastName"
                          ? "text-blue-200"
                          : "text-blue-100/70"
                      }`}
                    />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-9 bg-white/20 text-white placeholder:text-blue-100/60"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white/90"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      focusedField === "email"
                        ? "text-blue-200"
                        : "text-blue-100/70"
                    }`}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="pl-10 bg-white/20 text-white placeholder:text-blue-100/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-white/90"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                        focusedField === "password"
                          ? "text-blue-200"
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
                      className="pl-10 pr-10 bg-white/20 text-white placeholder:text-blue-100/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-white/90"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                        focusedField === "confirmPassword"
                          ? "text-blue-200"
                          : "text-blue-100/70"
                      }`}
                    />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-10 pr-10 bg-white/20 text-white placeholder:text-blue-100/60"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-white/90"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      focusedField === "phone"
                        ? "text-blue-200"
                        : "text-blue-100/70"
                    }`}
                  />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+63 9xx xxx xxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="pl-10 bg-white/20 text-white placeholder:text-blue-100/60"
                  />
                </div>
              </div>

              {/* Address section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="street"
                    className="text-sm font-medium text-white/90"
                  >
                    Street
                  </label>
                  <Input
                    id="street"
                    type="text"
                    placeholder="Street address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="bg-white/20 text-white placeholder:text-blue-100/60"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="barangay"
                    className="text-sm font-medium text-white/90"
                  >
                    Barangay / Subdivision
                  </label>
                  <Input
                    id="barangay"
                    type="text"
                    placeholder="Barangay or Subdivision"
                    value={barangaySubdivision}
                    onChange={(e) => setBarangaySubdivision(e.target.value)}
                    required
                    className="bg-white/20 text-white placeholder:text-blue-100/60"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-white/90"
                  >
                    City / Municipality
                  </label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="bg-white/20 text-white placeholder:text-blue-100/60"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="province"
                    className="text-sm font-medium text-white/90"
                  >
                    Province
                  </label>
                  <Input
                    id="province"
                    type="text"
                    placeholder="Province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                    className="bg-white/20 text-white placeholder:text-blue-100/60"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="postalCode"
                    className="text-sm font-medium text-white/90"
                  >
                    Postal Code
                  </label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="Postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="bg-white/20 text-white placeholder:text-blue-100/60"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="text-sm font-medium text-white/90"
                  >
                    Country
                  </label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="bg-white/20 text-white placeholder:text-blue-100/60"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-3 py-2">
                <Checkbox
                  id="terms"
                  checked={agreesToTerms}
                  onCheckedChange={(checked) =>
                    setAgreesToTerms(checked as boolean)
                  }
                  className="border-white/50"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-white/90 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms-conditions"
                    className="text-white underline hover:text-blue-200"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-white underline hover:text-blue-200"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white font-medium py-3 rounded-xl"
                disabled={isLoading}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
