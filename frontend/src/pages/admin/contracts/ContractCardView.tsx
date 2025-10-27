// frontend/src/pages/admin/contracts/ContractCardView.tsx
import React from "react";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FilePlus } from "lucide-react";

// This interface matches the full one from Contracts.tsx
interface ContractDisplayData {
  id: string;
  orderId: string;
  originalOrder: Order;
  customerName: string;
  customerEmail: string;
  productName: string;
  status: "Completed" | "Pending" | "Ready for Delivery" | "Cancelled";
  createdAt: string;
  signedAt: string | null; // Included for the card view logic
  contractValue: number;
  terms: string;
  deliveryAddress: string;
  paymentTerms: string;
  warrantyPeriod: string;
}

interface ContractCardViewProps {
  filteredContracts: ContractDisplayData[];
  formatDate: (dateString: string | null | undefined) => string;
  formatCurrency: (amount: number) => string;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
  handleViewContract: (order: Order) => void;
  handleGenerateFormalDocument: (order: Order) => void;
  handleDownloadPDF: (order: Order) => Promise<void>;
}

const ContractCardView: React.FC<ContractCardViewProps> = ({
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
        {filteredContracts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No contracts found matching your criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="border rounded-lg p-4 hover:bg-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left Side Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {contract.productName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer: {contract.customerName} | Order: #
                    {contract.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {formatDate(contract.createdAt)}
                    {contract.signedAt &&
                      ` | Completed: ${formatDate(contract.signedAt)}`}
                  </p>
                </div>

                {/* Right Side Info & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                  {/* Price & Status */}
                  <div className="text-left sm:text-right pr-4 flex-shrink-0">
                    <p className="font-semibold text-lg">
                      {formatCurrency(contract.contractValue)}
                    </p>
                    <Badge className={getStatusColor(contract.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(contract.status)}
                        {contract.status}
                      </div>
                    </Badge>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewContract(contract.originalOrder)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleGenerateFormalDocument(contract.originalOrder)
                      }
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    >
                      <FilePlus className="h-4 w-4 mr-2" /> Formal Doc
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(contract.originalOrder)}
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractCardView;
