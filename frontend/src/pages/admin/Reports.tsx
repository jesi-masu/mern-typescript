import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  Area, AreaChart, ComposedChart
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  Download,
  FileText,
  Target,
  Award,
  Activity,
  ArrowUp,
  ArrowDown,
  Printer,
  Mail
} from 'lucide-react';
import { 
  dailySales, 
  weeklySales, 
  enhancedMonthlySales, 
  annualSales,
  productPerformance,
  customerSegments
} from '@/data/enhancedSales';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [reportView, setReportView] = useState('overview');

  // Enhanced calculations with better formatting
  const currentMonthRevenue = enhancedMonthlySales[enhancedMonthlySales.length - 1]?.revenue || 0;
  const previousMonthRevenue = enhancedMonthlySales[enhancedMonthlySales.length - 2]?.revenue || 0;
  const monthlyGrowth = previousMonthRevenue > 0 ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100) : 0;

  const totalYearRevenue = enhancedMonthlySales.reduce((sum, month) => sum + month.revenue, 0);
  const totalYearOrders = enhancedMonthlySales.reduce((sum, month) => sum + month.orders, 0);
  const avgOrderValue = totalYearRevenue / totalYearOrders;

  const currentYearData = annualSales.find(year => year.year === 2024);
  const previousYearData = annualSales.find(year => year.year === 2023);
  const yearOverYearGrowth = previousYearData ? ((currentYearData?.revenue || 0) - previousYearData.revenue) / previousYearData.revenue * 100 : 0;

  const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();

  const getRenderData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return dailySales;
      case 'weekly':
        return weeklySales;
      case 'monthly':
        return enhancedMonthlySales;
      case 'annual':
        return annualSales;
      default:
        return enhancedMonthlySales;
    }
  };

  const getDataKey = () => {
    switch (selectedPeriod) {
      case 'daily':
        return 'date';
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      case 'annual':
        return 'year';
      default:
        return 'month';
    }
  };

  const topProducts = [...productPerformance]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  const recentGrowthTrend = enhancedMonthlySales.slice(-6);

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Sales Analytics Dashboard</h1>
            <p className="text-blue-100 text-lg">Comprehensive business performance insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily View</SelectItem>
                <SelectItem value="weekly">Weekly View</SelectItem>
                <SelectItem value="monthly">Monthly View</SelectItem>
                <SelectItem value="annual">Annual View</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-bl-full opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalYearRevenue)}</div>
            <div className="flex items-center text-sm">
              {monthlyGrowth >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`font-medium ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(Math.abs(monthlyGrowth))}
              </span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(totalYearOrders)}</div>
            <p className="text-sm text-gray-500">
              {enhancedMonthlySales[enhancedMonthlySales.length - 1]?.orders || 0} orders this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-bl-full opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Order Value</CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(avgOrderValue)}</div>
            <p className="text-sm text-gray-500">
              Per order average
            </p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-bl-full opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">YoY Growth</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatPercentage(yearOverYearGrowth)}
            </div>
            <p className="text-sm text-gray-500">
              Year over year growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={reportView} onValueChange={setReportView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="trends">Growth Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={enhancedMonthlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `₱${(value / 1000)}k`} tick={{ fontSize: 12 }} />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : Number(value),
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                      contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" />
                    <Line type="monotone" dataKey="orders" stroke="#ef4444" strokeWidth={2} name="Orders" />
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
                  {topProducts.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-gray-500">Avg: {formatCurrency(product.avgPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Growth Momentum (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={recentGrowthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip 
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Growth Rate']}
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="growthRate" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3}
                    name="Growth Rate (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getRenderData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={getDataKey()} />
                    <YAxis tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
                    <RechartsTooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
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
                  Orders Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={getRenderData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={getDataKey()} />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => [`${value} orders`, 'Orders']} />
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
                Average Order Value Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getRenderData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={getDataKey()} />
                  <YAxis tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
                  <RechartsTooltip formatter={(value) => [formatCurrency(Number(value)), 'Avg Order Value']} />
                  <Area 
                    type="monotone" 
                    dataKey="avgOrderValue" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                    name="Avg Order Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Products by Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={productPerformance}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" width={150} />
                    <RechartsTooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
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
                <div className="space-y-4">
                  {productPerformance.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} units sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg: {formatCurrency(product.avgPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      nameKey="segment"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value, name, props) => [formatCurrency(Number(value)), props.payload.segment]} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={segment.segment} className="flex items-center justify-between p-3 border rounded-lg">
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
                        <p className="font-bold">{formatCurrency(segment.revenue)}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg: {formatCurrency(segment.avgOrderValue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth Rate Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={enhancedMonthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Growth Rate']} />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
