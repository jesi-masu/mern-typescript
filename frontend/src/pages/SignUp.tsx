import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout"; // Import the new layout

const apiBase =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:4000";

// Zod schema for robust form validation
const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
    // ✅ UPDATED PASSWORD VALIDATION TO MATCH BACKEND
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    street: z.string().min(1, "Street address is required"),
    barangaySubdivision: z.string().min(1, "Barangay/Subdivision is required"),
    city: z.string().min(1, "City/Municipality is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    agreesToTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Show error on the confirm password field
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      street: "",
      barangaySubdivision: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
      agreesToTerms: false,
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: SignUpFormValues) => {
    try {
      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          phoneNumber: data.phoneNumber,
          password: data.password,
          address: {
            street: data.street,
            barangaySubdivision: data.barangaySubdivision,
            city: data.city,
            province: data.province,
            postalCode: data.postalCode,
            country: data.country,
          },
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Unable to create account.");
      }

      toast({
        title: "Account created successfully!",
        description: "You will be redirected to the login page.",
      });
      navigate("/login");
    } catch (err: any) {
      console.error("Signup error:", err);
      toast({
        title: "Sign up failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const signUpFormComponent = (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/10 rounded-full border border-white/20">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-white/70">Fill in your details to get started</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-100/70" />
                      <Input
                        className="pl-9 bg-white/20 text-white placeholder:text-blue-100/60"
                        placeholder="Juan"
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Last Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-100/70" />
                      <Input
                        className="pl-9 bg-white/20 text-white placeholder:text-blue-100/60"
                        placeholder="Dela Cruz"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-100/70" />
                    <Input
                      className="pl-10 bg-white/20 text-white placeholder:text-blue-100/60"
                      type="email"
                      placeholder="your@email.com"
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-100/70" />
                    <Input
                      className="pl-10 bg-white/20 text-white placeholder:text-blue-100/60"
                      type="tel"
                      placeholder="+63 9xx xxx xxxx"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-100/70" />
                      <Input
                        className="pl-10 pr-10 bg-white/20 text-white placeholder:text-blue-100/60"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-100/70"
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-100/70" />
                      <Input
                        className="pl-10 pr-10 bg-white/20 text-white placeholder:text-blue-100/60"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-100/70"
                      >
                        {showConfirmPassword ? (
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
          </div>

          <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/20">
            Permanent Adress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Street</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/20 text-white placeholder:text-blue-100/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barangaySubdivision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">
                    Barangay / Subdivision
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/20 text-white placeholder:text-blue-100/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">
                    City / Municipality
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/20 text-white placeholder:text-blue-100/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Province</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/20 text-white placeholder:text-blue-100/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/20 text-white placeholder:text-blue-100/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Country</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/20 text-white placeholder:text-blue-100/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="agreesToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-white/50"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <label htmlFor="terms" className="text-sm text-white/90">
                    I agree to the{" "}
                    <Link to="/terms" className="underline text-white">
                      Terms & Conditions
                    </Link>
                  </label>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white font-medium py-3 rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );

  return (
    <AuthLayout
      title={
        <>
          Join{" "}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
            Us Today
          </span>
        </>
      }
      subtitle="Create your account and start your journey"
      promptLink={
        <p className="text-white/90 text-lg">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white font-semibold underline hover:text-blue-100 transition-colors duration-300"
          >
            Sign in here
          </Link>
        </p>
      }
      formComponent={signUpFormComponent}
    />
  );
};

export default SignUp;
