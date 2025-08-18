
// Enhanced sales data for comprehensive reports
export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface WeeklySales {
  week: string;
  weekNumber: number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface MonthlySales {
  month: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  growthRate: number;
}

export interface AnnualSales {
  year: number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  growthRate: number;
}

export interface ProductPerformance {
  productId: number;
  name: string;
  revenue: number;
  quantity: number;
  avgPrice: number;
}

export interface CustomerSegment {
  segment: string;
  customerCount: number;
  revenue: number;
  avgOrderValue: number;
}

// Daily sales data (last 30 days)
export const dailySales: DailySales[] = [
  { date: "2024-06-01", revenue: 45000, orders: 3, avgOrderValue: 15000 },
  { date: "2024-06-02", revenue: 32000, orders: 2, avgOrderValue: 16000 },
  { date: "2024-06-03", revenue: 58000, orders: 4, avgOrderValue: 14500 },
  { date: "2024-06-04", revenue: 41000, orders: 3, avgOrderValue: 13667 },
  { date: "2024-06-05", revenue: 67000, orders: 5, avgOrderValue: 13400 },
  { date: "2024-06-06", revenue: 39000, orders: 2, avgOrderValue: 19500 },
  { date: "2024-06-07", revenue: 52000, orders: 4, avgOrderValue: 13000 },
  { date: "2024-06-08", revenue: 48000, orders: 3, avgOrderValue: 16000 },
  { date: "2024-06-09", revenue: 63000, orders: 4, avgOrderValue: 15750 },
  { date: "2024-06-10", revenue: 55000, orders: 3, avgOrderValue: 18333 },
  { date: "2024-06-11", revenue: 71000, orders: 5, avgOrderValue: 14200 },
  { date: "2024-06-12", revenue: 44000, orders: 3, avgOrderValue: 14667 },
  { date: "2024-06-13", revenue: 59000, orders: 4, avgOrderValue: 14750 },
  { date: "2024-06-14", revenue: 47000, orders: 3, avgOrderValue: 15667 },
  { date: "2024-06-15", revenue: 61000, orders: 4, avgOrderValue: 15250 },
  { date: "2024-06-16", revenue: 53000, orders: 3, avgOrderValue: 17667 },
  { date: "2024-06-17", revenue: 68000, orders: 5, avgOrderValue: 13600 },
  { date: "2024-06-18", revenue: 42000, orders: 2, avgOrderValue: 21000 },
  { date: "2024-06-19", revenue: 56000, orders: 4, avgOrderValue: 14000 },
  { date: "2024-06-20", revenue: 49000, orders: 3, avgOrderValue: 16333 },
  { date: "2024-06-21", revenue: 64000, orders: 4, avgOrderValue: 16000 },
  { date: "2024-06-22", revenue: 51000, orders: 3, avgOrderValue: 17000 },
  { date: "2024-06-23", revenue: 73000, orders: 5, avgOrderValue: 14600 },
  { date: "2024-06-24", revenue: 46000, orders: 3, avgOrderValue: 15333 },
  { date: "2024-06-25", revenue: 58000, orders: 4, avgOrderValue: 14500 },
  { date: "2024-06-26", revenue: 50000, orders: 3, avgOrderValue: 16667 },
];

// Weekly sales data (last 12 weeks)
export const weeklySales: WeeklySales[] = [
  { week: "Week 15", weekNumber: 15, revenue: 245000, orders: 18, avgOrderValue: 13611 },
  { week: "Week 16", weekNumber: 16, revenue: 268000, orders: 20, avgOrderValue: 13400 },
  { week: "Week 17", weekNumber: 17, revenue: 291000, orders: 22, avgOrderValue: 13227 },
  { week: "Week 18", weekNumber: 18, revenue: 315000, orders: 24, avgOrderValue: 13125 },
  { week: "Week 19", weekNumber: 19, revenue: 287000, orders: 21, avgOrderValue: 13667 },
  { week: "Week 20", weekNumber: 20, revenue: 308000, orders: 23, avgOrderValue: 13391 },
  { week: "Week 21", weekNumber: 21, revenue: 332000, orders: 25, avgOrderValue: 13280 },
  { week: "Week 22", weekNumber: 22, revenue: 295000, orders: 22, avgOrderValue: 13409 },
  { week: "Week 23", weekNumber: 23, revenue: 319000, orders: 24, avgOrderValue: 13292 },
  { week: "Week 24", weekNumber: 24, revenue: 343000, orders: 26, avgOrderValue: 13192 },
  { week: "Week 25", weekNumber: 25, revenue: 367000, orders: 28, avgOrderValue: 13107 },
  { week: "Week 26", weekNumber: 26, revenue: 354000, orders: 26, avgOrderValue: 13615 },
];

// Annual sales data
export const annualSales: AnnualSales[] = [
  { year: 2021, revenue: 1200000, orders: 95, avgOrderValue: 12632, growthRate: 0 },
  { year: 2022, revenue: 1560000, orders: 118, avgOrderValue: 13220, growthRate: 30 },
  { year: 2023, revenue: 2028000, orders: 152, avgOrderValue: 13342, growthRate: 30 },
  { year: 2024, revenue: 2800000, orders: 210, avgOrderValue: 13333, growthRate: 38 },
];

// Enhanced monthly sales with growth rates
export const enhancedMonthlySales: MonthlySales[] = [
  { month: "Jan", revenue: 180000, orders: 14, avgOrderValue: 12857, growthRate: 15 },
  { month: "Feb", revenue: 195000, orders: 15, avgOrderValue: 13000, growthRate: 8.3 },
  { month: "Mar", revenue: 220000, orders: 16, avgOrderValue: 13750, growthRate: 12.8 },
  { month: "Apr", revenue: 245000, orders: 18, avgOrderValue: 13611, growthRate: 11.4 },
  { month: "May", revenue: 268000, orders: 20, avgOrderValue: 13400, growthRate: 9.4 },
  { month: "Jun", revenue: 285000, orders: 21, avgOrderValue: 13571, growthRate: 6.3 },
  { month: "Jul", revenue: 302000, orders: 23, avgOrderValue: 13130, growthRate: 6.0 },
  { month: "Aug", revenue: 318000, orders: 24, avgOrderValue: 13250, growthRate: 5.3 },
  { month: "Sep", revenue: 335000, orders: 25, avgOrderValue: 13400, growthRate: 5.3 },
  { month: "Oct", revenue: 352000, orders: 26, avgOrderValue: 13538, growthRate: 5.1 },
  { month: "Nov", revenue: 370000, orders: 28, avgOrderValue: 13214, growthRate: 5.1 },
  { month: "Dec", revenue: 390000, orders: 30, avgOrderValue: 13000, growthRate: 5.4 },
];

// Product performance data
export const productPerformance: ProductPerformance[] = [
  { productId: 1, name: "Modern Studio Module", revenue: 420000, quantity: 28, avgPrice: 15000 },
  { productId: 2, name: "Family Home Base Module", revenue: 680000, quantity: 34, avgPrice: 20000 },
  { productId: 3, name: "Commercial Office Pod", revenue: 540000, quantity: 36, avgPrice: 15000 },
  { productId: 4, name: "Starter Home Module", revenue: 380000, quantity: 38, avgPrice: 10000 },
  { productId: 5, name: "Retail Store Module", revenue: 450000, quantity: 30, avgPrice: 15000 },
];

// Customer segment data
export const customerSegments: CustomerSegment[] = [
  { segment: "Individual Buyers", customerCount: 85, revenue: 1200000, avgOrderValue: 14118 },
  { segment: "Small Businesses", customerCount: 45, revenue: 900000, avgOrderValue: 20000 },
  { segment: "Developers", customerCount: 25, revenue: 700000, avgOrderValue: 28000 },
  { segment: "Government", customerCount: 8, revenue: 400000, avgOrderValue: 50000 },
];
