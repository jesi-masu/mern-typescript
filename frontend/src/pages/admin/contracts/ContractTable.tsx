import React from "react";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, FilePlus } from "lucide-react";

// We also need the ContractDisplayData interface here
interface ContractDisplayData {
  id: string;
  orderId: string;
  originalOrder: Order;
  customerName: string;
  productName: string;
  status: "Completed" | "Pending" | "Ready for Delivery" | "Cancelled";
  createdAt: string;
  contractValue: number;
}

interface ContractTableProps {
  filteredContracts: ContractDisplayData[];
  formatDate: (dateString: string | null | undefined) => string;
  formatCurrency: (amount: number) => string;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
  handleViewContract: (order: Order) => void;
  handleGenerateFormalDocument: (order: Order) => void;
  handleDownloadPDF: (order: Order) => Promise<void>;
}

const ContractTable: React.FC<ContractTableProps> = ({
  filteredContracts,
  formatDate,
  formatCurrency,
  getStatusIcon,
  getStatusColor,
  handleViewContract,
  handleGenerateFormalDocument,
  handleDownloadPDF,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-8"
                >
                  No contracts found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredContracts.map((contract) => (
                <TableRow key={contract.id} className="hover:bg-gray-50">
                  <TableCell>#{contract.orderId}</TableCell>
                  <TableCell className="font-medium">
                    {contract.productName}
                  </TableCell>
                  <TableCell>{contract.customerName}</TableCell>
                  <TableCell>{formatDate(contract.createdAt)}</TableCell>
                  <TableCell>
                    {formatCurrency(contract.contractValue)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(contract.status)} {contract.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end flex-wrap">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleViewContract(contract.originalOrder)
                        }
                        title="View Order Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleGenerateFormalDocument(contract.originalOrder)
                        }
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                        title="Generate Formal Document"
                      >
                        <FilePlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleDownloadPDF(contract.originalOrder)
                        }
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        title="Download as PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContractTable;
