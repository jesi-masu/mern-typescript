import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import { Award } from "lucide-react";

interface ProductPerformanceTabProps {
  productData: any[];
  formatCurrency: (value: number) => string;
}

export const ProductPerformanceTab: React.FC<ProductPerformanceTabProps> = ({
  productData,
  formatCurrency,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Products by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={productData}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  fontSize={12}
                />
                <RechartsTooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productData.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity.toLocaleString()} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(product.revenue)}
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
