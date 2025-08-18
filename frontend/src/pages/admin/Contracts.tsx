import React, { useState, useRef } from 'react'; // Import useRef
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileText,
  Download,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Printer,
  FilePlus
} from "lucide-react";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { toast } from 'sonner';
import FormalContractDocument from "@/components/contract/FormalContractDocument";
import html2pdf from 'html2pdf.js'; // Import html2pdf.js

const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isContractViewOpen, setIsContractViewOpen] = useState(false);
  const [isFormalDocumentOpen, setIsFormalDocumentOpen] = useState(false);

  // Ref to hold the content of the FormalContractDocument for PDF generation
  const formalDocumentRef = useRef<HTMLDivElement>(null);

  const contracts = orders.map(order => ({
    id: `contract-${order.id}`,
    orderId: order.id,
    customerName: order.customerName || "Unknown Customer",
    customerEmail: order.customerEmail || "No email provided",
    productName: products.find(p => p.id === order.products[0]?.productId)?.name || "Unknown Product",
    status: order.status === "Delivered" ? "Completed" :
            order.status === "Cancelled" ? "Cancelled" :
            order.status === "Ready for Delivery" ? "Ready for Delivery" : "Pending",
    createdAt: order.createdAt,
    signedAt: order.status === "Delivered" ? order.createdAt : null,
    contractValue: order.totalAmount,
    terms: "Standard prefab construction terms and conditions apply.",
    deliveryAddress: "Customer specified location",
    paymentTerms: "50% down payment, 40% on delivery, 10% upon completion",
    warrantyPeriod: "2 years structural warranty"
  }));

  const filteredContracts = contracts.filter(contract => {
    const customerName = contract.customerName || "";
    const orderId = contract.orderId || "";
    const productName = contract.productName || "";

    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Ready for Delivery":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ready for Delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = {
    total: contracts.length,
    signed: contracts.filter(c => c.status === "Completed").length,
    pending: contracts.filter(c => c.status === "Pending").length,
    cancelled: contracts.filter(c => c.status === "Cancelled").length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Original handleDownloadPDF for the generated HTML content (simpler contract view)
  const handleDownloadPDF = (contract: any) => {
    const printContent = generatePrintableContract(contract);

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Contract ${contract.orderId}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { background: #1e40af; color: white; padding: 20px; text-align: center; margin-bottom: 30px; }
              .company-name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
              .company-subtitle { font-size: 18px; margin-bottom: 10px; }
              .contact-info { font-size: 14px; }
              .contract-info { text-align: right; margin-bottom: 30px; font-size: 14px; }
              .section { margin: 30px 0; }
              .section-title { font-size: 18px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 5px; margin-bottom: 15px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background: #f8f9fa; font-weight: bold; }
              .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 15px 0; }
              .terms-box { background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; margin: 20px 0; }
              .signature-section { margin-top: 50px; }
              .signature-box { border: 2px dashed #6c757d; padding: 30px; margin: 20px 0; text-align: center; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);

      toast.success(`Contract PDF for Order #${contract.orderId} is ready for download`);
    }
  };

  const generatePrintableContract = (contract: any) => {
    return `
      <div class="header">
        <div class="company-name">CAMCO MEGA SALES CORP.</div>
        <div class="company-subtitle">PREFAB CONTAINER AND CAMHOUSE</div>
        <div class="contact-info">
          0997-951-7188 | camco.prefab3@gmail.com<br>
          Masterson Ave., Upper Balulang, Cagayan de Oro City
        </div>
      </div>

      <div class="contract-info">
        <strong>Contract ID:</strong> ${contract.id}<br>
        <strong>Order Reference:</strong> #${contract.orderId}<br>
        <strong>Date Issued:</strong> ${formatDate(contract.createdAt)}<br>
        <strong>Status:</strong> ${contract.status}
      </div>

      <div class="section">
        <div class="section-title">CONTRACT PARTIES</div>
        <table>
          <tr>
            <td style="width: 50%; vertical-align: top;">
              <strong>SERVICE PROVIDER:</strong><br>
              CAMCO MEGA SALES CORP.<br>
              Masterson Ave., Upper Balulang<br>
              Cagayan de Oro City<br>
              Contact: 0997-951-7188<br>
              Email: camco.prefab3@gmail.com
            </td>
            <td style="width: 50%; vertical-align: top;">
              <strong>CLIENT:</strong><br>
              ${contract.customerName}<br>
              Email: ${contract.customerEmail}<br>
              Delivery Address: ${contract.deliveryAddress}
            </td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">PRODUCT SPECIFICATIONS</div>
        <table>
          <tr>
            <th>Product</th>
            <th>Contract Value</th>
            <th>Payment Terms</th>
            <th>Warranty</th>
          </tr>
          <tr>
            <td>${contract.productName}</td>
            <td><strong>${formatCurrency(contract.contractValue)}</strong></td>
            <td>${contract.paymentTerms}</td>
            <td>${contract.warrantyPeriod}</td>
          </tr>
        </table>
      </div>

      <div class="highlight">
        <strong>PROJECT SCOPE:</strong> Supply, delivery, and installation of prefab container house as per agreed specifications and quality standards.
      </div>

      <div class="section">
        <div class="section-title">TERMS AND CONDITIONS</div>
        <div class="terms-box">
          <p><strong>1. PAYMENT TERMS:</strong> ${contract.paymentTerms}</p>
          <p><strong>2. DELIVERY:</strong> As per agreed schedule to ${contract.deliveryAddress}</p>
          <p><strong>3. WARRANTY:</strong> ${contract.warrantyPeriod} from completion date</p>
          <p><strong>4. GENERAL CONDITIONS:</strong> ${contract.terms}</p>
        </div>
      </div>

      <div class="signature-section">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
          <div class="signature-box">
            <p><strong>AUTHORIZED REPRESENTATIVE</strong></p>
            <br><br><br>
            <p>____________________________</p>
            <p>CAMCO MEGA SALES CORP.</p>
            <p>Date: _______________</p>
          </div>
          <div class="signature-box">
            <p><strong>CLIENT SIGNATURE</strong></p>
            <br><br><br>
            <p>____________________________</p>
            <p>${contract.customerName}</p>
            <p>Date: _______________</p>
          </div>
        </div>
      </div>
    `;
  };

  // New function to handle PDF download of the FormalContractDocument
  const handleDownloadFormalPDF = async (contract: any) => {
    setSelectedContract(contract); // Ensure the contract is selected for the FormalContractDocument to render
    setIsFormalDocumentOpen(true); // Open the dialog to render the component

    // Use a small delay to ensure the component has rendered in the DOM
    setTimeout(async () => {
      if (formalDocumentRef.current) {
        try {
          await html2pdf().from(formalDocumentRef.current).save(`Formal_Contract_Order_${contract.orderId}.pdf`);
          toast.success(`Formal Contract Document for Order #${contract.orderId} downloaded successfully!`);
        } catch (error) {
          console.error("Error generating PDF:", error);
          toast.error("Failed to generate PDF. Please try again.");
        } finally {
          setIsFormalDocumentOpen(false); // Close the dialog after download
        }
      } else {
        toast.error("Formal contract document content not found for PDF generation.");
        setIsFormalDocumentOpen(false); // Close the dialog
      }
    }, 500); // Adjust delay if needed
  };

  const handleViewContract = (contract: unknown) => {
    setSelectedContract(contract);
    setIsContractViewOpen(true);
  };

  const handleGenerateFormalDocument = (contract: unknown) => {
    setSelectedContract(contract);
    setIsFormalDocumentOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-gray-600">View, manage and download customer contracts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Signed</p>
                <p className="text-2xl font-bold text-green-600">{stats.signed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "Pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("Pending")}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "Completed" ? "default" : "outline"}
                onClick={() => setStatusFilter("Completed")}
                size="sm"
              >
                Signed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <CardTitle>Contracts Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold">{contract.productName}</h3>
                      <p className="text-sm text-gray-600">
                        Customer: {contract.customerName} | Order: #{contract.orderId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(contract.createdAt)}
                        {contract.signedAt && ` | Signed: ${formatDate(contract.signedAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(contract.contractValue)}</p>
                      <Badge className={getStatusColor(contract.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(contract.status)}
                          {contract.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewContract(contract)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateFormalDocument(contract)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <FilePlus className="h-4 w-4 mr-2" />
                        Formal Doc
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadFormalPDF(contract)} // Changed to new handler
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download as PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Contract View Dialog */}
      <Dialog open={isContractViewOpen} onOpenChange={setIsContractViewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Review - Order #{selectedContract?.orderId}
            </DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              {/* Contract Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">CAMCO MEGA SALES CORP.</h2>
                  <p className="text-lg font-semibold">PREFAB CONTAINER AND CAMHOUSE</p>
                  <div className="text-sm mt-3 opacity-90">
                    <p>0997-951-7188 | camco.prefab3@gmail.com</p>
                    <p>Masterson Ave., Upper Balulang, Cagayan de Oro City</p>
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-600">Contract ID</label>
                  <p className="text-base font-semibold">{selectedContract.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Reference</label>
                  <p className="text-base font-semibold">#{selectedContract.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date Issued</label>
                  <p className="text-base">{formatDate(selectedContract.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contract Status</label>
                  <Badge className={`${getStatusColor(selectedContract.status)} ml-2`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedContract.status)}
                      {selectedContract.status}
                    </div>
                  </Badge>
                </div>
              </div>

              {/* Contract Parties */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b-2 border-blue-700 pb-2">Contract Parties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Service Provider</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-semibold">CAMCO MEGA SALES CORP.</p>
                      <p className="text-sm text-gray-600">Masterson Ave., Upper Balulang</p>
                      <p className="text-sm text-gray-600">Cagayan de Oro City</p>
                      <p className="text-sm text-gray-600">Contact: 0997-951-7188</p>
                      <p className="text-sm text-gray-600">Email: camco.prefab3@gmail.com</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-semibold">{selectedContract.customerName}</p>
                      <p className="text-sm text-gray-600">Email: {selectedContract.customerEmail}</p>
                      <p className="text-sm text-gray-600">Delivery: {selectedContract.deliveryAddress}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Product Specifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b-2 border-blue-700 pb-2">Product Specifications</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">Contract Value</TableHead>
                      <TableHead className="font-semibold">Payment Terms</TableHead>
                      <TableHead className="font-semibold">Warranty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{selectedContract.productName}</TableCell>
                      <TableCell className="font-bold text-green-600">{formatCurrency(selectedContract.contractValue)}</TableCell>
                      <TableCell>{selectedContract.paymentTerms}</TableCell>
                      <TableCell>{selectedContract.warrantyPeriod}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Project Scope */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">Project Scope</h4>
                <p className="text-sm text-blue-700">
                  Supply, delivery, and installation of prefab container house as per agreed specifications and quality standards.
                </p>
              </div>

              {/* Terms and Conditions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b-2 border-blue-700 pb-2">Terms and Conditions</h3>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. PAYMENT TERMS</h4>
                    <p className="text-sm text-gray-700">{selectedContract.paymentTerms}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">2. DELIVERY</h4>
                    <p className="text-sm text-gray-700">As per agreed schedule to {selectedContract.deliveryAddress}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">3. WARRANTY</h4>
                    <p className="text-sm text-gray-700">{selectedContract.warrantyPeriod} from completion date</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">4. GENERAL CONDITIONS</h4>
                    <p className="text-sm text-gray-700">{selectedContract.terms}</p>
                  </div>
                </div>
              </div>

              {/* Signature Status */}
              {selectedContract.signedAt && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Contract Signed</h4>
                  </div>
                  <p className="text-sm text-green-700">Signed on: {formatDate(selectedContract.signedAt)}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  onClick={() => handleDownloadFormalPDF(selectedContract)} // Ensure this calls the correct handler
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4" />
                  Download as PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Contract
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGenerateFormalDocument(selectedContract)}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  <FilePlus className="h-4 w-4" />
                  Formal Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Formal Contract Document Dialog */}
      <Dialog open={isFormalDocumentOpen} onOpenChange={setIsFormalDocumentOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Formal Contract Document - Order #{selectedContract?.orderId}
            </DialogTitle>
          </DialogHeader>
          {/* Attach the ref to the FormalContractDocument's root element */}
          {selectedContract && (
            <div ref={formalDocumentRef} className="p-6"> {/* Added a div wrapper with ref */}
              <FormalContractDocument contract={selectedContract} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;