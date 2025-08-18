
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableBody, TableRow, 
  TableHead, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customers } from '@/data/customers';
import { Plus } from 'lucide-react';

const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>
      
      <div className="rounded-lg border">
        <div className="flex items-center p-4">
          <Input 
            placeholder="Search customers..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map(customer => (
              <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell className="text-right">${customer.totalSpent.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
