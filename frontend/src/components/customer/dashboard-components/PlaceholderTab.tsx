// src/components/customer/dashboard-components/PlaceholderTab.tsx

import React from "react";
import { LucideProps } from "lucide-react";

interface PlaceholderTabProps {
  Icon: React.ComponentType<LucideProps>;
  message: string;
}

export const PlaceholderTab: React.FC<PlaceholderTabProps> = ({
  Icon,
  message,
}) => {
  return (
    <div className="text-center py-12 text-gray-500">
      <Icon className="h-12 w-12 mx-auto mb-4" />
      <p>{message}</p>
    </div>
  );
};
