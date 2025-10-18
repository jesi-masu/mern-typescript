import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Printer,
  ShoppingCart,
  Target,
  TrendingUp,
  Loader2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  PhilippinePeso,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { OverviewTab } from "@/components/reports/OverviewTab";
import { RevenueAnalysisTab } from "@/components/reports/RevenueAnalysisTab";
import { ProductPerformanceTab } from "@/components/reports/ProductPerformanceTab";
import { CustomerInsightsTab } from "@/components/reports/CustomerInsightsTab";
import { GrowthTrendsTab } from "@/components/reports/GrowthTrendsTab";

interface ReportData {
  kpi: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  yoyGrowth: number;
  salesByDay: any[];
  salesByWeek: any[];
  monthlyData: any[];
  salesByYear: any[];
  productPerformance: any[];
}

const Reports: React.FC = () => {
  const { token } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const formatCurrency = (value: number) =>
    `₱${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const formatPercentage = (value: number) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

  const fetchReportData = async (): Promise<ReportData> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/reports/summary?year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch report data");
    return response.json();
  };

  const { data, isLoading, error } = useQuery<ReportData>({
    queryKey: ["reportSummary", year],
    queryFn: fetchReportData,
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2" /> Failed to load data.
      </div>
    );
  }

  const kpi = data?.kpi || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  };
  const yoyGrowth = data?.yoyGrowth ?? 0;
  const salesByDay = data?.salesByDay || [];
  const salesByWeek = data?.salesByWeek || [];
  const monthlyData = data?.monthlyData || [];
  const salesByYear = data?.salesByYear || [];
  const productPerformance = data?.productPerformance || [];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div>
          <h1 className="text-4xl font-bold mb-2">Sales Analytics Dashboard</h1>
          <p className="text-blue-100 text-lg">
            Comprehensive business performance insights
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <PhilippinePeso className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(kpi.totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {kpi.totalOrders.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(kpi.averageOrderValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">YoY Growth</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold flex items-center ${
                yoyGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {yoyGrowth >= 0 ? (
                <ArrowUp className="h-6 w-6 mr-1" />
              ) : (
                <ArrowDown className="h-6 w-6 mr-1" />
              )}
              {formatPercentage(Math.abs(yoyGrowth))}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue growth vs. previous year
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="trends">Growth Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab
            salesData={monthlyData}
            topProducts={productPerformance}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
        <TabsContent value="revenue">
          <RevenueAnalysisTab
            dailyData={salesByDay}
            weeklyData={salesByWeek}
            monthlyData={monthlyData}
            annualData={salesByYear}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
        <TabsContent value="products">
          <ProductPerformanceTab
            productData={productPerformance}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
        <TabsContent value="customers">
          <CustomerInsightsTab formatCurrency={formatCurrency} />
        </TabsContent>
        <TabsContent value="trends">
          <GrowthTrendsTab
            dailyData={salesByDay}
            weeklyData={salesByWeek}
            monthlyData={monthlyData} // Pass the correctly named monthly data
            annualData={salesByYear}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Reports;
