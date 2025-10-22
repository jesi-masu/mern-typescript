import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, X, Plus } from "lucide-react";
import { Product, ProductSpecifications } from "@/types/product";
import { categories } from "@/data/products";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DynamicListInput from "@/components/common/DynamicListInput";
import { useAuth } from "@/context/AuthContext"; // ✅ 1. IMPORT THE CORRECT AUTH HOOK

// Zod schema remains the same
const productSchema = z.object({
  productName: z.string().min(3, "Product Name must be at least 3 characters"),
  productPrice: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  squareFeet: z.coerce.number().min(1, "Square feet must be at least 1"),
  stock: z.coerce.number().min(0, "Stock can't be negative").default(0),
  productShortDescription: z.string().min(10, "A short tagline is required"),
  productLongDescription: z.string().optional(),
  leadTime: z.string().optional(),
  threeDModelUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  image: z.string().url("A valid main image URL is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, isLoading: isAuthLoading } = useAuth(); // ✅ 2. GET TOKEN AND LOADING STATE FROM THE CORRECT HOOK
  const isEditing = !!id;
  const [isDataLoading, setIsDataLoading] = useState(isEditing);

  // States for dynamic arrays remain the same
  const [features, setFeatures] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<ProductSpecifications>({
    dimensions: "",
    height: "",
    foundation: "",
    structure: "",
    roof: "",
    windows: "",
    electrical: "",
    plumbing: "",
  });
  const [dynamicSpecs, setDynamicSpecs] = useState<Record<string, string>>({});
  const [newDynamicSpecKey, setNewDynamicSpecKey] = useState("");
  const [newDynamicSpecValue, setNewDynamicSpecValue] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      productPrice: 0,
      category: "",
      squareFeet: 0,
      image: "",
    },
  });

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          // The GET route is public, so no auth header is needed here
          const response = await fetch(
            `http://localhost:4000/api/products/${id}`
          );
          if (!response.ok) throw new Error("Product not found");
          const data: Product = await response.json();
          form.reset(data);
          setFeatures(data.features || []);
          setInclusions(data.inclusion || []);
          setImages(data.images || []);

          const predefinedKeys = [
            "dimensions",
            "height",
            "foundation",
            "structure",
            "roof",
            "windows",
            "electrical",
            "plumbing",
          ];
          const predefinedSpecs: ProductSpecifications = {};
          const dynamicSpecs: Record<string, string> = {};
          if (data.specifications) {
            for (const key in data.specifications) {
              if (predefinedKeys.includes(key))
                (predefinedSpecs as any)[key] = (data.specifications as any)[
                  key
                ];
              else dynamicSpecs[key] = (data.specifications as any)[key];
            }
          }
          setSpecifications(predefinedSpecs);
          setDynamicSpecs(dynamicSpecs);
        } catch (error) {
          toast.error("Failed to load product data.");
          navigate("/admin/products");
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing, navigate, form]);

  const handleFormSubmit = async (data: ProductFormData) => {
    // ✅ 3. USE THE TOKEN FROM useAuth()
    if (!token) {
      toast.error("Authentication session expired. Please log in again.");
      return;
    }

    const finalPayload = {
      ...data,
      features,
      inclusion: inclusions,
      images,
      specifications: { ...specifications, ...dynamicSpecs },
    };

    const url = isEditing
      ? `http://localhost:4000/api/products/${id}`
      : `http://localhost:4000/api/products`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ 4. INCLUDE THE CORRECT TOKEN
        },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.mssg ||
            errorData.error ||
            `Failed to ${isEditing ? "save" : "create"} product.`
        );
      }

      toast.success(
        `Product ${isEditing ? "updated" : "created"} successfully!`
      );
      navigate("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  const handleAddDynamicSpec = () => {
    if (newDynamicSpecKey.trim() && newDynamicSpecValue.trim()) {
      setDynamicSpecs((prev) => ({
        ...prev,
        [newDynamicSpecKey.trim()]: newDynamicSpecValue.trim(),
      }));
      setNewDynamicSpecKey("");
      setNewDynamicSpecValue("");
    }
  };

  const handleRemoveDynamicSpec = (key: string) => {
    const { [key]: _, ...rest } = dynamicSpecs;
    setDynamicSpecs(rest);
  };

  // ✅ 5. WAIT FOR BOTH AUTH AND DATA TO FINISH LOADING
  if (isAuthLoading || (isEditing && isDataLoading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading form...
      </div>
    );
  }

  // The rest of the JSX is unchanged...
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-muted-foreground">
              Fill in the details for your modular product.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Story</CardTitle>
                    <CardDescription>
                      This is the main marketing information for the product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Two-Bedroom Family Module"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productShortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Tagline</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A catchy one-sentence summary for the shop page."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productLongDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the product in detail, its use cases, and benefits."
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Features & Inclusions</CardTitle>
                    <CardDescription>
                      List the key selling points and what's included with the
                      product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <DynamicListInput
                      title="Key Features"
                      placeholder="Add a feature (e.g., 'Spacious Living Area')"
                      items={features}
                      setItems={setFeatures}
                    />
                    <DynamicListInput
                      title="What's Included"
                      placeholder="Add an inclusion (e.g., 'Kitchen Cabinetry')"
                      items={inclusions}
                      setItems={setInclusions}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>
                      Add URLs for the main cover image, gallery, and 3D model.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://... (This is the main image for the shop)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DynamicListInput
                      title="Additional Gallery Images"
                      placeholder="Add another image URL..."
                      items={images}
                      setItems={setImages}
                    />
                    <FormField
                      control={form.control}
                      name="threeDModelUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>3D Model Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://sketchfab.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="productPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (PHP)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="squareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Feet</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Available</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leadTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lead Time</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 4-6 Weeks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                    <CardDescription>
                      Add technical details for the product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.keys(specifications).map((key) => (
                      <div key={key}>
                        <FormLabel className="capitalize">{key}</FormLabel>
                        <Input
                          value={(specifications as any)[key] || ""}
                          onChange={(e) =>
                            setSpecifications((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          className="mt-2"
                        />
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <FormLabel>Add Custom Specification</FormLabel>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Spec Name (e.g., 'Warranty')"
                          value={newDynamicSpecKey}
                          onChange={(e) => setNewDynamicSpecKey(e.target.value)}
                        />
                        <Input
                          placeholder="Spec Value (e.g., '5 Years')"
                          value={newDynamicSpecValue}
                          onChange={(e) =>
                            setNewDynamicSpecValue(e.target.value)
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddDynamicSpec}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(dynamicSpecs).map(([key, value]) => (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="flex items-center gap-2 pr-1"
                          >
                            <strong>{key}:</strong> {value}
                            <button
                              type="button"
                              onClick={() => handleRemoveDynamicSpec(key)}
                              className="rounded-full hover:bg-muted-foreground/20 p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? "Saving..."
                        : isEditing
                        ? "Update Product"
                        : "Create Product"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/admin/products")}
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProductFormPage;
