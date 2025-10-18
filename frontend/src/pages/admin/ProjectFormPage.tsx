// src/pages/admin/ProjectFormPage.tsx

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Project } from "@/types";
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
import DynamicListInput from "@/components/common/DynamicListInput"; // Import the reusable component

// Zod schema for the form's core, non-array fields
const projectSchema = z.object({
  projectTitle: z.string().min(3, "A project name is required"),
  shortDescription: z.string().min(10, "A short tagline is required"),
  longDescription: z.string().optional(),
  projectCategory: z.enum(["Residential", "Commercial", "Industrial"]),
  projectStatus: z.enum(["In Progress", "Completed"]),
  modules: z.coerce.number().min(1, "Must have at least 1 module"),
  completionDate: z.string().min(1, "Completion date is required"),
  cityMunicipality: z.string().min(2, "City/Municipality is required"),
  province: z.string().min(2, "Province is required"),
  country: z.string().min(2, "Country is required"),
  image: z.string().url("A valid main image URL is required"),
  threeDLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  projectVideoLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  videoDesc: z.string().optional(),
  layoutDesc: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const ProjectFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(isEditing);

  // States for managing dynamic arrays (handled by DynamicListInput)
  const [features, setFeatures] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imagesDesc, setImagesDesc] = useState<string[]>([]);
  const [layoutImages, setLayoutImages] = useState<string[]>([]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectStatus: "In Progress",
      projectCategory: "Residential",
      country: "Philippines",
    },
  });

  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const response = await fetch(
            `http://localhost:4000/api/projects/${id}`
          );
          if (!response.ok) throw new Error("Project not found");
          const data: Project = await response.json();

          form.reset({
            ...data,
            completionDate: new Date(data.completionDate)
              .toISOString()
              .split("T")[0],
          });

          setFeatures(data.features || []);
          setHighlights(data.highlights || []);
          setImages(data.images || []);
          setImagesDesc(data.imagesDesc || []);
          setLayoutImages(data.layoutImages || []);
        } catch (error) {
          toast.error("Failed to load project data.");
          navigate("/admin/projects");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditing, navigate, form]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    const finalPayload = {
      ...data,
      features,
      highlights,
      images,
      imagesDesc,
      layoutImages,
    };
    const url = isEditing
      ? `http://localhost:4000/api/projects/${id}`
      : `http://localhost:4000/api/projects`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      if (!response.ok)
        throw new Error(
          `Failed to ${isEditing ? "update" : "create"} project.`
        );
      toast.success(
        `Project ${isEditing ? "updated" : "created"} successfully!`
      );
      navigate("/admin/projects");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading project form...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Project" : "Create New Project"}
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to showcase your work.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/projects")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* === LEFT COLUMN: MAIN CONTENT === */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Story</CardTitle>
                  <CardDescription>
                    This is the core narrative of the project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="projectTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            placeholder="e.g., Serene Lakeside Residences"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Tagline</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Textarea
                            placeholder="A compelling one-sentence summary for project cards."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Overview</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Textarea
                            placeholder="Tell the detailed story of this project's journey and outcome."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media & Links</CardTitle>
                  <CardDescription>
                    Visuals are key. Add URLs for images and videos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            placeholder="https://... (This is the main image for cards and heroes)"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Correctly using DynamicListInput */}
                  <DynamicListInput
                    title="Gallery Images"
                    placeholder="Add another image URL..."
                    items={images}
                    setItems={setImages}
                  />
                  <DynamicListInput
                    title="Gallery Image Descriptions"
                    placeholder="Add a description for each image..."
                    items={imagesDesc}
                    setItems={setImagesDesc}
                  />

                  <FormField
                    control={form.control}
                    name="projectVideoLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Video URL</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="videoDesc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Description</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            placeholder="A short description of the video content."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Layout & Blueprints</CardTitle>
                  <CardDescription>
                    Add links to layout images and 3D models.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Correctly using DynamicListInput */}
                  <DynamicListInput
                    title="Layout Image URLs"
                    placeholder="Add a blueprint/layout image URL..."
                    items={layoutImages}
                    setItems={setLayoutImages}
                  />
                  <FormField
                    control={form.control}
                    name="layoutDesc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Layout Description</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            placeholder="e.g., 'Three-bedroom floor plan with open-concept living area.'"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="threeDLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>3D Model Link</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            placeholder="https://sketchfab.com/..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features & Highlights</CardTitle>
                  <CardDescription>
                    What makes this project special? Add key selling points.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Correctly using DynamicListInput */}
                  <DynamicListInput
                    title="Key Features"
                    placeholder="Add a detailed feature..."
                    items={features}
                    setItems={setFeatures}
                  />
                  <DynamicListInput
                    title="Sidebar Highlights"
                    placeholder="Add a short highlight..."
                    items={highlights}
                    setItems={setHighlights}
                  />
                </CardContent>
              </Card>
            </div>

            {/* === RIGHT COLUMN: METADATA === */}
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Status & Categorization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="projectStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Status</FormLabel>
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
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Category</FormLabel>
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
                            <SelectItem value="Residential">
                              Residential
                            </SelectItem>
                            <SelectItem value="Commercial">
                              Commercial
                            </SelectItem>
                            <SelectItem value="Industrial">
                              Industrial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Core Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="modules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Modules</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="completionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completion Date</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cityMunicipality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City / Municipality</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? "Saving..."
                      : isEditing
                      ? "Update Project"
                      : "Create Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/projects")}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProjectFormPage;
