//frontend/src/components/admin/ProductForm.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";
import { Product, ProductSpecifications } from "@/types/product"; // Correct Product and ProductSpecifications types
import { categories } from "@/data/products"; // Assuming categories is static. If dynamic, pass as prop.
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Define the schema for the 'specifications' object
// All fields are optional and can be empty strings to match backend optionality
const ProductSpecificationsSchema = z.object({
  dimensions: z.string().optional().or(z.literal("")),
  height: z.string().optional().or(z.literal("")),
  foundation: z.string().optional().or(z.literal("")),
  structure: z.string().optional().or(z.literal("")),
  roof: z.string().optional().or(z.literal("")),
  windows: z.string().optional().or(z.literal("")),
  electrical: z.string().optional().or(z.literal("")),
  plumbing: z.string().optional().or(z.literal("")),
});

// Define the product schema for form input, mapping to Product properties
const productSchema = z.object({
  // No _id here; handled by parent (Products.tsx) for API calls
  name: z.string().min(3, "Product Name must be at least 3 characters"), // Maps to productName
  price: z.coerce.number().min(0, "Price must be a positive number"), // Maps to productPrice
  category: z.string().min(1, "Category is required"),
  squareFeet: z.coerce.number().min(1, "Square feet must be at least 1"),
  image: z
    .string()
    .url("Please enter a valid main image URL")
    .optional()
    .or(z.literal("")), // Maps to image (main product image)
  description: z
    .string()
    .min(10, "Short Description must be at least 10 characters"), // Maps to productShortDescription
  longDescription: z.string().optional(), // Maps to productLongDescription
  leadTime: z.string().optional(),
  modelUrl: z
    .string()
    .url("Please enter a valid 3D model URL")
    .optional()
    .or(z.literal("")), // Maps to threeDModelUrl
  // These arrays/objects are managed by local state, but keeping them in schema for type inference of ProductFormData
  // They will be passed to `onSubmit` from the local state directly.
  images: z.array(z.string().url("Each image URL must be valid")).optional(),
  features: z.array(z.string()).optional(),
  inclusion: z.array(z.string()).optional(),
  specifications: ProductSpecificationsSchema.optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product; // Uses the Product interface from @/types/product
  onSubmit: (data: Omit<Product, "_id" | "createdAt" | "updatedAt">) => void; // Expects a Product object suitable for backend
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const { toast } = useToast();
  const isEditMode = !!product;
  const [activeTab, setActiveTab] = useState("basic");

  // State for dynamic fields, initialized from product prop or empty arrays/objects
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const [inclusions, setInclusions] = useState<string[]>([]);
  const [newInclusion, setNewInclusion] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Initialize specifications with default empty values for all properties
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
  // State for arbitrary (non-predefined) specifications, if needed
  const [dynamicSpecs, setDynamicSpecs] = useState<Record<string, string>>({});
  const [newDynamicSpecKey, setNewDynamicSpecKey] = useState("");
  const [newDynamicSpecValue, setNewDynamicSpecValue] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      squareFeet: 0,
      image: "", // Initialize as empty string
      description: "",
      longDescription: "",
      leadTime: "",
      modelUrl: "",
      // No need to set dynamic arrays/objects here directly, as they are managed by local state
    },
  });

  // Effect to update form values and local states when the product prop changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.productName || "",
        price: product.productPrice || 0,
        category: product.category || "",
        squareFeet: product.squareFeet || 0,
        image: product.image || "", // Use product.image as the main image
        description: product.productShortDescription || "",
        longDescription: product.productLongDescription || "",
        leadTime: product.leadTime || "",
        modelUrl: product.threeDModelUrl || "",
      });

      setFeatures(product.features || []);
      setInclusions(product.inclusion || []);

      // Logic to initialize imageUrls correctly
      const initialImages = product.images || [];
      if (product.image && !initialImages.includes(product.image)) {
        setImageUrls([product.image, ...initialImages]); // Add main image to the front if not already in images
      } else {
        setImageUrls(initialImages);
      }

      setSpecifications(
        product.specifications || {
          dimensions: "",
          height: "",
          foundation: "",
          structure: "",
          roof: "",
          windows: "",
          electrical: "",
          plumbing: "",
        }
      );

      // Separate predefined from dynamic specs if your backend supports both
      const predefinedKeys = Object.keys(ProductSpecificationsSchema.shape);
      const currentDynamicSpecs: Record<string, string> = {};
      if (product.specifications) {
        for (const key in product.specifications) {
          if (!predefinedKeys.includes(key)) {
            currentDynamicSpecs[key] = (product.specifications as any)[key];
          }
        }
      }
      setDynamicSpecs(currentDynamicSpecs);
    } else {
      // Reset form and states for adding a new product
      form.reset({
        name: "",
        price: 0,
        category: "",
        squareFeet: 0,
        image: "",
        description: "",
        longDescription: "",
        leadTime: "",
        modelUrl: "",
      });
      setFeatures([]);
      setInclusions([]);
      setImageUrls([]);
      setSpecifications({
        dimensions: "",
        height: "",
        foundation: "",
        structure: "",
        roof: "",
        windows: "",
        electrical: "",
        plumbing: "",
      });
      setDynamicSpecs({});
    }
    setActiveTab("basic");
  }, [product, form]);

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions((prev) => [...prev, newInclusion.trim()]);
      setNewInclusion("");
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setInclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...imageUrls, newImageUrl.trim()];
      setImageUrls(updatedImages);
      // If no main image is set in the form, use the first added image as main
      if (!form.getValues("image") && updatedImages.length > 0) {
        form.setValue("image", updatedImages[0]);
      }
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);

    // If the removed image was the main image (first in list)
    if (index === 0) {
      if (updatedImages.length > 0) {
        form.setValue("image", updatedImages[0]); // Set new first image as main
      } else {
        form.setValue("image", ""); // No images left, clear main image
      }
    } else if (form.getValues("image") === imageUrls[index]) {
      // If the removed image was explicitly set as main (but not necessarily first)
      form.setValue("image", ""); // Clear main image
    }
  };

  const handleAddDynamicSpecification = () => {
    if (newDynamicSpecKey.trim() && newDynamicSpecValue.trim()) {
      const updatedDynamicSpecs = {
        ...dynamicSpecs,
        [newDynamicSpecKey.trim()]: newDynamicSpecValue.trim(),
      };
      setDynamicSpecs(updatedDynamicSpecs);
      setNewDynamicSpecKey("");
      setNewDynamicSpecValue("");
    }
  };

  const handleRemoveDynamicSpecification = (key: string) => {
    const { [key]: _, ...updatedDynamicSpecs } = dynamicSpecs;
    setDynamicSpecs(updatedDynamicSpecs);
  };

  const handleFormSubmit = (data: ProductFormData) => {
    // Transform ProductFormData (form's internal state) to Product (backend's expected format)
    const productDataForBackend: Omit<
      Product,
      "_id" | "createdAt" | "updatedAt"
    > = {
      productName: data.name,
      productPrice: data.price,
      category: data.category,
      squareFeet: data.squareFeet,
      image: data.image || (imageUrls.length > 0 ? imageUrls[0] : undefined), // Use form's main image, or first from imageUrls
      productShortDescription: data.description || undefined,
      productLongDescription: data.longDescription || undefined,
      threeDModelUrl: data.modelUrl || undefined,
      leadTime: data.leadTime || undefined,
      features: features.length > 0 ? features : undefined,
      images: imageUrls.length > 0 ? imageUrls : undefined, // All images
      inclusion: inclusions.length > 0 ? inclusions : undefined,
      // Merge predefined specifications with dynamic ones
      specifications: { ...specifications, ...dynamicSpecs },
    };

    // Filter out empty strings from specifications object before sending, if backend expects undefined for empty.
    // However, your model defines them as `string`, so empty string is likely fine.
    // If your backend strictly expects only non-empty strings, you might need a cleanup step here.
    const cleanSpecifications: ProductSpecifications | undefined =
      Object.values(productDataForBackend.specifications || {}).some(
        (val) => val !== "" && val !== undefined
      )
        ? (productDataForBackend.specifications as ProductSpecifications)
        : undefined;

    const finalProductData = {
      ...productDataForBackend,
      specifications: cleanSpecifications,
    };

    onSubmit(finalProductData); // Pass the transformed data to the parent component
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto px-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="specifications">Specs</TabsTrigger>
          <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 mt-4"
          >
            <TabsContent value="basic" className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
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
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="squareFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Feet</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
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
                        <Input placeholder="e.g. 4-6 weeks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="modelUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3D Model URL (Sketchfab)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://sketchfab.com/3d-models/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Paste the Sketchfab embed URL for the 3D model preview
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a short product description"
                        className="resize-none min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a detailed product description"
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="images" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Product Images</h3>
                    <p className="text-sm text-muted-foreground">
                      Add multiple image URLs for the product. The first image
                      in this list will be used as the main image unless a
                      different "Main Image URL" is specified below.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="New Image URL"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddImage}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square border rounded-md overflow-hidden">
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {index === 0 &&
                            imageUrls[0] === form.getValues("image") && (
                              <span className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                                Main & First
                              </span>
                            )}
                          {index === 0 &&
                            imageUrls[0] !== form.getValues("image") && (
                              <span className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                                First Image
                              </span>
                            )}
                          {form.getValues("image") === url &&
                            (index !== 0 ||
                              imageUrls[0] !== form.getValues("image")) && (
                              <span className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                                Main Image
                              </span>
                            )}
                        </div>
                      ))}
                    </div>

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Main Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the main product image URL"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">
                            This URL will be used as the primary display image.
                            If left blank, the first image in the "Product
                            Images" list above will be used.
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Product Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Add key features of the product, such as amenities and
                      notable characteristics.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a feature"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddFeature}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <span>{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Product Specifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter specific details for each predefined specification
                      field.
                    </p>

                    {/* Dedicated input fields for predefined specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.keys(specifications).map((key) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name={`specifications.${
                            key as keyof ProductSpecifications
                          }`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="capitalize">
                                {key.replace(/([A-Z])/g, " $1")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`Enter ${key
                                    .replace(/([A-Z])/g, " $1")
                                    .toLowerCase()}`}
                                  {...field}
                                  value={
                                    specifications[
                                      key as keyof ProductSpecifications
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    setSpecifications((prev) => ({
                                      ...prev,
                                      [key]: e.target.value,
                                    }))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground mt-4">
                      (Optional: Add custom specifications not listed above if
                      your backend supports them)
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Custom Spec Name"
                          value={newDynamicSpecKey}
                          onChange={(e) => setNewDynamicSpecKey(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Custom Spec Value"
                            value={newDynamicSpecValue}
                            onChange={(e) =>
                              setNewDynamicSpecValue(e.target.value)
                            }
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddDynamicSpecification}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      {Object.entries(dynamicSpecs).map(
                        ([key, value], index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center border-b pb-2"
                          >
                            <div>
                              <span className="font-medium capitalize">
                                {key}:{" "}
                              </span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveDynamicSpecification(key)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inclusions" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">What's Included</h3>
                    <p className="text-sm text-muted-foreground">
                      List items that are included with the product purchase.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add an included item"
                          value={newInclusion}
                          onChange={(e) => setNewInclusion(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddInclusion}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {" "}
                      {inclusions.map((inclusion, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <span>{inclusion}</span>{" "}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInclusion(index)}
                          >
                            {" "}
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                {" "}
                Cancel{" "}
              </Button>
              <Button type="submit">
                {" "}
                {isEditMode ? "Update Product" : "Add Product"}{" "}
              </Button>{" "}
            </div>{" "}
          </form>
        </Form>
      </Tabs>
    </div>
  );
};
export default ProductForm;
