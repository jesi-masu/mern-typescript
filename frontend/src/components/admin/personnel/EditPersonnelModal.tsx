import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PersonnelForm, PersonnelFormValues } from "./PersonnelForm";
import { Personnel } from "@/pages/admin/ManagePersonnelPage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle } from "lucide-react";

interface EditPersonnelModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string | null; // ID of the member to edit
}

// API Functions (could be moved to a service file)
const fetchPersonnelById = async (
  id: string,
  token: string | null
): Promise<Personnel> => {
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch personnel details.");
  return response.json();
};

const updatePersonnel = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: Partial<PersonnelFormValues>;
  token: string | null;
}): Promise<Personnel> => {
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update personnel.");
  }
  return response.json();
};

export const EditPersonnelModal: React.FC<EditPersonnelModalProps> = ({
  isOpen,
  onOpenChange,
  memberId,
}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch data for the specific member when the modal is open and ID is available
  const {
    data: member,
    isLoading,
    error,
    isFetching,
  } = useQuery<Personnel>({
    queryKey: ["personnel", memberId],
    queryFn: () => fetchPersonnelById(memberId!, token),
    enabled: !!memberId && isOpen, // Only fetch when modal is open and ID exists
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 mins
  });

  // Setup mutation for updating
  const mutation = useMutation({
    mutationFn: (updateData: Partial<PersonnelFormValues>) => {
      if (!memberId) throw new Error("No member ID provided for update.");
      return updatePersonnel({ id: memberId, data: updateData, token });
    },
    onSuccess: (updatedData) => {
      toast({
        title: "Success!",
        description: `Details for ${updatedData.firstName} ${updatedData.lastName} updated.`,
      });
      onOpenChange(false); // Close modal on success
      queryClient.invalidateQueries({ queryKey: ["personnel"] }); // Invalidate list
      queryClient.invalidateQueries({ queryKey: ["personnel", memberId] }); // Invalidate specific user
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Could not update details.",
        variant: "destructive",
      });
    },
  });

  // Handler for form submission passed to PersonnelForm
  const handleEditSubmit = async (formData: PersonnelFormValues) => {
    mutation.mutate(formData);
  };

  // Prepare initial data once member data is loaded
  const initialValues = member
    ? {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        role: member.role,
        position: member.position,
        department: member.department,
        status: member.status,
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            Edit Personnel: {member?.firstName} {member?.lastName}
          </DialogTitle>
          <DialogDescription>
            Modify the details for this team member. Password cannot be changed
            here.
          </DialogDescription>
        </DialogHeader>
        {isLoading || isFetching ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" /> Error loading data.
          </div>
        ) : member ? (
          <PersonnelForm
            onSubmit={handleEditSubmit}
            onCancel={() => onOpenChange(false)}
            isProcessing={mutation.isPending}
            initialData={initialValues}
          />
        ) : (
          <div className="text-center py-10 text-gray-500">
            Member data not available.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
