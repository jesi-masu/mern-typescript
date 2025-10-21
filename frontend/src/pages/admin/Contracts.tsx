import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  FilePlus,
} from "lucide-react";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { toast } from "sonner";
import FormalContractDocument from "@/components/contract/FormalContractDocument";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOM from "react-dom/client";

const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isContractViewOpen, setIsContractViewOpen] = useState(false);
  const [isFormalDocumentOpen, setIsFormalDocumentOpen] = useState(false);

  const contracts = orders.map((order) => ({
    id: `contract-${order.id}`,
    orderId: order.id,
    customerName: order.customerName || "Unknown Customer",
    customerEmail: order.customerEmail || "No email provided",
    productName:
      products.find((p) => p.id === order.products[0]?.productId)?.name ||
      "Unknown Product",
    status:
      order.status === "Delivered"
        ? "Completed"
        : order.status === "Cancelled"
        ? "Cancelled"
        : order.status === "Ready for Delivery"
        ? "Ready for Delivery"
        : "Pending",
    createdAt: order.createdAt,
    signedAt: order.status === "Delivered" ? order.createdAt : null,
    contractValue: order.totalAmount,
    terms: "Standard prefab construction terms and conditions apply.",
    deliveryAddress: "Customer specified location",
    paymentTerms: "50% down payment, 50% on delivery",
    warrantyPeriod: "2 years structural warranty",
  }));

  const filteredContracts = contracts.filter((contract) => {
    const customerName = contract.customerName || "";
    const orderId = contract.orderId || "";
    const productName = contract.productName || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contract.status === statusFilter;

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
    signed: contracts.filter((c) => c.status === "Completed").length,
    pending: contracts.filter((c) => c.status === "Pending").length,
    cancelled: contracts.filter((c) => c.status === "Cancelled").length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownloadPDF = async (contract: any) => {
    try {
      toast.info("Generating PDF... Please wait");

      // Create a temporary container to render the FormalContractDocument
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm"; // A4 width
      tempContainer.style.background = "white";
      tempContainer.style.padding = "20mm"; // A4 margins
      tempContainer.style.boxSizing = "border-box";

      // Add CSS for proper table rendering
      const style = document.createElement("style");
      style.textContent = `
        [role="table"] { display: table !important; width: 100%; border-collapse: collapse; border: 1px solid #000; }
        [role="rowgroup"] { display: table-row-group !important; }
        [role="row"] { display: table-row !important; }
        [role="columnheader"] { display: table-cell !important; border: 1px solid #000; padding: 0.75rem; background-color: #dbeafe; font-weight: 700; text-align: center; }
        [role="cell"] { display: table-cell !important; border: 1px solid #000; padding: 0.75rem; vertical-align: top; }
        table { border-collapse: collapse; border: 1px solid #000; }
        th, td { border: 1px solid #000 !important; padding: 0.75rem; }
        .border { border: 1px solid #000 !important; }
      `;
      tempContainer.appendChild(style);
      document.body.appendChild(tempContainer);

      // Render the FormalContractDocument component
      const root = ReactDOM.createRoot(tempContainer);

      await new Promise<void>((resolve) => {
        root.render(
          <div id="pdf-contract-content">
            <FormalContractDocument contract={contract} />
          </div>
        );
        // Wait for render to complete
        setTimeout(resolve, 1000);
      });

      const element = tempContainer.querySelector(
        "#formal-contract-content"
      ) as HTMLElement;
      if (!element) {
        throw new Error("Contract content not found");
      }

      // PDF settings for A4 size with margins
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20; // 20mm margins
      const contentWidth = pageWidth - 2 * margin;
      const contentHeight = pageHeight - 2 * margin;

      // Find page breaks
      const pageBreaks = element.querySelectorAll(".page-break");
      const sections: HTMLElement[] = [];

      if (pageBreaks.length > 0) {
        // Split content by page breaks
        let currentSection = document.createElement("div");
        currentSection.style.background = "white";
        currentSection.style.width = "170mm"; // Content width (210mm - 40mm margins)
        currentSection.style.padding = "0";
        currentSection.style.boxSizing = "border-box";

        Array.from(element.children).forEach((child) => {
          if (child.classList.contains("page-break")) {
            if (currentSection.children.length > 0) {
              sections.push(currentSection);
            }
            currentSection = document.createElement("div");
            currentSection.style.background = "white";
            currentSection.style.width = "170mm";
            currentSection.style.padding = "0";
            currentSection.style.boxSizing = "border-box";
          } else {
            currentSection.appendChild(child.cloneNode(true));
          }
        });

        if (currentSection.children.length > 0) {
          sections.push(currentSection);
        }
      } else {
        sections.push(element);
      }

      // Render each section to PDF
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionContainer = document.createElement("div");
        sectionContainer.style.position = "absolute";
        sectionContainer.style.left = "-9999px";
        sectionContainer.style.background = "white";
        sectionContainer.style.width = "170mm"; // Content width
        sectionContainer.style.padding = "0";
        sectionContainer.style.boxSizing = "border-box";
        sectionContainer.appendChild(section);
        document.body.appendChild(sectionContainer);

        const canvas = await html2canvas(section, {
          scale: 2.5, // Higher scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 1700, // Width in pixels (170mm * 10)
          imageTimeout: 0,
        });

        const imgData = canvas.toDataURL("image/png", 1.0);

        // Calculate image dimensions to fit within content area with margins
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        // Add image with proper margins
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        document.body.removeChild(sectionContainer);
      }

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      // Save the PDF
      const quoteNumber = `RB-2024-${contract.orderId}`;
      pdf.save(`Contract_${quoteNumber}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
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
          <p><strong>2. DELIVERY:</strong> As per agreed schedule to ${
            contract.deliveryAddress
          }</p>
          <p><strong>3. WARRANTY:</strong> ${
            contract.warrantyPeriod
          } from completion date</p>
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

  const handleViewContract = (contract: any) => {
    window.location.href = `/admin/contracts/${contract.id}`;
  };

  const handleGenerateFormalDocument = (contract: any) => {
    setSelectedContract(contract);
    setIsFormalDocumentOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-gray-600">
            View, manage and download customer contracts
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Contracts
                </p>
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
                <p className="text-2xl font-bold text-green-600">
                  {stats.signed}
                </p>
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
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
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
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
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
              <div
                key={contract.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold">{contract.productName}</h3>
                      <p className="text-sm text-gray-600">
                        Customer: {contract.customerName} | Order: #
                        {contract.orderId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(contract.createdAt)}
                        {contract.signedAt &&
                          ` | Signed: ${formatDate(contract.signedAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(contract.contractValue)}
                      </p>
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
                        onClick={() => handleDownloadPDF(contract)}
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

      {/* Formal Contract Document Dialog */}
      <Dialog
        open={isFormalDocumentOpen}
        onOpenChange={setIsFormalDocumentOpen}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Formal Contract Document - Order #{selectedContract?.orderId}
            </DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <FormalContractDocument contract={selectedContract} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
