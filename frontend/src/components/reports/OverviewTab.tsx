import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";
import { BarChart3, Award } from "lucide-react";

// Define the expected props
interface OverviewTabProps {
  salesData: any[];
  topProducts: any[];
  formatCurrency: (value: number) => string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  salesData,
  topProducts,
  formatCurrency,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Revenue & Orders Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `₱${value / 1000}k`}
                  fontSize={12}
                />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "Revenue" ? formatCurrency(value) : value,
                    name,
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="#0ea5e9"
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#ef4444"
                  name="Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.quantity} units sold
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
