
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

// Define the form schema with validation - expanded to include all project detail fields
const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Please enter a valid URL'),
  videoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  status: z.enum(['Planning', 'In Progress', 'Completed']),
  progress: z.coerce.number().min(0).max(100),
  modules: z.coerce.number().min(1, 'Project must have at least 1 module'),
  completionDate: z.string(),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  category: z.enum(['Residential', 'Commercial', 'Industrial']),
  // Additional fields from project details
  clientName: z.string().optional(),
  projectValue: z.coerce.number().min(0, 'Project value must be a positive number').optional(),
  architect: z.string().optional(),
  contractor: z.string().optional(),
  startDate: z.string().optional(),
  projectArea: z.coerce.number().min(0, 'Project area must be a positive number').optional(),
  sustainability: z.string().optional(),
  challenges: z.string().optional(),
  features: z.string().optional(),
  materials: z.string().optional(),
  teamSize: z.coerce.number().min(1, 'Team size must be at least 1').optional(),
  budget: z.coerce.number().min(0, 'Budget must be a positive number').optional()
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export interface ProjectFormProps {
  project?: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    status: string;
    progress: number;
    modules: number;
    completionDate: string;
    location: string;
    category: "Residential" | "Commercial" | "Industrial";
    // Additional optional fields
    clientName?: string;
    projectValue?: number;
    architect?: string;
    contractor?: string;
    startDate?: string;
    projectArea?: number;
    sustainability?: string;
    challenges?: string;
    features?: string;
    materials?: string;
    teamSize?: number;
    budget?: number;
  };
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel
}) => {
  // Initialize form with project data if provided, otherwise use defaults
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      imageUrl: project?.imageUrl || '',
      videoUrl: project?.videoUrl || '',
      status: project?.status as 'Planning' | 'In Progress' | 'Completed' || 'Planning',
      progress: project?.progress || 0,
      modules: project?.modules || 1,
      completionDate: project?.completionDate || new Date().toISOString().split('T')[0],
      location: project?.location || '',
      category: project?.category || 'Residential',
      // Additional fields
      clientName: project?.clientName || '',
      projectValue: project?.projectValue || 0,
      architect: project?.architect || '',
      contractor: project?.contractor || '',
      startDate: project?.startDate || new Date().toISOString().split('T')[0],
      projectArea: project?.projectArea || 0,
      sustainability: project?.sustainability || '',
      challenges: project?.challenges || '',
      features: project?.features || '',
      materials: project?.materials || '',
      teamSize: project?.teamSize || 1,
      budget: project?.budget || 0
    }
  });

  const handleSubmit = (data: ProjectFormData) => {
    onSubmit(data);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto px-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{project ? 'Edit Project' : 'Add New Project'}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Project Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Project Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Value (PHP)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Enter project value in PHP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="architect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Architect</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter architect name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contractor</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contractor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Area (sq m)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Enter area in square meters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Enter team size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (PHP)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Enter budget in PHP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Features</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter key features and specifications" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Materials Used</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter materials and construction details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sustainability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sustainability Features</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter sustainability and eco-friendly features" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenges & Solutions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter project challenges and solutions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Media</h3>
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/video.mp4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status & Progress Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Status & Progress</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Modules</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;
