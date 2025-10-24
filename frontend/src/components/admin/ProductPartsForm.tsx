import React from "react";
import { IProductPart } from "@/types/product";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { X, Plus } from "lucide-react";
import { formatPrice } from "@/lib/formatters"; // 👈 Import your price formatter
import { Textarea } from "@/components/ui/textarea";

interface ProductPartsFormProps {
  productParts: IProductPart[];
  newPart: IProductPart;
  setNewPart: React.Dispatch<React.SetStateAction<IProductPart>>;
  onAddPart: () => void;
  onRemovePart: (index: number) => void;
}

const ProductPartsForm: React.FC<ProductPartsFormProps> = ({
  productParts,
  newPart,
  setNewPart,
  onAddPart,
  onRemovePart,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Parts</CardTitle>
        <CardDescription>
          Add the individual parts included in this product.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Part Name</FormLabel>
            <Input
              placeholder="e.g., Steel Beam"
              value={newPart.name}
              onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Part Image URL</FormLabel>
            <Input
              placeholder="https://..."
              value={newPart.image}
              onChange={(e) =>
                setNewPart({ ...newPart, image: e.target.value })
              }
            />
          </FormItem>
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              min="1"
              value={newPart.quantity}
              onChange={(e) =>
                setNewPart({
                  ...newPart,
                  quantity: parseInt(e.target.value, 10) || 1,
                })
              }
            />
          </FormItem>
          <FormItem>
            <FormLabel>Price (Optional)</FormLabel>
            <Input
              type="number"
              placeholder="e.g., 1500"
              value={newPart.price || ""}
              onChange={(e) =>
                setNewPart({
                  ...newPart,
                  price: parseFloat(e.target.value) || undefined,
                })
              }
            />
          </FormItem>
        </div>

        <FormItem>
          <FormLabel>Part Description</FormLabel>
          <Textarea
            placeholder="A short description of the part..."
            value={newPart.description || ""}
            onChange={(e) =>
              setNewPart({ ...newPart, description: e.target.value })
            }
            rows={3}
          />
        </FormItem>

        <Button type="button" onClick={onAddPart}>
          <Plus className="h-4 w-4 mr-2" />
          Add Part
        </Button>

        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Added Parts</h4>
          {/* ... (empty state) ... */}
          {productParts.map((part, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-2 border rounded-md" // Changed to items-start
            >
              <div className="flex items-start gap-3">
                {" "}
                {/* Changed to items-start */}
                <img
                  src={part.image}
                  alt={part.name}
                  className="h-10 w-10 rounded object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-medium">{part.name}</p>

                  {/* --- 3. ADD THIS BLOCK TO DISPLAY DESC & QTY --- */}
                  {part.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {part.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    x{part.quantity}{" "}
                    {part.price ? ` - ${formatPrice(part.price)}` : ""}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemovePart(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPartsForm;
