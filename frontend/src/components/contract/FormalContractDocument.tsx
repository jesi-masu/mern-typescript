// src/components/contract/FormalContractDocument.tsx
import React from "react";
import { Order, IProductPart, OrderProduct } from "@/types";
import { formatPrice } from "@/lib/formatters";
import Logo2 from "@/assets/logo2.png";

interface FormalContractDocumentProps {
  order: Order;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatFullDeliveryAddress = (
  address: Order["customerInfo"]["deliveryAddress"] | undefined
): string => {
  if (!address) return "N/A";

  return [
    address.street,
    address.subdivision,
    address.cityMunicipality,
    address.province,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const FormalContractDocument: React.FC<FormalContractDocumentProps> = ({
  order,
}) => {
  const quoteNumber = `RB-2024-${order._id.slice(-6)}`;

  const notes = [
    "1.) Price is EXCLUSIVE of VAT",
    "2.) Deliveries within the city proper of Cagayan de Oro is free of charge",
    "3.) In case of installation on site, buyer must provide accommodation and meals for installers",
    "4.) This Quotation is valid until 3 months from the date issue above",
  ];
  const projectInclusions = [
    "Free shipping within 500 miles",
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
    accountNumber: "09635-801-5757",
    accountName: "Camco Mega Sales Corp",
  };
  const preparedBy = { name: "Sales and Marketing", phone: "0997-951-7188" };
  const approvedBy = { name: "General Manager", phone: "0905-794-6233" };

  // --- Helper to render product/part rows (to avoid repetition) ---
  const renderTableRow = (
    key: string,
    qty: number | string,
    unit: string,
    item: string,
    desc: string,
    imgSrc: string | undefined,
    imgAlt: string,
    amount: string | number
  ) => (
    <tr key={key} className="align-top">
      <td className="border border-black p-2 text-center">{qty}</td>
      <td className="border border-black p-2 text-center">{unit}</td>
      <td className="border border-black p-2">{item}</td>
      <td className="border border-black p-2">{desc}</td>
      <td className="border border-black p-2 text-center">
        <img
          src={imgSrc || "https://placehold.co/60x40"}
          alt={imgAlt}
          className="w-16 h-10 object-cover mx-auto"
        />
      </td>
      <td className="border border-black p-2 text-right font-semibold">
        {amount}
      </td>
    </tr>
  );

  return (
    <div
      id="formal-contract-content"
      className="p-3 bg-white text-black text-xs font-sans w-[8.5in] min-h-[13in] mx-auto box-border leading-normal"
    >
      {/* ====================================================== */}
      {/* CONTENT FOR PAGE 1                    */}
      {/* ====================================================== */}
      <div>
        <div className="flex justify-between items-center mb-4 -mt-4">
          <div className="w-32 h-20 flex items-center justify-center text-xs text-gray-500 mt-1 mr-4">
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
          <div className="text-center flex-grow">
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
          <div className="text-right w-32 flex-shrink-0 ml-2">
            <h2 className="text-lg font-bold">Quotation</h2>
            <p className="text-xs -ml-10">
              <strong>Quote #:</strong> {quoteNumber}
            </p>
            <p className="text-xs  -ml-10">
              <strong>Date:</strong> {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="mb-4 text-xs">
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
            {order.customerInfo?.deliveryAddress?.additionalAddressLine ||
              "N/A"}
          </p>
        </div>

        <p className="mb-2 text-xs">To our valued client,</p>
        <p className="mb-4 text-xs">
          We are pleased to present and offer you the following products and
          services
        </p>
        <div className="mb-4">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-blue-500 text-black font-bold text-center">
                <th className="border border-black p-2">Qty</th>
                <th className="border border-black p-2">Unit</th>
                <th className="border border-black p-2">Items</th>
                <th className="border border-black p-2">Description</th>
                <th className="border border-black p-2">Images</th>
                <th className="border border-black p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map(
                (item: OrderProduct, productIndex: number) => {
                  const product = item.productId;
                  const productParts = product?.productParts ?? [];
                  const productAmount =
                    (product?.productPrice ?? 0) * item.quantity;

                  return (
                    <React.Fragment key={`product-${productIndex}`}>
                      {/* Product Row Header */}
                      <tr className="bg-gray-100 text-black font-semibold">
                        <td
                          colSpan={6}
                          className="border border-black p-1 text-center"
                        >
                          Ordered Product #{productIndex + 1}
                        </td>
                      </tr>
                      {/* Product Row Details */}
                      {renderTableRow(
                        `prod-detail-${productIndex}`,
                        item.quantity,
                        "unit",
                        product?.productName ?? "N/A",
                        product?.productShortDescription ?? "N/A",
                        product?.image,
                        product?.productName ?? "Product",
                        formatPrice(productAmount)
                      )}

                      {/* Parts Rows (if any) */}
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
                            (part: IProductPart, partIndex: number) =>
                              renderTableRow(
                                `part-${productIndex}-${partIndex}`,
                                part.quantity,
                                "unit",
                                part.name,
                                part.description ?? "N/A",
                                part.image,
                                part.name,
                                "-"
                              )
                          )}
                        </>
                      )}
                    </React.Fragment>
                  );
                }
              )}

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

        {/* --- 4. Payment Terms & Bank Details --- */}
        <div className="flex justify-between items-start mb-6 text-xs">
          <div className="w-[48%]">
            <div className="bg-blue-500 text-center font-bold p-1 border border-black">
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
            <div className="bg-blue-500 text-center font-bold p-1 border border-black">
              Bank Details
            </div>
            <div className="p-1 border-l border-r border-b border-black">
              <p>
                <strong>{bankDetails.bank}</strong>
              </p>
              <p>{bankDetails.accountNumber}</p>
              <p>{bankDetails.accountName}</p>
            </div>
          </div>
        </div>
      </div>
      {/* End of Page 1 Content */}
      {/* ====================================================== */}
      {/* THIS IS OUR NEW PAGE BREAK MARKER                   */}
      {/* ====================================================== */}
      <div className="pdf-page-break"></div>
      {/* ====================================================== */}
      {/* CONTENT FOR PAGE 2                     */}
      {/* ====================================================== */}
      {/* We moved className="pt-10" to this div */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        {/* --- 5. Notes --- */}
        <div className="mb-4 border border-black text-xs">
          <div className="bg-blue-500 text-center font-bold p-1  border-b border-black">
            Notes
          </div>
          <div className="p-2 space-y-1 leading-normal">
            {notes.map((note, i) => (
              <p key={i}>{note}</p>
            ))}
          </div>
        </div>

        {/* --- 6. Project Details --- */}
        <div className="mb-6 border border-black text-xs">
          <div className="bg-blue-500 text-center font-bold p-1  border-b border-black">
            Project Details
          </div>
          <div className="grid grid-cols-2">
            <div className="p-2 border-r border-black leading-normal">
              <p className="font-semibold mb-1">Inclusion:</p>
              <ul className="list-disc list-inside px-3 space-y-0.5">
                {projectInclusions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-2 leading-normal">
              <p className="font-semibold mb-1">Exclusion:</p>
              <ul className="list-disc list-inside px-3 space-y-0.5">
                {projectExclusions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Main Product Image */}
          {order.products[0]?.productId?.image && (
            <div className="border-t border-black p-2">
              <p className="font-semibold text-center mb-3">Product Image</p>
              <img
                // Add crossOrigin="anonymous" if facing CORS issues
                // crossOrigin="anonymous"
                src={order.products[0].productId.image}
                alt="Product"
                className="w-50 h-auto max-h-48 object-cover mx-auto border border-gray-300"
              />
            </div>
          )}
        </div>

        <div className="text-xs space-y-4 mb-10 leading-normal">
          <p>We are looking forward to hear from you soon.</p>
          <p>
            If you have any questions concerning with this quotation, please
            contact Rolan Bagares at 0997-951-7188 or e-mail us at
            camco.prefab3@gmail.com
          </p>
        </div>

        <div className="flex justify-between items-start text-xs mb-10">
          <div className="ml-40">
            <p>Prepared by:</p> <br /> <br />
            <p className="border-t border-black pt-1">
              &nbsp; &nbsp; &nbsp; &nbsp;{preparedBy.name}&nbsp; &nbsp; &nbsp;
              &nbsp;
            </p>
            <p>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;{preparedBy.phone}&nbsp;
              &nbsp; &nbsp; &nbsp;
            </p>
          </div>
          <div className="mr-40">
            <p>Approved by:</p> <br /> <br />
            <p className="border-t border-black pt-1">
              &nbsp; &nbsp; &nbsp; &nbsp;{approvedBy.name} &nbsp; &nbsp; &nbsp;
              &nbsp;
            </p>
            <p>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{approvedBy.phone}&nbsp; &nbsp;
              &nbsp; &nbsp;
            </p>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm italic">CONFORME:</p>
          <p className="text-xs mb-6 leading-normal">
            I, the undersigned, hereby agree to proceed with this project in
            accordance with all requirements and specifics by signing this
            quotation.
          </p>
          <br /> <br />
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
      {/* End of Page 2 Content */}
    </div> // End of main document div
  );
};

export default FormalContractDocument;
