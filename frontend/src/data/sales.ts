
// Mock sales data for reports
export interface MonthlySales {
  month: string;
  revenue: number;
}

export interface ProductSales {
  name: string;
  revenue: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export const monthlySales: MonthlySales[] = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 19000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 18000 },
  { month: "May", revenue: 21000 },
  { month: "Jun", revenue: 25000 },
  { month: "Jul", revenue: 22000 },
  { month: "Aug", revenue: 19500 },
  { month: "Sep", revenue: 23000 },
  { month: "Oct", revenue: 26000 },
  { month: "Nov", revenue: 28000 },
  { month: "Dec", revenue: 32000 }
];

export const topProducts: ProductSales[] = [
  { name: "Modern Studio Module", revenue: 120000 },
  { name: "Family Home Base Module", revenue: 180000 },
  { name: "Commercial Office Pod", revenue: 135000 },
  { name: "Starter Home Module", revenue: 95000 },
  { name: "Retail Store Module", revenue: 110000 }
];

export const orderStatuses: StatusDistribution[] = [
  { status: "Pending", count: 15 },
  { status: "In Production", count: 22 },
  { status: "Ready", count: 8 },
  { status: "Delivered", count: 45 },
  { status: "Cancelled", count: 5 }
];
