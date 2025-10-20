import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  Loader2,
  Shield,
  Mail,
  Phone,
  User,
  Building,
  Briefcase,
  Calendar,
} from "lucide-react";
import { PersonnelStatsHeader } from "@/components/admin/personnel/PersonnelStatsHeader";
import { PersonnelFilterBar } from "@/components/admin/personnel/PersonnelFilterBar";
import {
  PersonnelTable,
  statusMap,
} from "@/components/admin/personnel/PersonnelTable";
import {
  PersonnelForm,
  PersonnelFormValues,
} from "@/components/admin/personnel/PersonnelForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { EditPersonnelModal } from "@/components/admin/personnel/EditPersonnelModal";
import { AdminProfileCard } from "@/components/admin/personnel/AdminProfileCard";

export interface Personnel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "personnel";
  position?: string;
  department?: string;
  status: "active" | "on_leave" | "inactive";
  createdAt: string;
  address?: {
    street?: string;
    barangaySubdivision?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
}

const fetchPersonnel = async (token: string | null): Promise<Personnel[]> => {
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/personnel`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch personnel data.");
  return response.json();
};

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

const hasPermission = (userRole: string, permission: string): boolean => {
  return userRole === "admin";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const ManagePersonnelPage: React.FC = () => {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Personnel["status"]>(
    "all"
  );
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProcessingAdd, setIsProcessingAdd] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState<Personnel | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const {
    data: personnel = [],
    isLoading: isPersonnelLoading,
    error,
  } = useQuery<Personnel[]>({
    queryKey: ["personnel"],
    queryFn: () => fetchPersonnel(token),
    enabled: !!token && !isAuthLoading,
  });

  const filteredPersonnel = useMemo(() => {
    return personnel.filter((member) => {
      const lowerSearch = searchTerm.toLowerCase();
      const name = `${member.firstName} ${member.lastName}`.toLowerCase();
      const matchesSearch =
        name.includes(lowerSearch) ||
        member.email.toLowerCase().includes(lowerSearch) ||
        member.position?.toLowerCase().includes(lowerSearch) ||
        member.department?.toLowerCase().includes(lowerSearch);
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;
      const matchesDepartment =
        departmentFilter === "all" || member.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [personnel, searchTerm, statusFilter, departmentFilter]);

  const { totalCount, activeCount, onLeaveCount } = useMemo(() => {
    const total = personnel.length;
    const active = personnel.filter((p) => p.status === "active").length;
    const leave = personnel.filter((p) => p.status === "on_leave").length;
    return { totalCount: total, activeCount: active, onLeaveCount: leave };
  }, [personnel]);

  const handleAddPersonnelSubmit = async (
    data: PersonnelFormValues & { password?: string }
  ) => {
    setIsProcessingAdd(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to create user.");
      toast({
        title: "Success!",
        description: `User ${data.firstName} ${data.lastName} created.`,
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not create user.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAdd(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    setIsFetchingDetails(true);
    setIsViewDialogOpen(true);
    setViewingMember(null);
    try {
      const memberDetails = await fetchPersonnelById(id, token);
      setViewingMember(memberDetails);
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not fetch member details.",
        variant: "destructive",
      });
      setIsViewDialogOpen(false);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleOpenEditModal = (id: string) => {
    setEditingMemberId(id);
    setIsEditDialogOpen(true);
  };

  if (isAuthLoading || (isPersonnelLoading && !personnel.length && !error)) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }
  if (!user || !hasPermission(user.role, "manage_users")) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg border border-gray-100">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-lg text-gray-600">
            You do not have permission to manage personnel.
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-12 text-red-600">
        <AlertCircle className="w-12 h-12 mx-auto mb-2" /> Failed to load
        personnel data. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-8 bg-gray-50 min-h-screen">
      <AdminProfileCard />

      <PersonnelStatsHeader
        totalCount={totalCount}
        activeCount={activeCount}
        onLeaveCount={onLeaveCount}
      />

      <PersonnelFilterBar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        departmentFilter={departmentFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onDepartmentChange={setDepartmentFilter}
        departments={[
          "Administration",
          "Operations",
          "Project Management",
          "Customer Service",
          "Sales",
        ]}
        onAddNew={() => setIsAddDialogOpen(true)}
      />

      <PersonnelTable
        personnelList={filteredPersonnel}
        isLoading={isPersonnelLoading}
        onViewDetails={handleViewDetails}
        onEdit={handleOpenEditModal}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Add New Personnel / Admin</DialogTitle>
            <DialogDescription>
              Enter details and generate a temporary password.
            </DialogDescription>
          </DialogHeader>
          <PersonnelForm
            onSubmit={handleAddPersonnelSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
            isProcessing={isProcessingAdd}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Personnel Details</DialogTitle>
            <DialogDescription>
              Viewing information for {viewingMember?.firstName}{" "}
              {viewingMember?.lastName}.
            </DialogDescription>
          </DialogHeader>
          {isFetchingDetails ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : viewingMember ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  icon={User}
                  label="Role"
                  value={viewingMember.role}
                />
                <DetailItem
                  icon={Briefcase}
                  label="Position"
                  value={viewingMember.position}
                />
                <DetailItem
                  icon={Building}
                  label="Department"
                  value={viewingMember.department}
                />
                <DetailItem
                  icon={statusMap[viewingMember.status]?.icon || AlertCircle}
                  label="Status"
                >
                  <Badge
                    className={`${statusMap[viewingMember.status]?.bg} ${
                      statusMap[viewingMember.status]?.color
                    } hover:${statusMap[viewingMember.status]?.bg}`}
                  >
                    {statusMap[viewingMember.status]?.text ||
                      viewingMember.status}
                  </Badge>
                </DetailItem>
                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={viewingMember.email}
                />
                <DetailItem
                  icon={Phone}
                  label="Phone"
                  value={viewingMember.phoneNumber}
                />
                <DetailItem
                  icon={Calendar}
                  label="Join Date"
                  value={formatDate(viewingMember.createdAt)}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Could not load details.
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditPersonnelModal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        memberId={editingMemberId}
      />
    </div>
  );
};

const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: string | React.ReactNode;
  children?: React.ReactNode;
}> = ({ icon: Icon, label, value, children }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 mt-1 text-gray-500 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {children ? (
        <div className="font-semibold">{children}</div>
      ) : (
        <p className="font-semibold break-words">{value || "N/A"}</p>
      )}
    </div>
  </div>
);

export default ManagePersonnelPage;
