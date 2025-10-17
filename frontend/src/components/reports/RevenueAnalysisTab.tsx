import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { BarChart3, ShoppingCart, Target } from "lucide-react";

interface RevenueAnalysisTabProps {
  salesData: any[];
  formatCurrency: (value: number) => string;
}

export const RevenueAnalysisTab: React.FC<RevenueAnalysisTabProps> = ({
  salesData,
  formatCurrency,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                  fontSize={12}
                />
                <RechartsTooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Monthly Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <RechartsTooltip
                  formatter={(value: number) => [`${value} orders`, "Orders"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Average Order Value (AOV) Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                fontSize={12}
              />
              <RechartsTooltip
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Avg Order Value",
                ]}
              />
              <Area
                type="monotone"
                dataKey="avgOrderValue"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
                name="Avg Order Value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
