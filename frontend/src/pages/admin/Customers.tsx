import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, AlertTriangle, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Define the shape of the customer's address
interface Address {
  street: string;
  barangaySubdivision: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

// Define the shape of the customer data you expect from the API
interface CustomerData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: Address;
  totalOrders: number;
  totalSpent: number;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { token, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    // Wait until the authentication check is complete before fetching
    if (isAuthLoading) {
      return;
    }

    const fetchCustomers = async () => {
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/clients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch customer data. You may not have permission."
          );
        }

        const data: CustomerData[] = await response.json();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message);
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [token, isAuthLoading]);

  // Helper to format the address for display
  const formatAddress = (address: Address) => {
    if (!address) return "N/A";
    return `${address.street}, ${address.barangaySubdivision}, ${address.city}, ${address.province}`;
  };

  // Filter customers based on search query, now including address
  const filteredCustomers = customers.filter((customer) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    const fullAddress = formatAddress(customer.address).toLowerCase();
    return (
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(lowerCaseSearch) ||
      customer.email.toLowerCase().includes(lowerCaseSearch) ||
      customer.phoneNumber.includes(searchQuery) ||
      fullAddress.includes(lowerCaseSearch)
    );
  });

  // Helper to format currency to Philippine Pesos
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-64 w-full items-center justify-center bg-red-50 text-red-700 rounded-lg">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <h3 className="font-semibold">Failed to load customers</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            View and effeciently track all your customers
          </p>
        </div>
      </div>

      <hr className="border-t border-gray-200" />

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center p-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or address..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-center">Total Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer._id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{`${customer.firstName} ${customer.lastName}`}</TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {customer.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>{formatAddress(customer.address)}</TableCell>
                  <TableCell className="text-center">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
