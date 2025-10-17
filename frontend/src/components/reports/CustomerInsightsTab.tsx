import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Users } from "lucide-react";

// Mock data until backend is updated
const mockCustomerSegments = [
  {
    segment: "New Customers",
    customerCount: 15,
    revenue: 50000,
    avgOrderValue: 3333,
  },
  {
    segment: "Returning Customers",
    customerCount: 30,
    revenue: 150000,
    avgOrderValue: 5000,
  },
  {
    segment: "High-Value",
    customerCount: 5,
    revenue: 100000,
    avgOrderValue: 20000,
  },
];
const COLORS = ["#0ea5e9", "#10b981", "#f59e0b"];

interface CustomerInsightsTabProps {
  formatCurrency: (value: number) => string;
}

export const CustomerInsightsTab: React.FC<CustomerInsightsTabProps> = ({
  formatCurrency,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Segments by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={mockCustomerSegments}
                  dataKey="revenue"
                  nameKey="segment"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {mockCustomerSegments.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Segment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCustomerSegments.map((segment, index) => (
                <div
                  key={segment.segment}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div>
                      <p className="font-medium">{segment.segment}</p>
                      <p className="text-sm text-muted-foreground">
                        {segment.customerCount} customers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatCurrency(segment.revenue)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      AOV: {formatCurrency(segment.avgOrderValue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
