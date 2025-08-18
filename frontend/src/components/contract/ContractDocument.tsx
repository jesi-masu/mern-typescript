
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Signature } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SignaturePad from "@/components/contract/SignaturePad";

interface ContractDocumentProps {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  productInfo: {
    id: number;
    name: string;
    price: number;
    squareFeet: number;
    features?: string[];
    specifications?: Record<string, string>;
    inclusion?: string[];
    leadTime?: string;
  };
  orderId: string;
}

const ContractDocument: React.FC<ContractDocumentProps> = ({ customerInfo, productInfo, orderId }) => {
  const [preparedBySignature, setPreparedBySignature] = useState<string>('');
  const [approvedBySignature, setApprovedBySignature] = useState<string>('');
  const [customerSignature, setCustomerSignature] = useState<string>('');
  const contractRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 2
    }).format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-PH');
  const quoteNumber = `RB-2024-${orderId}`;

  // Generate itemized quote data based on product
  const quoteItems = [
    {
      qty: 1,
      unit: 'unit',
      item: 'Container House',
      description: `Dimension: L${productInfo.squareFeet}sqm | Inclusion: 1 Door, 2 Windows, Floor (uses Cement Board Flooring), and Wall uses PVC insulated walls`,
      unitPrice: productInfo.price * 0.7,
      amount: productInfo.price * 0.7
    },
    {
      qty: 1,
      unit: 'unit',
      item: 'Extra Roofing',
      description: 'Roof Deck Roofing (Embossed Roof)',
      unitPrice: productInfo.price * 0.15,
      amount: productInfo.price * 0.15
    },
    {
      qty: 1,
      unit: 'unit',
      item: 'Roof deck',
      description: `Dimension: L${productInfo.squareFeet}sqm with railings and flooring`,
      unitPrice: productInfo.price * 0.1,
      amount: productInfo.price * 0.1
    },
    {
      qty: 1,
      unit: 'unit',
      item: 'Stairs',
      description: 'Inclusion: 1 side railings',
      unitPrice: productInfo.price * 0.05,
      amount: productInfo.price * 0.05
    },
    {
      qty: 1,
      unit: 'unit',
      item: 'Partition',
      description: 'Sandwich panel',
      unitPrice: 0,
      amount: 0
    },
    {
      qty: 1,
      unit: 'lot',
      item: 'Delivery',
      description: 'FREE DELIVERY',
      unitPrice: 0,
      amount: 0
    }
  ];

  const subtotal = quoteItems.reduce((sum, item) => sum + item.amount, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div ref={contractRef} className="print:p-8">
        {/* Company Header */}
        <div className="text-center mb-8 border-b-2 border-blue-500 pb-6">
          <div className="grid grid-cols-3 items-center mb-4">
            <div className="flex items-center justify-start">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                CAMCO
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-600">CAMCO MEGA SALES CORP.</h1>
              <p className="text-lg font-semibold text-gray-700">PREFAB CONTAINER AND CAMHOUSE</p>
              <p className="text-sm text-gray-600">0997-951-7188 | camco.prefab3@gmail.com</p>
              <p className="text-sm text-gray-600">Masterson Ave., Upper Balulang, Cagayan de Oro City</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-700 italic">Quotation</h2>
              <div className="text-sm">
                <p><strong>Quote #:</strong> {quoteNumber}</p>
                <p><strong>Date:</strong> {currentDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-6 text-sm">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p><strong>Name:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
              <p><strong>Address:</strong> {customerInfo.address}, {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
              <p><strong>Contact Num:</strong> {customerInfo.phone}</p>
              <p><strong>Email add:</strong> {customerInfo.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <p><strong>To our valued client:</strong></p>
            <p>We are pleased to present and offer you the following products and services:</p>
          </div>
        </div>

        {/* Itemized Quotation Table */}
        <div className="mb-8">
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-blue-100">
                <TableHead className="border text-center font-bold">Qty</TableHead>
                <TableHead className="border text-center font-bold">Unit</TableHead>
                <TableHead className="border text-center font-bold">Items</TableHead>
                <TableHead className="border text-center font-bold">Description</TableHead>
                <TableHead className="border text-center font-bold">Images</TableHead>
                <TableHead className="border text-center font-bold">Unit Price</TableHead>
                <TableHead className="border text-center font-bold">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quoteItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="border text-center">{item.qty}</TableCell>
                  <TableCell className="border text-center">{item.unit}</TableCell>
                  <TableCell className="border">{item.item}</TableCell>
                  <TableCell className="border text-sm">{item.description}</TableCell>
                  <TableCell className="border text-center">
                    <div className="w-16 h-12 bg-gray-100 border rounded flex items-center justify-center text-xs">
                      Image
                    </div>
                  </TableCell>
                  <TableCell className="border text-right">
                    {item.unitPrice > 0 ? formatPrice(item.unitPrice) : 'FREE'}
                  </TableCell>
                  <TableCell className="border text-right font-semibold">
                    {item.amount > 0 ? formatPrice(item.amount) : 'FREE'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-8 mt-4">
            <div>
              <Card>
                <CardHeader className="bg-blue-100 py-2">
                  <CardTitle className="text-sm">Payment Terms</CardTitle>
                </CardHeader>
                <CardContent className="py-2 text-xs">
                  <p>50% Down Payment</p>
                  <p>40% Before Delivery</p>
                  <p>10% Upon Completion</p>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="bg-blue-100 py-2">
                  <CardTitle className="text-sm">Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="py-2 text-xs">
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
                  <span className="font-bold">{formatPrice(discount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span><strong>Total:</strong></span>
                  <span className="font-bold text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-100">
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p><strong>Project Location:</strong> {customerInfo.address}, {customerInfo.city}</p>
                <p><strong>Project Notes:</strong> Custom prefab container house</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inclusion/Exclusion */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700">Inclusion:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                <li>• Supply and Delivery of Materials</li>
                <li>• Installation of Container House</li>
                <li>• Roofing for Roof Deck</li>
                <li>• Roof Deck and Stairs</li>
                <li>• Partition with Door (Ground floor from storage to display unit)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700">Exclusion:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                <li>• Land Preparation</li>
                <li>• Masonry Works (Pedestal/Slab)</li>
                <li>• Electrical Wiring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-100">
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ol className="space-y-1">
              <li>1.) Price is EXCLUSIVE of VAT</li>
              <li>2.) Deliveries within the city proper of Cagayan de Oro is free of charge.</li>
              <li>3.) In case of installation on site, buyer must provide accommodation and meals for installers.</li>
              <li>4.) This Quotation is valid until 3 months from the date issued above.</li>
            </ol>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mb-6 text-sm">
          <p>We are looking forward to hear from you soon.</p>
          <p>If you have any questions or clarifications concerning with this quotation, please contact Rolan Bagares at 0997-951-7188 or e-mail us at camco.prefab3@gmail.com</p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="mb-4">
              <Label className="font-semibold">Prepared by:</Label>
            </div>
            <div className="h-20 border-b-2 border-gray-300 flex items-end justify-center mb-2">
              {preparedBySignature ? (
                <img src={preparedBySignature} alt="Prepared by signature" className="max-h-16" />
              ) : (
                <span className="text-gray-400 text-xs mb-2">Digital Signature</span>
              )}
            </div>
            <div>
              <p className="font-semibold">Rolan Bagares</p>
              <p className="text-sm">Sales and Marketing Manager</p>
              <p className="text-sm">0997-951-7188</p>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-4">
              <Label className="font-semibold">Approved by:</Label>
            </div>
            <div className="h-20 border-b-2 border-gray-300 flex items-end justify-center mb-2">
              {approvedBySignature ? (
                <img src={approvedBySignature} alt="Approved by signature" className="max-h-16" />
              ) : (
                <span className="text-gray-400 text-xs mb-2">Digital Signature</span>
              )}
            </div>
            <div>
              <p className="font-semibold">Stephanie Claire Edillio</p>
              <p className="text-sm">General Manager</p>
              <p className="text-sm">0905-794-6233</p>
            </div>
          </div>
        </div>

        {/* Customer Agreement */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>CONFORME:</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              I, the undersigned, hereby agree to proceed with this project in accordance with all requirements and specifics by signing this quotation.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="h-20 border-b-2 border-gray-300 flex items-end justify-center mb-2">
                  {customerSignature ? (
                    <img src={customerSignature} alt="Customer signature" className="max-h-16" />
                  ) : (
                    <span className="text-gray-400 text-xs mb-2">Customer Digital Signature</span>
                  )}
                </div>
                <p className="text-center">Signature above Printed Name</p>
                <p className="text-center mt-2">Date: ___/___/2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thank You */}
        <div className="text-center text-lg font-bold">
          <p>THANK YOU FOR YOUR BUSINESS!</p>
        </div>
      </div>

      {/* Action Buttons - Hidden in print */}
      <div className="flex gap-4 justify-center print:hidden mt-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Signature className="h-4 w-4" />
              Add Digital Signatures
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Digital Signatures</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label className="font-semibold">Prepared By Signature</Label>
                <SignaturePad onSave={setPreparedBySignature} />
              </div>
              <div>
                <Label className="font-semibold">Approved By Signature</Label>
                <SignaturePad onSave={setApprovedBySignature} />
              </div>
              <div>
                <Label className="font-semibold">Customer Signature</Label>
                <SignaturePad onSave={setCustomerSignature} />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4" />
          Print Contract
        </Button>
      </div>
    </div>
  );
};

export default ContractDocument;
