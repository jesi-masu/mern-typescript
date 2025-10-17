// src/pages/admin/Reports.tsx

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// --- UI Components ---
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Icons ---
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
// --- Authentication & Data ---
import { useAuth } from "@/context/AuthContext";

// --- Report Tab Components ---
import { OverviewTab } from "@/components/reports/OverviewTab";
import { RevenueAnalysisTab } from "@/components/reports/RevenueAnalysisTab";
import { ProductPerformanceTab } from "@/components/reports/ProductPerformanceTab";
import { CustomerInsightsTab } from "@/components/reports/CustomerInsightsTab";
import { GrowthTrendsTab } from "@/components/reports/GrowthTrendsTab";

// --- UPDATED INTERFACE to include YoY Growth ---
interface ReportData {
  kpi: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  yoyGrowth: number; // Field for Year-over-Year growth
  salesOverTime: any[];
  productPerformance: any[];
}

const Reports: React.FC = () => {
  const { token } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear().toString());

  // --- Helper Functions ---
  const formatCurrency = (value: number) =>
    `₱${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatPercentage = (value: number) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

  // --- Data Fetching ---
  const fetchReportData = async (): Promise<ReportData> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/reports/summary?year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch report data");
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery<ReportData>({
    queryKey: ["reportSummary", year],
    queryFn: fetchReportData, // Corrected typo from previous conversation
    enabled: !!token,
  });

  // --- UI Loading State ---
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // --- UI Error State ---
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2" /> Failed to load data.
      </div>
    );
  }

  // --- Data Fallbacks ---
  const kpi = data?.kpi || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  };
  const yoyGrowth = data?.yoyGrowth ?? 0; // Default to 0 if null/undefined
  const salesOverTime = data?.salesOverTime || [];
  const productPerformance = data?.productPerformance || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Sales Analytics Dashboard
            </h1>
            <p className="text-blue-100 text-lg">
              Comprehensive business performance insights
            </p>
          </div>
          {/* <div className="flex items-center gap-3">
            <Button variant="secondary" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div> */}
        </div>
      </div>

      {/* KPI Cards */}
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

        {/* --- UPDATED YOY GROWTH CARD --- */}
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

      {/* Tabs */}
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
            salesData={salesOverTime}
            topProducts={productPerformance}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
        <TabsContent value="revenue">
          <RevenueAnalysisTab
            salesData={salesOverTime}
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
          <GrowthTrendsTab salesData={salesOverTime} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
