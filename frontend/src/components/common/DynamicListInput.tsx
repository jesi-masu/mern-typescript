// src/components/common/DynamicListInput.tsx

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormLabel } from "@/components/ui/form";

interface DynamicListInputProps {
  title: string;
  placeholder: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const DynamicListInput: React.FC<DynamicListInputProps> = ({
  title,
  placeholder,
  items,
  setItems,
}) => {
  const [newInputItem, setNewInputItem] = useState("");

  const handleAddItem = () => {
    if (newInputItem.trim()) {
      setItems((prev) => [...prev, newInputItem.trim()]);
      setNewInputItem(""); // Clear input after adding
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <FormLabel>{title}</FormLabel>
      <div className="flex gap-2 mt-2">
        <Input
          placeholder={placeholder}
          value={newInputItem}
          onChange={(e) => setNewInputItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent form submission
              handleAddItem();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddItem}
          // The button won't be clickable if the input is empty to avoid adding empty items
          disabled={!newInputItem.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item: string, index: number) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-2 pr-1" // Added pr-1 for consistent spacing
          >
            <span className="max-w-[200px] truncate">{item}</span>
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="rounded-full hover:bg-muted-foreground/20 p-1" // Added padding for easier click
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default DynamicListInput;
