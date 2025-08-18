import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Check, X } from "lucide-react";
import { toast } from 'sonner';

interface ContractItem {
  qty: number;
  unit: string;
  items: string; // New field for items
  description: string;
  image: string;
  unitPrice: number;
  amount: number;
}

interface FormalContractDocumentProps {
  contract: {
    id: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    productName: string;
    contractValue: number;
    createdAt: string;
    deliveryAddress?: string;
  };
}

const FormalContractDocument: React.FC<FormalContractDocumentProps> = ({
  contract
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quoteNumber = `RB-2024-${contract.orderId}`;
  const currentDate = formatDate(contract.createdAt);

  // Generate contract items based on the product with Items column
  const contractItems: ContractItem[] = [{
    qty: 1,
    unit: 'unit',
    items: 'Container House Kit',
    description: 'Container House\nDimension: L5.95m x W3m x H2.8m\nInclusion: 1 Door, 2 Windows, Floor (uses Cement Board Flooring), and Wall uses PVC Insulated walls',
    image: 'Container House',
    unitPrice: 165000,
    amount: 165000
  }, {
    qty: 1,
    unit: 'unit',
    items: 'Duplex Container Kit',
    description: 'Duplex Container House\nDimension: L11.95m x W3m x H2.8m w/ 2 Doors & 4 Windows, Floor uses Cement Board Flooring, and Wall uses Sandwich Panel Board',
    image: 'Duplex Container',
    unitPrice: 350000,
    amount: 350000
  }, {
    qty: 1,
    unit: 'unit',
    items: 'Roofing Materials',
    description: 'Extra Roofing\nRoof Deck Roofing (Embossed Roof)',
    image: 'Roofing',
    unitPrice: 45000,
    amount: 45000
  }, {
    qty: 1,
    unit: 'unit',
    items: 'Roof Deck Kit',
    description: 'Roof Deck\nDimension: L5.95 x W3m 1 with railings and Roofing',
    image: 'Roof Deck',
    unitPrice: 60000,
    amount: 60000
  }, {
    qty: 1,
    unit: 'unit',
    items: 'Stair Kit',
    description: 'Stairs\nInclusion: 1 side railings',
    image: 'Stairs',
    unitPrice: 30000,
    amount: 30000
  }, {
    qty: 1,
    unit: 'unit',
    items: 'Partition Materials',
    description: 'Partition\nSandwich panel',
    image: 'Partition',
    unitPrice: 0,
    amount: 0
  }, {
    qty: 1,
    unit: 'lot',
    items: 'Delivery Service',
    description: 'Delivery\nFREE DELIVERY',
    image: 'Delivery',
    unitPrice: 0,
    amount: 0
  }];

  const selectedItem = contractItems[0];
  const subtotal = selectedItem.amount;
  const discount = 100000;
  const total = subtotal - discount;

  const handleDownloadPDF = () => {
    const printContent = document.getElementById('formal-contract-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Contract ${quoteNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { background: #1e40af; color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
                .company-name { font-size: 24px; font-weight: bold; }
                .company-subtitle { font-size: 16px; margin: 5px 0; }
                .contact-info { font-size: 12px; }
                .quote-info { text-align: right; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background: #f0f8ff; font-weight: bold; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .payment-terms { background: #f8f9fa; padding: 15px; margin: 20px 0; }
                .total-section { margin-top: 20px; }
                .signature-section { margin-top: 40px; }
                .page-break { page-break-before: always; }
                .inclusion-box { background: #e8f5e8; border-left: 4px solid #22c55e; padding: 15px; margin: 10px 0; }
                .exclusion-box { background: #fef3e8; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
                .notes-section { margin: 20px 0; }
                .agreement-section { margin: 30px 0; font-style: italic; }
                .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
                .signature-box { border: 2px dashed #6b7280; padding: 20px; text-align: center; }
                .conforme-box { border: 2px dashed #6b7280; padding: 20px; margin: 20px 0; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        toast.success('Contract document prepared for download');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div id="formal-contract-content" className="p-8">
        {/* Page 1 - Header */}
        <div className="bg-blue-700 text-white p-6 text-center mb-6">
          <h1 className="text-2xl font-bold">CAMCO MEGA SALES CORP.</h1>
          <p className="text-lg font-semibold mt-2">PREFAB CONTAINER AND CAMHOUSE</p>
          <div className="text-sm mt-3">
            <p>0997-951-7188 | camco.prefab3@gmail.com</p>
            <p>Masterson Ave., Upper Balulang, Cagayan de Oro City</p>
          </div>
        </div>

        {/* Quote Information */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700 italic">Quotation</h2>
          </div>
          <div className="text-right">
            <p><strong>Quote #:</strong> {quoteNumber}</p>
            <p><strong>Date:</strong> {currentDate}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <p><strong>Name:</strong> {contract.customerName}</p>
            <p><strong>Address:</strong> {contract.deliveryAddress || 'Customer Address'}</p>
            <p><strong>Contact Num:</strong> Contact Number</p>
            <p><strong>Email add:</strong> {contract.customerEmail}</p>
          </div>
          <div className="mt-4">
            <p><strong>To our valued client:</strong></p>
            <p>We are pleased to present and offer you the following products and services:</p>
          </div>
        </div>

        {/* Itemized Quotation Table */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Itemized Quotation</h3>
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-blue-100">
                <TableHead className="border text-center font-bold">QTY</TableHead>
                <TableHead className="border text-center font-bold">UNIT</TableHead>
                <TableHead className="border text-center font-bold">ITEMS</TableHead>
                <TableHead className="border text-center font-bold">DESCRIPTION</TableHead>
                <TableHead className="border text-center font-bold">IMAGE</TableHead>
                <TableHead className="border text-center font-bold">UNIT PRICE</TableHead>
                <TableHead className="border text-center font-bold">AMOUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="border text-center">{selectedItem.qty}</TableCell>
                <TableCell className="border text-center">{selectedItem.unit}</TableCell>
                <TableCell className="border text-center font-medium">{selectedItem.items}</TableCell>
                <TableCell className="border text-sm whitespace-pre-line">{selectedItem.description}</TableCell>
                <TableCell className="border text-center">
                  <div className="w-16 h-12 bg-gray-100 border rounded flex items-center justify-center text-xs mx-auto">
                    {selectedItem.image}
                  </div>
                </TableCell>
                <TableCell className="border text-right font-semibold">
                  {formatPrice(selectedItem.unitPrice)}
                </TableCell>
                <TableCell className="border text-right font-semibold">
                  {formatPrice(selectedItem.amount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Payment Terms and Total */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Card>
              <CardHeader className="bg-blue-700 text-white py-2">
                <CardTitle className="text-sm">Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="py-3 text-sm">
                <p>50% Down Payment</p>
                <p>40% Before Delivery</p>
                <p>10% Upon Completion</p>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader className="bg-blue-700 text-white py-2">
                <CardTitle className="text-sm">Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="py-3 text-sm">
                <p><strong>BDO:</strong> 00635-801-5757</p>
                <p>Camco Mega Sales Corp</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span><strong>Subtotal:</strong></span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Discount:</strong></span>
                <span className="font-bold text-green-600">{formatPrice(discount)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg">
                <span><strong>Total:</strong></span>
                <span className="font-bold text-blue-700">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mt-8">
          <div className="text-center">
            <p className="font-bold mb-4"></p>
          </div>
        </div>

        {/* Page 2 - Notes and Details */}
        <div className="page-break"></div>
        
        {/* Notes Section */}
        <div className="notes-section">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b-2 border-blue-700 pb-2">Notes</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Price is <strong className="text-blue-700">EXCLUSIVE</strong> of VAT</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Deliveries within the city proper of Cagayan de Oro is free of charge</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>In case of installation on site, buyer must provide accommodation and meals for installers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>This Quotation is valid until 3 months from the date issued above</span>
            </li>
          </ul>
        </div>

        {/* Project Details Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b-2 border-blue-700 pb-2">Project Details</h2>
          <div className="mb-4">
            <p className="text-blue-600 font-semibold">Project Location: Uptown Masterson Drive (Seaoil)</p>
          </div>
          <div className="mb-6">
            <p className="text-blue-600 font-semibold mb-2">Project Notes:</p>
          </div>

          {/* Inclusion/Exclusion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Inclusion Box */}
            <div className="inclusion-box">
              <div className="flex items-center mb-3">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-green-700 font-bold text-lg">INCLUSION</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Supply and Delivery of Materials</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Installation of Container House</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Roofing for Roof Deck</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Roof Deck and Stairs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Partition with Door (Ground floor from storage to display unit)</span>
                </li>
              </ul>
            </div>

            {/* Exclusion Box */}
            <div className="exclusion-box">
              <div className="flex items-center mb-3">
                <X className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-orange-700 font-bold text-lg">EXCLUSION</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Land Preparation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Masonry Works (Pedestal/Slab)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Electrical Wiring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="agreement-section">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b-2 border-blue-700 pb-2">Agreement</h2>
          <p className="text-sm mb-6 italic">
            I, the undersigned, hereby agree to proceed with this project in accordance with all requirements and specifics by signing this quotation.
          </p>

          {/* Company Representatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="signature-box">
              <p className="font-semibold text-center mb-4">Prepared by:</p>
              <div className="border-b-2 border-gray-400 h-16 mb-4"></div>
              <div className="text-center">
                <p className="font-bold text-blue-600">Rolan Bagares</p>
                <p className="text-sm">Sales and Marketing Manager</p>
                <p className="text-sm">0997-951-7188</p>
              </div>
            </div>

            <div className="signature-box">
              <p className="font-semibold text-center mb-4">Approved by:</p>
              <div className="border-b-2 border-gray-400 h-16 mb-4"></div>
              <div className="text-center">
                <p className="font-bold text-blue-600">Stephanie Claire Edillo</p>
                <p className="text-sm">General Manager</p>
                <p className="text-sm">0905-794-6233</p>
              </div>
            </div>
          </div>

          {/* Customer Signature */}
          <div className="conforme-box">
            <p className="font-bold text-blue-700 mb-4">CONFORME:</p>
            <div className="border-b-2 border-gray-400 h-20 mb-4"></div>
            <p className="text-sm font-semibold">Signature above Printed Name</p>
            <p className="text-sm mt-4">Date: ___/___/2025</p>
          </div>
        </div>

        {/* Final Thank You */}
        <div className="bg-blue-700 text-white text-center py-6 mt-8">
          <h2 className="text-2xl font-bold">THANK YOU FOR YOUR BUSINESS!</h2>
        </div>
      </div>

      {/* Action Buttons - Hidden in print */}
      <div className="flex gap-4 justify-center p-6 no-print">
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800">
          <Download className="h-4 w-4" />
          Download as PDF
        </Button>
      </div>
    </div>
  );
};

export default FormalContractDocument;