
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
}

// Mock customers data
export const customers: Customer[] = [
  {
    id: "c1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 94523",
    totalOrders: 3,
    totalSpent: 42000.00
  },
  {
    id: "c2",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Somewhere, NY 10001",
    totalOrders: 1,
    totalSpent: 10080.00
  },
  {
    id: "c3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine Blvd, Nowhere, TX 75001",
    totalOrders: 2,
    totalSpent: 15000.00
  },
  {
    id: "c4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(555) 456-7890",
    address: "321 Cedar Dr, Elsewhere, FL 33101",
    totalOrders: 1,
    totalSpent: 16600.00
  },
  {
    id: "c5",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "(555) 567-8901",
    address: "654 Maple Ln, Anywhere, WA 98101",
    totalOrders: 2,
    totalSpent: 11900.00
  }
];

// Function to find a customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};
