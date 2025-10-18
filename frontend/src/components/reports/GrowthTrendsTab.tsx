import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
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

// Define the shape of the sales data
interface SalesRecord {
  period: string | number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

// Update props to accept all data periods
interface GrowthTrendsTabProps {
  dailyData: SalesRecord[];
  weeklyData: SalesRecord[];
  monthlyData: SalesRecord[];
  annualData: SalesRecord[];
}

// Reusable function to calculate growth rate for any period
const calculateGrowthRate = (data: SalesRecord[]) => {
  return data.map((currentPeriod, index) => {
    if (index === 0) {
      return { ...currentPeriod, growthRate: 0 }; // No growth for the first period
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

  // Calculate growth data based on the selected tab
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
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  fontSize={12}
                  tickFormatter={formatXAxis}
                />
                <YAxis tickFormatter={(value) => `${value}%`} fontSize={12} />
                <RechartsTooltip
                  formatter={(value: number) => [
                    `${value.toFixed(2)}%`,
                    "Growth Rate",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="growthRate"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name={`${
                    selectedPeriod.charAt(0).toUpperCase() +
                    selectedPeriod.slice(1)
                  } Growth Rate (%)`}
                  dot={false} // Optionally hide dots for daily/weekly views if too cluttered
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
