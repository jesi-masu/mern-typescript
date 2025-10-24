import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, X, Plus } from "lucide-react";
import { Product, ProductSpecifications, IProductPart } from "@/types/product";
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
import { useAuth } from "@/context/AuthContext";
import ProductSpecificationsForm from "./ProductSpecificationsForm";
import ProductPartsForm from "./ProductPartsForm";

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
  const { token, isLoading: isAuthLoading } = useAuth();
  const isEditing = !!id;
  const [isDataLoading, setIsDataLoading] = useState(isEditing);

  // States for dynamic arrays
  const [features, setFeatures] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // States for specifications
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

  // State for Product Parts
  const [productParts, setProductParts] = useState<IProductPart[]>([]);
  const [newPart, setNewPart] = useState<IProductPart>({
    name: "",
    quantity: 1,
    image: "",
    price: undefined,
    description: "",
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    // --- 1. FILLED IN DEFAULT VALUES ---
    defaultValues: {
      productName: "",
      productPrice: 0,
      category: "",
      squareFeet: 0,
      stock: 0,
      productShortDescription: "",
      productLongDescription: "",
      leadTime: "",
      threeDModelUrl: "",
      image: "",
    },
  });

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(
            `http://localhost:4000/api/products/${id}`
          );
          if (!response.ok) throw new Error("Product not found");
          const data: Product = await response.json();
          form.reset(data); // This will populate the form with fetched data
          setFeatures(data.features || []);
          setInclusions(data.inclusion || []);
          setExclusions(data.exclusion || []);
          setImages(data.images || []);
          setProductParts(data.productParts || []);

          // Specifications logic
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
    if (!token) {
      toast.error("Authentication session expired. Please log in again.");
      return;
    }

    const finalPayload = {
      ...data,
      features,
      inclusion: inclusions,
      exclusion: exclusions,
      images,
      productParts: productParts,
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
          Authorization: `Bearer ${token}`,
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

  // --- Specification Helper Functions ---
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

  // --- Product Part Helper Functions ---
  const handleAddPart = () => {
    if (!newPart.name || !newPart.image || newPart.quantity < 1) {
      toast.error("Part name, image, and valid quantity are required.");
      return;
    }
    setProductParts([...productParts, { ...newPart }]);
    setNewPart({
      name: "",
      quantity: 1,
      image: "",
      price: undefined,
      description: "",
    });
  };

  const handleRemovePart = (indexToRemove: number) => {
    setProductParts(productParts.filter((_, index) => index !== indexToRemove));
  };

  // --- Loading State Check ---
  if (isAuthLoading || (isEditing && isDataLoading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading form...
      </div>
    );
  }

  // --- Main Return ---
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
                {/* --- 2. FILLED IN Product Story Card --- */}
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

                {/* --- Features & Inclusions Card --- */}
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
                    <DynamicListInput
                      title="What's Not Included (Exclusions)"
                      placeholder="Add an exclusion (e.g., 'Foundation Work')"
                      items={exclusions}
                      setItems={setExclusions}
                    />
                  </CardContent>
                </Card>

                {/* --- 3. FILLED IN Media Card --- */}
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

                {/* --- Product Parts Component --- */}
                <ProductPartsForm
                  productParts={productParts}
                  newPart={newPart}
                  setNewPart={setNewPart}
                  onAddPart={handleAddPart}
                  onRemovePart={handleRemovePart}
                />
              </div>

              <div className="lg:col-span-1 space-y-8">
                {/* --- 4. FILLED IN Pricing & Details Card --- */}
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
                                <SelectValue placeholder="Select a category" />
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

                {/* --- Specifications Component --- */}
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                    <CardDescription>
                      Add technical details for the product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ProductSpecificationsForm
                      specifications={specifications}
                      setSpecifications={setSpecifications}
                      dynamicSpecs={dynamicSpecs}
                      setDynamicSpecs={setDynamicSpecs}
                      newDynamicSpecKey={newDynamicSpecKey}
                      setNewDynamicSpecKey={setNewDynamicSpecKey}
                      newDynamicSpecValue={newDynamicSpecValue}
                      setNewDynamicSpecValue={setNewDynamicSpecValue}
                      onAddDynamicSpec={handleAddDynamicSpec}
                      onRemoveDynamicSpec={handleRemoveDynamicSpec}
                    />
                  </CardContent>
                </Card>

                {/* --- Actions Card --- */}
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
