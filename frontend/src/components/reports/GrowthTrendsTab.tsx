import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface GrowthTrendsTabProps {
  salesData: any[];
}

export const GrowthTrendsTab: React.FC<GrowthTrendsTabProps> = ({
  salesData,
}) => {
  // Calculate growth rate data
  const growthData = useMemo(() => {
    return salesData.map((currentMonth, index) => {
      if (index === 0) {
        return { ...currentMonth, growthRate: 0 }; // No growth for the first month
      }
      const previousMonth = salesData[index - 1];
      const previousRevenue = previousMonth.revenue;

      if (previousRevenue === 0) {
        return {
          ...currentMonth,
          growthRate: currentMonth.revenue > 0 ? 100 : 0,
        };
      }

      const growthRate =
        ((currentMonth.revenue - previousRevenue) / previousRevenue) * 100;
      return { ...currentMonth, growthRate: parseFloat(growthRate.toFixed(2)) };
    });
  }, [salesData]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Revenue Growth Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis tickFormatter={(value) => `${value}%`} fontSize={12} />
              <RechartsTooltip
                formatter={(value: number) => [`${value}%`, "Growth Rate"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="growthRate"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Monthly Growth Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
