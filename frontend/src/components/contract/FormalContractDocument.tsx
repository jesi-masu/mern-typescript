// src/components/contract/FormalContractDocument.tsx

import React from "react";
import { Order, IProductPart, OrderProduct } from "@/types"; // Make sure your types are correctly imported
import { formatPrice } from "@/lib/formatters"; // Assuming you have this formatter

// --- UPDATED LOGO PATH ---
import Logo2 from "@/assets/logo2.png"; // Use the new logo path

interface FormalContractDocumentProps {
  order: Order; // Use the main Order type
}

const formatDate = (dateString: string | null | undefined): string => {
  // Ensure return type is string
  if (!dateString) return "N/A";
  // Use en-US for consistency, adjust locale if needed (e.g., 'en-PH')
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper to format the full address string, ensuring all parts exist
const formatFullDeliveryAddress = (
  address: Order["customerInfo"]["deliveryAddress"] | undefined
): string => {
  // Ensure return type is string
  if (!address) return "N/A";
  return [
    address.street,
    address.subdivision,
    address.cityMunicipality,
    address.province,
    address.postalCode,
    address.country, // Added country
  ]
    .filter(Boolean)
    .join(", "); // Filter out null/empty strings
};

const FormalContractDocument: React.FC<FormalContractDocumentProps> = ({
  order,
}) => {
  const quoteNumber = `RB-2024-${order._id.slice(-6)}`;

  // Static Data (Replace or fetch if dynamic)
  const notes = [
    "1.) Price is EXCLUSIVE of VAT",
    "2.) Deliveries within the city proper of Cagayan de Oro is free of charge",
    "3.) In case of installation on site, buyer must provide accommodation and meals for installers",
    "4.) This Quotation is valid until 3 months from the date issue above",
  ];
  const projectInclusions = [
    "Free shipping within 500 miles", // Example
    "Foundation preparation guide",
    "All necessary permits documentation",
    "Installation manual 5-year structural warranty",
  ];
  const projectExclusions = [
    "Land Preparation",
    "Electrical Wirings",
    "Masonry Works (Pedestal/Slabs)",
  ];
  const paymentTerms = [
    "50% Down Payment",
    "40% Before Delivery",
    "10% Upon Completion",
  ];
  const bankDetails = {
    bank: "BDO",
    accountNumber: "09635-801-5757", // Example Account Number
    accountName: "Camco Mega Sales Corp",
  };
  const preparedBy = { name: "Sales and Marketing", phone: "0997-951-7188" };
  const approvedBy = { name: "General Manager", phone: "0905-794-6233" };

  return (
    // Approximating 0.5 inch margin with p-3 (12px). Use style={{ padding: '12.7mm' }} for exactness if needed.
    // Use box-border to include padding in the element's total width/height.
    <div
      id="formal-contract-content"
      className="p-3 bg-white text-black text-xs font-sans w-[210mm] min-h-[297mm] mx-auto box-border leading-normal"
    >
      {/* 1. Header Section */}
      <div className="flex justify-between items-start mb-6">
        {/* Logo container */}
        <div className="w-24 h-16 flex items-center justify-center text-xs text-gray-500">
          {Logo2 ? (
            <img
              src={Logo2}
              alt="Company Logo"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            "Logo here"
          )}
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-blue-800">
            CAMCO MEGA SALES CORP.
          </h1>
          <p className="font-semibold text-blue-700">
            PREFAB CONTAINER AND CAMHOUSE
          </p>
          <p className="text-xs">0997-951-7188 | camco.prefab3@gmail.com</p>
          <p className="text-xs">
            Masterson Ave., Upper Balulang, Cagayan de Oro City
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold">Quotation</h2>
          <p className="text-xs">
            <strong>Quote #:</strong> {quoteNumber}
          </p>
          <p className="text-xs">
            <strong>Date:</strong> {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* 2. Client Details Section */}
      <div className="mb-4 text-xs">
        {/* Accessing nested delivery address safely */}
        <p>
          <strong>Name:</strong>{" "}
          {order.customerInfo?.deliveryAddress?.firstName ?? "N/A"}{" "}
          {order.customerInfo?.deliveryAddress?.lastName ?? ""}
        </p>
        <p>
          <strong>Phone Number:</strong>{" "}
          {order.customerInfo?.deliveryAddress?.phone ?? "N/A"}
        </p>
        <p>
          <strong>Delivery Location:</strong>{" "}
          {formatFullDeliveryAddress(order.customerInfo?.deliveryAddress)}
        </p>
        <p>
          <strong>Landmark/Notes:</strong>{" "}
          {order.customerInfo?.deliveryAddress?.additionalAddressLine || "N/A"}
        </p>
      </div>
      <p className="mb-4 text-xs">To our valued client,</p>
      <p className="mb-4 text-xs">
        We are pleased to present and offer you the following products and
        services
      </p>

      {/* 3. Ordered Products & Parts Table */}
      <div className="mb-4">
        {/* Increased table cell padding: p-2 */}
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-blue-200 text-black font-bold text-center">
              <th className="border border-black p-2">Qty</th>
              <th className="border border-black p-2">Unit</th>
              <th className="border border-black p-2">Items</th>
              <th className="border border-black p-2">Description</th>
              <th className="border border-black p-2">Images</th>
              <th className="border border-black p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item: OrderProduct, productIndex: number) => {
              const product = item.productId;
              const productParts = product?.productParts ?? [];
              const productAmount =
                (product?.productPrice ?? 0) * item.quantity;

              return (
                <React.Fragment key={`product-${productIndex}`}>
                  {/* Product Row */}
                  <tr className="bg-gray-100 text-black font-semibold">
                    <td
                      colSpan={6}
                      className="border border-black p-1 text-center"
                    >
                      Ordered Product #{productIndex + 1}
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td className="border border-black p-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-black p-2 text-center">
                      unit
                    </td>
                    <td className="border border-black p-2">
                      {product?.productName ?? "N/A"}
                    </td>
                    <td className="border border-black p-2">
                      {product?.productShortDescription ?? "N/A"}
                    </td>
                    <td className="border border-black p-2 text-center">
                      <img
                        src={product?.image || "https://placehold.co/60x40"}
                        alt={product?.productName ?? "Product"}
                        className="w-16 h-10 object-cover mx-auto"
                      />
                    </td>
                    <td className="border border-black p-2 text-right font-semibold">
                      {formatPrice(productAmount)}
                    </td>
                  </tr>

                  {/* Parts Rows */}
                  {productParts.length > 0 && (
                    <>
                      <tr className="bg-gray-100 text-black font-semibold">
                        <td
                          colSpan={6}
                          className="border border-black p-1 text-center italic text-gray-700"
                        >
                          Product Parts for {product?.productName ?? ""}
                        </td>
                      </tr>
                      {productParts.map(
                        (part: IProductPart, partIndex: number) => (
                          <tr
                            key={`part-${productIndex}-${partIndex}`}
                            className="align-top"
                          >
                            <td className="border border-black p-2 text-center">
                              {part.quantity}
                            </td>
                            <td className="border border-black p-2 text-center">
                              unit
                            </td>
                            <td className="border border-black p-2">
                              {part.name}
                            </td>
                            <td className="border border-black p-2">
                              {part.description ?? "N/A"}
                            </td>
                            <td className="border border-black p-2 text-center">
                              <img
                                src={part.image || "https://placehold.co/60x40"}
                                alt={part.name}
                                className="w-16 h-10 object-cover mx-auto"
                              />
                            </td>
                            <td className="border border-black p-2 text-right font-semibold">
                              NaN
                            </td>
                          </tr>
                        )
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}

            {/* Financial Summary */}
            <tr>
              <td
                colSpan={5}
                className="text-right font-semibold p-2 border-t border-black"
              >
                Subtotal
              </td>
              <td className="text-right font-semibold p-2 border-t border-black">
                {formatPrice(order.totalAmount)}
              </td>
            </tr>
            <tr>
              <td
                colSpan={5}
                className="text-right font-semibold p-2 border-t border-black"
              >
                Discount
              </td>
              <td className="text-right font-semibold p-2 border-t border-black">
                {formatPrice(0)}
              </td>
            </tr>
            <tr>
              <td
                colSpan={5}
                className="text-right font-bold p-2 border-t-2 border-black"
              >
                Total
              </td>
              <td className="text-right font-bold p-2 border-t-2 border-black">
                {formatPrice(order.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 6. Payment Terms & Bank Details */}
      <div className="flex justify-between items-start mb-6 text-xs">
        <div className="w-[48%]">
          <div className="bg-blue-200 text-center font-bold p-1 border border-black">
            Payment Terms
          </div>
          {paymentTerms.map((term, i) => (
            <div
              key={i}
              className="p-1 border-l border-r border-b border-black"
            >
              {term}
            </div>
          ))}
        </div>
        <div className="w-[48%]">
          <div className="bg-blue-200 text-center font-bold p-1 border border-black">
            Bank Details
          </div>
          <div className="p-1 border-l border-r border-b border-black">
            <p>
              <strong>{bankDetails.bank}</strong>
            </p>{" "}
            <p>{bankDetails.accountNumber}</p> <p>{bankDetails.accountName}</p>
          </div>
        </div>
      </div>

      {/* Page Break 1 */}
      <div
        className="page-break"
        style={{ pageBreakBefore: "always", visibility: "hidden", height: "0" }}
      ></div>

      {/* 7. Notes */}
      <div className="mb-4 border border-black text-xs">
        <div className="bg-blue-200 text-center font-bold p-1 border-b border-black">
          Notes
        </div>
        <div className="p-2 space-y-1 leading-normal">
          {notes.map((note, i) => (
            <p key={i}>{note}</p>
          ))}
        </div>
      </div>

      {/* 8. Project Details */}
      <div className="mb-6 border border-black text-xs">
        <div className="bg-blue-200 text-center font-bold p-1 border-b border-black">
          Project Details
        </div>
        <div className="grid grid-cols-2">
          <div className="p-2 border-r border-black leading-normal">
            {" "}
            <p className="font-semibold mb-1">Inclusion:</p>{" "}
            <ul className="list-disc list-inside space-y-0.5">
              {" "}
              {projectInclusions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}{" "}
            </ul>{" "}
          </div>
          <div className="p-2 leading-normal">
            {" "}
            <p className="font-semibold mb-1">Exclusion:</p>{" "}
            <ul className="list-disc list-inside space-y-0.5">
              {" "}
              {projectExclusions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}{" "}
            </ul>{" "}
          </div>
        </div>
        {order.products[0]?.productId?.image && (
          <div className="border-t border-black p-2">
            <p className="font-semibold text-center mb-1">Product Image</p>
            <img
              src={order.products[0].productId.image}
              alt="Product"
              className="w-40 h-auto object-cover mx-auto border border-gray-300"
            />
          </div>
        )}
      </div>

      {/* Page Break 2 */}
      <div
        className="page-break"
        style={{ pageBreakBefore: "always", visibility: "hidden", height: "0" }}
      ></div>

      {/* 9. Closing & Signatures */}
      <div className="text-xs space-y-4 mb-10 leading-normal">
        <p>We are looking forward to hear from you soon.</p>
        <p>
          If you have any questions concerning with this quotation, please
          contact Rolan Bagares at 0997-951-7188 or e-mail us at
          camco.prefab3@gmail.com
        </p>
      </div>
      <div className="flex justify-between items-start text-xs mb-10">
        <div>
          {" "}
          <p>Prepared by:</p> <br />
          <br />
          <br /> <p className="border-t border-black pt-1">
            {preparedBy.name}
          </p>{" "}
          <p>{preparedBy.phone}</p>{" "}
        </div>
        <div>
          {" "}
          <p>Approved by:</p> <br />
          <br />
          <br /> <p className="border-t border-black pt-1">
            {approvedBy.name}
          </p>{" "}
          <p>{approvedBy.phone}</p>{" "}
        </div>
      </div>
      <div>
        <p className="font-bold text-xs">CONFORME:</p>
        <p className="text-xs mb-6 leading-normal">
          I, the undersigned, hereby agree to proceed with this project in
          accordance with all requirements and specifics by signing this
          quotation.
        </p>
        <br />
        <br />
        <br />
        <p className="border-t border-black pt-1 text-xs">
          Signature above Printed Name
        </p>
        <br />
        <p className="text-xs">Date: _________________________</p>
      </div>
      <p className="text-center font-bold text-xs mt-10">
        THANK YOU FOR YOUR BUSINESS!
      </p>
    </div>
  );
};

export default FormalContractDocument;
