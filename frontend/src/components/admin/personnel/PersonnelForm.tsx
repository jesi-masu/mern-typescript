import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Save, Loader2, Key, Copy, Check } from "lucide-react";

// --- Validation Schema ---
const personnelSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  role: z.enum(["admin", "personnel"], { required_error: "Role is required." }),
  position: z.string().min(1, "Position is required."),
  department: z.string().min(1, "Department is required."),
  status: z.enum(["active", "on_leave", "inactive"], {
    required_error: "Status is required.",
  }),
});

export type PersonnelFormValues = z.infer<typeof personnelSchema>;

interface PersonnelFormProps {
  onSubmit: (
    data: PersonnelFormValues & { password?: string }
  ) => Promise<void>;
  onCancel: () => void;
  isProcessing: boolean;
  initialData?: PersonnelFormValues; // Prop to accept existing data for editing
}

// Helper to generate password
const generatePassword = (length = 12): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

export const PersonnelForm: React.FC<PersonnelFormProps> = ({
  onSubmit,
  onCancel,
  isProcessing,
  initialData,
}) => {
  const { toast } = useToast();
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Check if we are in "edit" mode
  const isEditMode = !!initialData;

  const form = useForm<PersonnelFormValues>({
    resolver: zodResolver(personnelSchema),
    // Set default values from initialData if it exists
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: undefined,
      position: "",
      department: "",
      status: "active",
    },
  });

  // This effect populates the form when initialData is loaded asynchronously
  useEffect(() => {
    if (initialData) {
      // Use reset to update form values when async data arrives
      form.reset(initialData);
    }
  }, [initialData, form.reset]);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setIsCopied(false);
  };

  const handleCopyPassword = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword).then(() => {
      setIsCopied(true);
      toast({ title: "Copied!", description: "Temporary password copied." });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleFormSubmit = async (data: PersonnelFormValues) => {
    // Only check for password in "create" mode
    if (!isEditMode && !generatedPassword) {
      toast({
        title: "Password Required",
        description: "Please generate a temporary password.",
        variant: "destructive",
      });
      return;
    }

    // Conditionally add password to submitted data
    const dataToSubmit = isEditMode
      ? data // In edit mode, just send form data
      : { ...data, password: generatedPassword! }; // In create mode, add password

    await onSubmit(dataToSubmit);

    // Only reset form if we are in "create" mode
    if (!isEditMode) {
      setGeneratedPassword(null);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* === Personal Information === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
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
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Dela Cruz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="juan.delacruz@company.com"
                    {...field}
                  />
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
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="+63 9xx xxx xxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* === Role & Position === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personnel">Personnel</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position / Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Project Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Administration">
                      Administration
                    </SelectItem>
                    <SelectItem value="Project Management">
                      Project Management
                    </SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Customer Service">
                      Customer Service
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* === Account Status & Password === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Status *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditionally show Password or placeholder */}
          {!isEditMode ? (
            // CREATE MODE: Show password generator
            <div className="md:col-span-2 space-y-2">
              <FormLabel>Temporary Password</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={generatedPassword || "Click Generate ->"}
                  className="bg-gray-100"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGeneratePassword}
                >
                  Generate
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyPassword}
                  disabled={!generatedPassword}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                User must change this on first login.
              </p>
            </div>
          ) : (
            // EDIT MODE: Show disabled placeholder
            <div className="md:col-span-2 space-y-2">
              <FormLabel>Password</FormLabel>
              <Input
                readOnly
                disabled
                value="Password cannot be changed here"
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground">
                Password must be reset by the user.
              </p>
            </div>
          )}
        </div>

        {/* === Actions === */}
        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {/* Change button text based on mode */}
            {isEditMode ? "Save Changes" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
