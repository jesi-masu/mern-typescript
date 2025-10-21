import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Printer,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Edit,
  Eye,
} from "lucide-react";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { toast } from "sonner";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table as DocxTable,
  TableRow as DocxTableRow,
  TableCell as DocxTableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import ContractEditor from "@/components/admin/ContractEditor";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client";
import FormalContractDocument from "@/components/contract/FormalContractDocument";
const ContractDetail = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState("");

  // Find the contract based on the ID
  const contract = React.useMemo(() => {
    const order = orders.find((o) => `contract-${o.id}` === contractId);
    if (!order) return null;
    return {
      id: `contract-${order.id}`,
      orderId: order.id,
      customerName: order.customerName || "Unknown Customer",
      customerEmail: order.customerEmail || "No email provided",
      customerPhone: "0997-951-7188",
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
      deliveryAddress:
        "Customer specified location - Cagayan de Oro City, Philippines",
      paymentTerms: "50% Down payment, 40% Before Delivery 10% Upon Completion",
      warrantyPeriod: "2 years structural warranty",
      products: order.products || [],
      inclusions: [
        "Complete prefab container house structure",
        "Standard electrical wiring and fixtures",
        "Basic plumbing installation",
        "Standard doors and windows",
        "Interior finishing (basic level)",
        "Delivery and installation within city limits",
        "2-year structural warranty",
      ],
      exclusions: [
        "Site preparation and foundation work",
        "Electrical connection to main grid",
        "Water connection to main supply",
        "Permits and licenses",
        "Additional customizations beyond standard",
        "Maintenance after warranty period",
        "Transportation costs beyond 50km radius",
      ],
    };
  }, [contractId]);
  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Contract Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            The contract you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/contracts")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contracts
          </Button>
        </div>
      </div>
    );
  }
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

  // Initialize edited content by rendering FormalContractDocument
  React.useEffect(() => {
    if (!editedContent && contract) {
      // Create a temporary container to render the FormalContractDocument
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "896px";
      tempContainer.style.background = "white";
      document.body.appendChild(tempContainer);

      // Render the FormalContractDocument component
      const root = ReactDOM.createRoot(tempContainer);

      root.render(
        <div id="temp-formal-contract">
          <FormalContractDocument contract={contract} />
        </div>
      );

      // Wait for render to complete, then extract HTML
      setTimeout(() => {
        const element = tempContainer.querySelector(
          "#formal-contract-content"
        ) as HTMLElement;
        if (element) {
          // Remove the download button from the content
          const clonedElement = element.cloneNode(true) as HTMLElement;
          const buttons = clonedElement.querySelectorAll(".no-print, button");
          buttons.forEach((btn) => btn.remove());

          setEditedContent(clonedElement.innerHTML);
        }
        root.unmount();
        document.body.removeChild(tempContainer);
      }, 500);
    }
  }, [contract, editedContent]);
  const handleDownloadDocx = async () => {
    try {
      // Check if content is loaded
      if (!editedContent || editedContent.trim() === "") {
        toast.error(
          "Contract content is still loading. Please wait a moment and try again."
        );
        return;
      }

      toast.info("Generating Word document... Please wait");

      const quoteNumber = `RB-2024-${contract.orderId}`;

      // Use the edited content from ContractEditor
      const contentToExport = editedContent;

      // Create a complete HTML document that Word can open
      const fullHtml = `
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Contract ${quoteNumber}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page { size: A4; margin: 20mm; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20mm; background: white; width: 210mm; }
            
            /* Layout */
            .max-w-4xl { max-width: 100%; margin: 0 auto; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .p-8 { padding: 2rem; }
            .p-6 { padding: 1.5rem; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
            
            /* Colors */
            .bg-white { background-color: white; }
            .bg-blue-700 { background-color: #1d4ed8; color: white; padding: 1.5rem; }
            .bg-blue-100 { background-color: #dbeafe; }
            .text-white { color: white; }
            .text-blue-700 { color: #1d4ed8; }
            .text-blue-600 { color: #2563eb; }
            .text-green-700 { color: #15803d; }
            .text-green-600 { color: #16a34a; }
            .text-orange-700 { color: #c2410c; }
            .text-orange-600 { color: #ea580c; }
            
            /* Typography */
            .text-2xl { font-size: 1.5rem; line-height: 2rem; font-weight: 700; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; font-weight: 600; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-xs { font-size: 0.75rem; line-height: 1rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .italic { font-style: italic; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .whitespace-pre-line { white-space: pre-line; }
            
            /* Spacing */
            .mt-2 { margin-top: 0.5rem; }
            .mt-3 { margin-top: 0.75rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-8 { margin-top: 2rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mr-2 { margin-right: 0.5rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .space-y-3 > * + * { margin-top: 0.75rem; }
            .gap-2 { gap: 0.5rem; }
            .gap-6 { gap: 1.5rem; }
            .gap-8 { gap: 2rem; }
            
            /* Flexbox */
            .flex { display: flex; }
            .items-start { align-items: flex-start; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .justify-center { justify-content: center; }
            
            /* Grid - Two Column Layout */
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: 1fr; }
            .grid-cols-2, .md\\:grid-cols-2 { grid-template-columns: 1fr 1fr; }
            
            /* Borders */
            .border { border: 1px solid #e5e7eb; }
            .border-b-2 { border-bottom-width: 2px; border-bottom-color: #1d4ed8; }
            .border-blue-700 { border-color: #1d4ed8; }
            .border-gray-400 { border-color: #9ca3af; }
            .rounded { border-radius: 0.25rem; }
            .pb-2 { padding-bottom: 0.5rem; }
            .pt-6 { padding-top: 1.5rem; }
            .border-t { border-top-width: 1px; }
            
            /* Tables - Standard HTML tables */
            table { width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #000 !important; }
            th, td { border: 1px solid #000 !important; padding: 0.75rem; font-size: 0.875rem; vertical-align: top; }
            th { background-color: #dbeafe; font-weight: 700; text-align: center; }
            tbody tr:nth-child(even) { background-color: #f9fafb; }
            
            /* Shadcn/UI Table Components - Force table display */
            [role="table"] { display: table !important; width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #000 !important; }
            [role="rowgroup"] { display: table-row-group !important; }
            [role="row"] { display: table-row !important; }
            [role="columnheader"] { display: table-cell !important; border: 1px solid #000 !important; padding: 0.75rem; font-size: 0.875rem; background-color: #dbeafe; font-weight: 700; text-align: center; }
            [role="cell"] { display: table-cell !important; border: 1px solid #000 !important; padding: 0.75rem; font-size: 0.875rem; vertical-align: top; }
            
            /* Additional table styling */
            .border { border: 1px solid #000 !important; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            
            /* Cards */
            .card { border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; margin-bottom: 1rem; }
            .card-header { background-color: #1d4ed8; color: white; padding: 0.5rem 1rem; }
            .card-content { padding: 0.75rem 1rem; }
            .card-title { font-size: 0.875rem; font-weight: 600; }
            
            /* Special Boxes */
            .inclusion-box { 
              background-color: #dcfce7; 
              border-left: 4px solid #22c55e; 
              padding: 1rem; 
              margin: 0.75rem 0; 
              border-radius: 0.25rem;
            }
            .exclusion-box { 
              background-color: #fef3c7; 
              border-left: 4px solid #f59e0b; 
              padding: 1rem; 
              margin: 0.75rem 0; 
              border-radius: 0.25rem;
            }
            .signature-box { 
              border: 2px dashed #9ca3af; 
              padding: 1.25rem; 
              text-align: center; 
              margin: 1rem 0; 
              border-radius: 0.25rem;
            }
            .conforme-box { 
              border: 2px dashed #9ca3af; 
              padding: 1.25rem; 
              margin: 1.25rem 0; 
              border-radius: 0.25rem;
            }
            
            /* Sections */
            .notes-section { margin: 1.5rem 0; }
            .agreement-section { margin: 2rem 0; }
            .page-break { page-break-before: always; }
            
            /* Heights */
            .h-12 { height: 3rem; }
            .h-16 { height: 4rem; border-bottom: 2px solid #9ca3af; }
            .h-20 { height: 5rem; border-bottom: 2px solid #9ca3af; }
            .w-16 { width: 4rem; }
            
            /* Image placeholders */
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-gray-200 { background-color: #e5e7eb; }
            
            /* Card components */
            .rounded-lg { border-radius: 0.5rem; }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
            
            /* Separator */
            .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
            .h-px { height: 1px; }
            
            /* Hide elements */
            .no-print { display: none !important; }
            
            /* Lists */
            ul { list-style-type: disc; padding-left: 1.5rem; }
            li { margin: 0.5rem 0; }
            
            /* Headings */
            h1 { color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 0.5em; font-weight: 700; font-size: 1.5rem; margin: 1.5em 0 0.5em 0; }
            h2 { color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 0.3em; font-weight: 700; font-size: 1.25rem; margin: 1.5em 0 0.5em 0; }
            h3 { color: #1d4ed8; font-weight: 600; font-size: 1.125rem; margin: 1.2em 0 0.5em 0; }
            p { margin: 0.5em 0; line-height: 1.6; }
            strong { font-weight: 700; }
          </style>
        </head>
        <body>
          ${contentToExport}
        </body>
        </html>
      `;

      // Create a Blob with the HTML content
      const blob = new Blob([fullHtml], {
        type: "application/vnd.ms-word;charset=utf-8",
      });

      // Download the file
      saveAs(blob, `Contract_${quoteNumber}.doc`);
      toast.success(
        "Word document downloaded successfully! You can edit it in Microsoft Word."
      );
    } catch (error) {
      console.error("Error generating Word document:", error);
      toast.error("Failed to generate Word document. Please try again.");
    }
  };
  const handlePrint = () => {
    if (!editedContent || editedContent.trim() === "") {
      toast.error(
        "No contract content to print. Please wait for the content to load."
      );
      return;
    }

    // Create a hidden iframe for printing
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentWindow?.document;
    if (!printDocument) {
      toast.error("Failed to open print dialog");
      document.body.removeChild(printFrame);
      return;
    }

    // Write the contract content with proper styling
    printDocument.open();
    printDocument.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Contract ${contract.orderId}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20mm; 
            background: white; 
            width: 210mm;
            font-size: 11pt;
            line-height: 1.6;
            color: #000;
          }
          
          /* Typography */
          h1 { 
            color: #1d4ed8; 
            border-bottom: 2px solid #1d4ed8; 
            padding-bottom: 0.5em; 
            font-weight: 700; 
            font-size: 1.5rem; 
            margin: 1.5em 0 0.5em 0; 
          }
          h2 { 
            color: #1d4ed8; 
            border-bottom: 2px solid #1d4ed8; 
            padding-bottom: 0.3em; 
            font-weight: 700; 
            font-size: 1.25rem; 
            margin: 1.5em 0 0.5em 0; 
          }
          h3 { 
            color: #1d4ed8; 
            font-weight: 600; 
            font-size: 1.125rem; 
            margin: 1.2em 0 0.5em 0; 
          }
          p { margin: 0.5em 0; line-height: 1.6; }
          strong { font-weight: 700; }
          
          /* Layout */
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-start { align-items: flex-start; }
          .items-center { align-items: center; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: 1fr 1fr; }
          .gap-2 { gap: 0.5rem; }
          .gap-6 { gap: 1.5rem; }
          
          /* Spacing */
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-3 { margin-bottom: 0.75rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-8 { margin-bottom: 2rem; }
          .mt-2 { margin-top: 0.5rem; }
          .mt-3 { margin-top: 0.75rem; }
          .mt-4 { margin-top: 1rem; }
          .mt-8 { margin-top: 2rem; }
          .p-6 { padding: 1.5rem; }
          .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
          .pb-2 { padding-bottom: 0.5rem; }
          
          /* Colors & Backgrounds */
          .bg-blue-700 { background-color: #1d4ed8; color: white; padding: 1.5rem; text-align: center; }
          .bg-blue-100 { background-color: #dbeafe; }
          .text-white { color: white; }
          .text-blue-700 { color: #1d4ed8; }
          .text-green-700 { color: #15803d; }
          .text-orange-700 { color: #c2410c; }
          .text-2xl { font-size: 1.5rem; font-weight: 700; }
          .text-lg { font-size: 1.125rem; font-weight: 600; }
          .text-sm { font-size: 0.875rem; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .italic { font-style: italic; }
          
          /* Borders */
          .border { border: 1px solid #e5e7eb; }
          .border-b-2 { border-bottom: 2px solid #1d4ed8; padding-bottom: 0.5rem; }
          .rounded { border-radius: 0.25rem; }
          .rounded-lg { border-radius: 0.5rem; }
          
          /* Tables - Standard HTML tables */
          table { width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #000 !important; }
          th, td { border: 1px solid #000 !important; padding: 0.75rem; font-size: 0.875rem; vertical-align: top; }
          th { background-color: #dbeafe; font-weight: 700; text-align: center; }
          tbody tr:nth-child(even) { background-color: #f9fafb; }
          
          /* Shadcn/UI Table Components - Force table display */
          [role="table"] { display: table !important; width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #000 !important; }
          [role="rowgroup"] { display: table-row-group !important; }
          [role="row"] { display: table-row !important; }
          [role="columnheader"] { display: table-cell !important; border: 1px solid #000 !important; padding: 0.75rem; font-size: 0.875rem; background-color: #dbeafe; font-weight: 700; text-align: center; }
          [role="cell"] { display: table-cell !important; border: 1px solid #000 !important; padding: 0.75rem; font-size: 0.875rem; vertical-align: top; }
          
          /* Special Boxes */
          .inclusion-box { 
            background-color: #dcfce7; 
            border-left: 4px solid #22c55e; 
            padding: 1rem; 
            margin: 0.75rem 0; 
            border-radius: 0.25rem; 
          }
          .exclusion-box { 
            background-color: #fef3c7; 
            border-left: 4px solid #f59e0b; 
            padding: 1rem; 
            margin: 0.75rem 0; 
            border-radius: 0.25rem; 
          }
          .signature-box { 
            border: 2px dashed #9ca3af; 
            padding: 1.25rem; 
            text-align: center; 
            margin: 1rem 0; 
            border-radius: 0.25rem; 
          }
          
          /* Page Break */
          .page-break { 
            page-break-before: always; 
            margin-top: 2rem; 
            padding-top: 2rem; 
            border-top: 2px dashed #cbd5e1; 
          }
          
          /* Lists */
          ul, ol { margin: 0.8em 0; padding-left: 2em; }
          li { margin: 0.5em 0; }
          
          /* Print specific */
          @media print {
            body { margin: 0; padding: 20mm; }
            .page-break { page-break-before: always; }
            h1, h2, h3 { page-break-after: avoid; }
            table { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${editedContent}
      </body>
      </html>
    `);
    printDocument.close();

    // Wait for content to load, then print
    printFrame.contentWindow?.focus();
    setTimeout(() => {
      printFrame.contentWindow?.print();

      // Clean up after printing
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 100);

      toast.success("Print dialog opened");
    }, 250);
  };

  const handleSaveTemplate = (content: string) => {
    setEditedContent(content);
    // Keep user in edit mode after saving
    // setIsEditMode(false); // Removed - user stays in editor
  };

  const handleToggleEditMode = () => {
    // Content is now loaded automatically via useEffect
    setIsEditMode(!isEditMode);
  };
  const orderItems = contract.products.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      name: product?.name || "Unknown Product",
      description: product?.description || "No description available",
      quantity: item.quantity || 1,
      price: product?.price || 0,
    };
  });
  const totalValue = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // If in edit mode, show the editor
  if (isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/contracts")}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contracts
            </Button>
          </div>
          <ContractEditor
            contract={contract}
            initialContent={editedContent}
            onSave={handleSaveTemplate}
            onCancel={() => setIsEditMode(false)}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/contracts")}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contracts
            </Button>

            <div className="flex gap-3">
              <Button
                variant={isEditMode ? "default" : "outline"}
                onClick={handleToggleEditMode}
                className="shadow-sm"
              >
                {isEditMode ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Contract
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadDocx}
                className="shadow-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Word
              </Button>

              <Button
                variant="outline"
                onClick={handlePrint}
                className="shadow-sm"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{contract.id}</h1>
            <p className="text-xl text-muted-foreground">
              Order Reference: #{contract.orderId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Client & Status Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Client Information */}
            <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">
                    {contract.customerName}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{contract.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{contract.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="leading-relaxed">
                      {contract.deliveryAddress}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status & Finance */}
            <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Status & Finance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Order Status
                  </p>
                  <Badge
                    className={`${getStatusColor(
                      contract.status
                    )} text-sm py-1 px-3`}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(contract.status)}
                      {contract.status}
                    </div>
                  </Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Contract Value
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(contract.contractValue)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Payment Terms
                  </p>
                  <p className="text-sm">{contract.paymentTerms}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Contract Date
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(contract.createdAt)}
                  </p>
                  {contract.signedAt && (
                    <>
                      <p className="text-sm font-medium text-muted-foreground mb-1 mt-3">
                        Signed Date
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatDate(contract.signedAt)}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-8">
            {/* Order Details */}
            <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">
                          Item Name / Description
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                          Quantity
                        </TableHead>
                        <TableHead className="font-semibold text-right">
                          Price
                        </TableHead>
                        <TableHead className="font-semibold text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/30 border-t-2">
                        <TableCell
                          colSpan={3}
                          className="font-semibold text-right"
                        >
                          Total Contract Value:
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg text-primary">
                          {formatCurrency(totalValue)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Contract Scope */}
            <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Contract Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Inclusions */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-green-700">
                      Inclusions
                    </h3>
                    <div className="space-y-3">
                      {contract.inclusions.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-red-700">
                      Exclusions
                    </h3>
                    <div className="space-y-3">
                      {contract.exclusions.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContractDetail;
