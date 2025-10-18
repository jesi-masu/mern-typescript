import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface SalesRecord {
  period: string | number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

interface RevenueAnalysisTabProps {
  dailyData: SalesRecord[];
  weeklyData: SalesRecord[];
  monthlyData: SalesRecord[];
  annualData: SalesRecord[];
  formatCurrency: (value: number) => string;
}

export const RevenueAnalysisTab: React.FC<RevenueAnalysisTabProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
  annualData,
  formatCurrency,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly" | "annual"
  >("monthly");

  const getDataForPeriod = (): SalesRecord[] => {
    switch (selectedPeriod) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "annual":
        return annualData;
      default:
        return monthlyData;
    }
  };

  const currentData = getDataForPeriod();

  const formatXAxis = (tickItem: string | number) => {
    if (selectedPeriod === "daily") {
      try {
        const date = new Date(tickItem);
        return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
      } catch {
        return tickItem;
      }
    }
    if (selectedPeriod === "weekly") {
      return `W${tickItem}`;
    }
    return tickItem;
  };

  return (
    <Tabs
      value={selectedPeriod}
      onValueChange={(value) => setSelectedPeriod(value as any)}
      className="space-y-6"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="annual">Annual</TabsTrigger>
      </TabsList>

      <TabsContent value={selectedPeriod} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {selectedPeriod.charAt(0).toUpperCase() +
                  selectedPeriod.slice(1)}{" "}
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="period"
                    fontSize={12}
                    tickFormatter={formatXAxis}
                  />
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
                {selectedPeriod.charAt(0).toUpperCase() +
                  selectedPeriod.slice(1)}{" "}
                Orders Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="period"
                    fontSize={12}
                    tickFormatter={formatXAxis}
                  />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <RechartsTooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString()} orders`,
                      "Orders",
                    ]}
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
              {selectedPeriod.charAt(0).toUpperCase() +
                selectedPeriod.slice(1)}{" "}
              Average Order Value (AOV)
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  fontSize={12}
                  tickFormatter={formatXAxis}
                />
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
      </TabsContent>
    </Tabs>
  );
};
