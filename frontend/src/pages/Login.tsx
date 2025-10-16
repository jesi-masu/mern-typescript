import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/layouts/AuthLayout"; // Import the new layout

// Zod schema for form validation (no changes needed here)
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: LoginFormValues) => {
    const user = await login(data.email, data.password);
    if (user) {
      if (user.role === "admin" || user.role === "personnel") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from === "/login" ? "/customer-dashboard" : from, {
          replace: true,
        });
      }
    }
  };

  const loginFormComponent = (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20 hover:shadow-3xl hover:shadow-black/30 transition-all duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
        <p className="text-white/70">Enter your credentials to continue</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white/90">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-100/70 transition-all duration-300 group-focus-within:text-blue-200 group-focus-within:scale-110" />
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      required
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 transition-all duration-300"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white/90">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-100/70 transition-all duration-300 group-focus-within:text-blue-200 group-focus-within:scale-110" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      required
                      className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-blue-100/60 focus:border-blue-200 focus:bg-white/25 transition-all duration-300"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70 hover:text-blue-200 transition-all duration-300 hover:scale-110"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-white/80 hover:text-blue-200 transition-colors duration-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      {/* Social Login Section */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-transparent px-4 text-white/70 backdrop-blur-sm">
              or continue with
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          {/* Replace with your social login component or function */}
          <Button
            variant="outline"
            className="rounded-full w-14 h-14 p-0 border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-110"
          >
            <span className="text-xl font-bold">G</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const demoAccountsComponent = (
    <div className="bg-black/20 rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-center gap-2 text-white/90 mb-4">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">Demo Accounts</span>
      </div>
      <div className="space-y-2 text-sm text-white/80">
        <div className="bg-white/10 rounded p-2 text-center">
          <div className="font-medium">Admin:</div>
          <div>admin@prefabplus.com / admin123</div>
        </div>
        <div className="bg-white/10 rounded p-2 text-center">
          <div className="font-medium">Personnel:</div>
          <div>personnel@prefabplus.com / personnel123</div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title={
        <>
          Welcome{" "}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
            Back
          </span>
        </>
      }
      subtitle="Sign in to your account"
      promptLink={
        <p className="text-white/90 text-lg">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-white font-semibold underline hover:text-blue-100 transition-colors duration-300 decoration-2 underline-offset-4"
          >
            Create one now
          </Link>
        </p>
      }
      formComponent={loginFormComponent}
      sideContent={demoAccountsComponent}
    />
  );
};

export default Login;
