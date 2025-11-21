import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface SalesRecord {
  period: string | number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

interface GrowthTrendsTabProps {
  dailyData: SalesRecord[];
  weeklyData: SalesRecord[];
  monthlyData: SalesRecord[];
  annualData: SalesRecord[];
}

const calculateGrowthRate = (data: SalesRecord[]) => {
  return data.map((currentPeriod, index) => {
    if (index === 0) {
      return { ...currentPeriod, growthRate: 0 };
    }
    const previousPeriod = data[index - 1];
    const previousRevenue = previousPeriod.revenue;

    if (previousRevenue === 0) {
      return {
        ...currentPeriod,
        growthRate: currentPeriod.revenue > 0 ? 100 : 0,
      };
    }

    const growthRate =
      ((currentPeriod.revenue - previousRevenue) / previousRevenue) * 100;
    return { ...currentPeriod, growthRate: parseFloat(growthRate.toFixed(2)) };
  });
};

export const GrowthTrendsTab: React.FC<GrowthTrendsTabProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
  annualData,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly" | "annual"
  >("monthly");

  const growthData = useMemo(() => {
    switch (selectedPeriod) {
      case "daily":
        return calculateGrowthRate(dailyData);
      case "weekly":
        return calculateGrowthRate(weeklyData);
      case "monthly":
        return calculateGrowthRate(monthlyData);
      case "annual":
        return calculateGrowthRate(annualData);
      default:
        return calculateGrowthRate(monthlyData);
    }
  }, [selectedPeriod, dailyData, weeklyData, monthlyData, annualData]);

  // --- 1. UPDATED AXIS FORMATTER ---
  const formatXAxis = (tickItem: string | number) => {
    try {
      if (selectedPeriod === "daily") {
        // Display: "Jan 01"
        const date = new Date(tickItem);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
      if (selectedPeriod === "weekly") {
        // Display: "Wk 12"
        return `Wk ${tickItem}`;
      }
      if (selectedPeriod === "monthly") {
        // Display: "Jan" (if date object) or "Month X"
        const date = new Date(tickItem);
        // Check if it's a valid date string (e.g. "2023-01-01")
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", { month: "short" });
        }
        // Fallback if data is just numbers 1-12
        return tickItem;
      }
      // Annual: "2023"
      return tickItem;
    } catch (e) {
      return tickItem;
    }
  };

  // --- 2. ADDED TOOLTIP LABEL FORMATTER (For better UX on hover) ---
  const formatTooltipLabel = (label: string | number) => {
    try {
      const date = new Date(label);
      if (selectedPeriod === "daily") {
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // "Mon, January 1, 2024"
      }
      if (selectedPeriod === "weekly") {
        return `Week ${label}`;
      }
      if (selectedPeriod === "monthly") {
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }); // "January 2024"
        }
      }
      return label;
    } catch (e) {
      return label;
    }
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

      <TabsContent value={selectedPeriod}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {selectedPeriod.charAt(0).toUpperCase() +
                selectedPeriod.slice(1)}{" "}
              Revenue Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-5">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="period"
                  fontSize={12}
                  tickFormatter={formatXAxis}
                  minTickGap={30} // Prevents labels from overlapping
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  fontSize={12}
                  width={40} // Ensure enough space for "-100%"
                />
                <RechartsTooltip
                  labelFormatter={formatTooltipLabel} // Apply the tooltip formatter here
                  formatter={(value: number) => [
                    <span
                      className={value >= 0 ? "text-green-600" : "text-red-600"}
                    >
                      {value > 0 ? "+" : ""}
                      {value.toFixed(2)}%
                    </span>,
                    "Growth Rate",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="growthRate"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  name="Growth Rate"
                  dot={growthData.length < 20} // Only show dots if fewer than 20 data points
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
