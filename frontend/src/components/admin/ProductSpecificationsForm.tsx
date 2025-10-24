import React from "react";
import { ProductSpecifications } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormLabel } from "@/components/ui/form";
import { X, Plus } from "lucide-react";

interface ProductSpecificationsFormProps {
  specifications: ProductSpecifications;
  setSpecifications: React.Dispatch<
    React.SetStateAction<ProductSpecifications>
  >;
  dynamicSpecs: Record<string, string>;
  setDynamicSpecs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  newDynamicSpecKey: string;
  setNewDynamicSpecKey: React.Dispatch<React.SetStateAction<string>>;
  newDynamicSpecValue: string;
  setNewDynamicSpecValue: React.Dispatch<React.SetStateAction<string>>;
  onAddDynamicSpec: () => void;
  onRemoveDynamicSpec: (key: string) => void;
}

const ProductSpecificationsForm: React.FC<ProductSpecificationsFormProps> = ({
  specifications,
  setSpecifications,
  dynamicSpecs,
  setDynamicSpecs,
  newDynamicSpecKey,
  setNewDynamicSpecKey,
  newDynamicSpecValue,
  setNewDynamicSpecValue,
  onAddDynamicSpec,
  onRemoveDynamicSpec,
}) => {
  return (
    <>
      {Object.keys(specifications).map((key) => (
        <div key={key}>
          <FormLabel className="capitalize">{key}</FormLabel>
          <Input
            value={(specifications as any)[key] || ""}
            onChange={(e) =>
              setSpecifications((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            className="mt-2"
          />
        </div>
      ))}
      <div className="pt-4 border-t">
        <FormLabel>Add Custom Specification</FormLabel>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Spec Name (e.g., 'Warranty')"
            value={newDynamicSpecKey}
            onChange={(e) => setNewDynamicSpecKey(e.target.value)}
          />
          <Input
            placeholder="Spec Value (e.g., '5 Years')"
            value={newDynamicSpecValue}
            onChange={(e) => setNewDynamicSpecValue(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onAddDynamicSpec}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(dynamicSpecs).map(([key, value]) => (
            <Badge
              key={key}
              variant="secondary"
              className="flex items-center gap-2 pr-1"
            >
              <strong>{key}:</strong> {value}
              <button
                type="button"
                onClick={() => onRemoveDynamicSpec(key)}
                className="rounded-full hover:bg-muted-foreground/20 p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductSpecificationsForm;
