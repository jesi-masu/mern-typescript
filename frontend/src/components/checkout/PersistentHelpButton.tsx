// src/components/checkout/PersistentHelpButton.tsx

import { Button } from "@/components/ui/button";
import { CircleQuestionMark } from "lucide-react";

type Props = {
  onClick: () => void;
};

const PersistentHelpButton = ({ onClick }: Props) => {
  return (
    <Button
      variant="default"
      onClick={onClick}
      className="fixed right-8 z-50 h-12 w-12 rounded-full shadow-lg bg-prefab-600 hover:bg-prefab-700
      bottom-24 
      p-0"
      aria-label="Show checkout help"
    >
      <CircleQuestionMark className="h-10 w-10" />
    </Button>
  );
};

export default PersistentHelpButton;
