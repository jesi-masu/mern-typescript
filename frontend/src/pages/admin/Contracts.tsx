//frontend/src/pages/admin/Contracts.tsx
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  ServerCrash,
} from "lucide-react";
import { Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormalContractDocument from "@/components/contract/FormalContractDocument";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOM from "react-dom/client";
import { formatPrice } from "@/lib/formatters";
import ContractCardView from "./contracts/ContractCardView";

// Import the new child components
import ContractStats from "./contracts/ContractStats";
import ContractFilterBar from "./contracts/ContractFilterBar";
import ContractTable from "./contracts/ContractTable";

// This interface is needed by the parent (for useMemo) and the Table child
interface ContractDisplayData {
  id: string;
  orderId: string;
  originalOrder: Order;
  customerName: string;
  customerEmail: string;
  productName: string;
  status: "Completed" | "Pending" | "Ready for Delivery" | "Cancelled";
  createdAt: string;
  signedAt: string | null;
  contractValue: number;
  terms: string;
  deliveryAddress: string;
  paymentTerms: string;
  warrantyPeriod: string;
}

const fetchOrders = async (token: string | null): Promise<Order[]> => {
  if (!token) throw new Error("Authentication required.");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  const orders = await response.json();
  return orders;
};

type ViewMode = "table" | "card"; // Define the view mode type

const Contracts = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContract, setSelectedContract] = useState<Order | null>(null);
  const [isFormalDocumentOpen, setIsFormalDocumentOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("card"); // Add view mode state

  const {
    data: ordersData = [],
    isLoading,
    isError,
    error,
  } = useQuery<Order[]>({
    queryKey: ["allOrdersForContracts"],
    queryFn: () => fetchOrders(token),
    enabled: !!token,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const contracts = useMemo((): ContractDisplayData[] => {
    // ... (memo logic remains unchanged)
    return ordersData.map((order) => {
      let contractStatus: ContractDisplayData["status"] = "Pending";

      if (
        order.orderStatus === "Completed" ||
        order.orderStatus === "Delivered"
      ) {
        contractStatus = "Completed";
      } else if (order.orderStatus === "Cancelled") {
        contractStatus = "Cancelled";
      }

      const deliveryAddress = order.customerInfo?.deliveryAddress;

      const customerName = deliveryAddress
        ? `${deliveryAddress.firstName ?? ""} ${
            deliveryAddress.lastName ?? ""
          }`.trim() || "Unknown Customer"
        : "Unknown Customer";

      const customerEmail = order.customerInfo?.email ?? "No email";

      const productName =
        order.products?.[0]?.productId?.productName || "Unknown Product";

      return {
        id: order._id,
        orderId: order._id.slice(-6),
        originalOrder: order,
        customerName: customerName,
        customerEmail: customerEmail,
        productName: productName,
        status: contractStatus,
        createdAt: order.createdAt,
        signedAt: contractStatus === "Completed" ? order.updatedAt : null,
        contractValue: order.totalAmount,
        terms: "Standard prefab construction terms...",
        deliveryAddress: "See Details",
        paymentTerms: order.paymentInfo?.paymentMethod ?? "N/A",
        warrantyPeriod: "2 years",
      };
    });
  }, [ordersData]);

  const filteredContracts = useMemo(() => {
    // ... (filtering logic remains unchanged)
    return contracts.filter((contract) => {
      const customerName = contract.customerName || "";
      const orderId = contract.orderId || "";
      const productName = contract.productName || "";
      const lowerSearchTerm = searchTerm.toLowerCase();

      const matchesSearch =
        customerName.toLowerCase().includes(lowerSearchTerm) ||
        orderId.toLowerCase().includes(lowerSearchTerm) ||
        productName.toLowerCase().includes(lowerSearchTerm) ||
        contract.id.toLowerCase().includes(lowerSearchTerm);

      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      // ... (stats logic remains unchanged)
      total: contracts.length,
      completed: contracts.filter((c) => c.status === "Completed").length,
      pending: contracts.filter(
        (c) => c.status === "Pending" || c.status === "Ready for Delivery"
      ).length,
      cancelled: contracts.filter((c) => c.status === "Cancelled").length,
    }),
    [contracts]
  );

  // --- All Helper & Handler Functions remain in the parent ---

  const getStatusIcon = (status: string): JSX.Element => {
    // ... (logic remains unchanged)
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

  const getStatusColor = (status: string): string => {
    // ... (logic remains unchanged)
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

  const formatCurrency = (amount: number): string => {
    // ... (logic remains unchanged)
    return formatPrice(amount);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    // ... (logic remains unchanged)
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownloadPDF = async (orderToPrint: Order) => {
    // ... (all PDF logic remains unchanged in the parent)
    if (!orderToPrint) return;

    const toastId = toast.loading("Generating PDF... Please wait");
    let tempContainer: HTMLDivElement | null = null;

    try {
      tempContainer = document.createElement("div");
      tempContainer.id = `pdf-temp-container-${Date.now()}`;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "8.5in";
      tempContainer.style.background = "white";
      tempContainer.style.padding = "0";
      tempContainer.style.boxSizing = "border-box";
      tempContainer.style.margin = "0";

      const style = document.createElement("style");
      // --- UPDATE THE INJECTED STYLES ---
      style.textContent = `
              /* Good for browser printing, but html2canvas ignores it */
              @media print { .pdf-page-break { page-break-before: always !important; } }
              
              /* Ensures our spacer div takes up no space by default */
              .pdf-page-break { height: 0; display: block; }

              #formal-contract-content { background-color: white !important; color: black !important; line-height: 1.4 !important; }
              #formal-contract-content table { border-collapse: collapse !important; width: 100% !important; border: 1px solid black !important; margin-bottom: 0.75rem !important; }
              #formal-contract-content th, #formal-contract-content td { border: 1px solid black !important; padding: 5px 7px !important; vertical-align: top !important; text-align: left !important; word-wrap: break-word !important; }
              #formal-contract-content th { background-color: #dbeafe !important; font-weight: bold !important; text-align: center !important; }
              #formal-contract-content td img { max-width: 100% !important; height: auto !important; display: block !important; margin: auto !important; }
              body { margin: 0 !important; }
            `;
      tempContainer.appendChild(style);
      document.body.appendChild(tempContainer);

      const root = ReactDOM.createRoot(tempContainer);

      await new Promise<void>((resolve) => {
        root.render(<FormalContractDocument order={orderToPrint} />);
        setTimeout(resolve, 2000); // Give images time to load
      });

      const elementToCapture = tempContainer.querySelector(
        "#formal-contract-content"
      ) as HTMLElement;

      if (!elementToCapture) {
        throw new Error("Could not find #formal-contract-content element.");
      }
      // --- START: UPDATED PDF DIMENSIONS (8.5in x 13in) ---
      const pageFormat: [number, number] = [13, 8.5]; // [height, width] in inches
      const pdf = new jsPDF("p", "in", pageFormat); // units are "in"
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 8.5
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 13
      const marginIn = 0.5; // 0.5 inch margin
      const contentWidth = pdfWidth - marginIn * 2; // 7.5 in
      const contentHeight = pdfHeight - marginIn * 2; // 12 in // --- END: UPDATED PDF DIMENSIONS --- // --- START: UPDATED PAGE BREAK LOGIC (using INCHES) --- // Calculate pixel-to-inch ratio from the rendered element // elementToCapture.scrollWidth should be 8.5in
      const inchToPx = elementToCapture.scrollWidth / 8.5;
      const pageHeightPx = contentHeight * inchToPx; // 12 * inchToPx

      const breakMarkers = elementToCapture.querySelectorAll(
        ".pdf-page-break"
      ) as NodeListOf<HTMLElement>; // Loop through all markers and add height to push content

      breakMarkers.forEach((marker) => {
        const markerTop = marker.offsetTop;
        const currentPage = Math.floor(markerTop / pageHeightPx);
        const nextPageTop = (currentPage + 1) * pageHeightPx;
        const requiredPadding = nextPageTop - markerTop;

        if (requiredPadding > 0) {
          marker.style.height = `${requiredPadding}px`;
        }
      }); // --- END: UPDATED PAGE BREAK LOGIC ---
      const canvas = await html2canvas(elementToCapture, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: elementToCapture.scrollWidth,
        height: elementToCapture.scrollHeight,
        windowWidth: elementToCapture.scrollWidth,
        windowHeight: elementToCapture.scrollHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 0,
      });

      // --- START: UPDATED PDF SLICING (using INCHES) ---
      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = contentWidth; // 7.5 in
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = marginIn; // Start at 0.5in margin

      pdf.addImage(
        imgData,
        "PNG",
        marginIn, // 0.5in
        position, // 0.5in
        imgWidth, // 7.5in
        imgHeight,
        undefined,
        "SLOW"
      );
      heightLeft -= contentHeight; // 12in

      while (heightLeft > 0) {
        position = position - contentHeight; // 12in
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          marginIn, // 0.5in
          position,
          imgWidth, // 7.5in
          imgHeight,
          undefined,
          "SLOW"
        );
        heightLeft -= contentHeight; // 12in
      } // --- END: UPDATED PDF SLICING ---
      root.unmount();
      document.body.removeChild(tempContainer);
      tempContainer = null;

      const quoteNumber = `RB-2024-${orderToPrint._id.slice(-6)}`;
      pdf.save(`Contract_${quoteNumber}.pdf`);
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(`Failed to generate PDF: ${(error as Error).message}`, {
        id: toastId,
      });

      if (tempContainer && document.body.contains(tempContainer)) {
        try {
          ReactDOM.createRoot(tempContainer).unmount();
        } catch (e) {}
        document.body.removeChild(tempContainer);
      }
    }
  };

  const handleViewContract = (contractOrder: Order) => {
    // ... (logic remains unchanged)
    console.log("View Contract for Order:", contractOrder._id);
    toast.info(`Implement view for order ${contractOrder._id.slice(-6)}`);
  };

  const handleGenerateFormalDocument = (contractOrder: Order) => {
    // ... (logic remains unchanged)
    setSelectedContract(contractOrder);
    setIsFormalDocumentOpen(true);
  };

  // --- Loading / Error States ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading contracts...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 p-6 rounded-lg border border-red-200">
        <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-700 font-semibold">Failed to load contracts</p>
        <p className="text-red-600 text-sm mt-1">
          {(error as Error)?.message || "An unknown error occurred."}
        </p>
      </div>
    );
  }

  // --- New, Cleaner Render Block ---

  // --- Updated Render Block ---

  return (
    <div className="space-y-6 p-4  bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-gray-600">
            View, manage and download customer contracts based on orders
          </p>
        </div>
      </div>
      <hr className="border-t border-gray-200" />

      <ContractStats stats={stats} />

      <ContractFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode} // Pass state down
        onViewModeChange={setViewMode} // Pass handler down
      />

      {/* --- CONDITIONAL VIEW RENDER --- */}
      {viewMode === "table" ? (
        <ContractTable
          filteredContracts={filteredContracts}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusIcon={getStatusIcon}
          getStatusColor={getStatusColor}
          handleViewContract={handleViewContract}
          handleGenerateFormalDocument={handleGenerateFormalDocument}
          handleDownloadPDF={handleDownloadPDF}
        />
      ) : (
        <ContractCardView
          filteredContracts={filteredContracts}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusIcon={getStatusIcon}
          getStatusColor={getStatusColor}
          handleViewContract={handleViewContract}
          handleGenerateFormalDocument={handleGenerateFormalDocument}
          handleDownloadPDF={handleDownloadPDF}
        />
      )}

      <Dialog
        open={isFormalDocumentOpen}
        onOpenChange={setIsFormalDocumentOpen}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Formal Contract Document - Order
              #{selectedContract?._id.slice(-6)}
            </DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <FormalContractDocument order={selectedContract} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
