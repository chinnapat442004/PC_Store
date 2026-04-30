export interface AdminDashboardResponse {
    kpi: AdminDashboardKPI
    sales7days: Sales7DaysItem[]
    categorySales: CategorySalesItem[]
    topProducts: TopProductItem[]
    users: UsersOverview
}

export interface AdminDashboardKPI {
    todayRevenue: number
    monthlyRevenue: number
    orders: {
        total: number
        success: number
        cancelled: number
    }
    newUsers: number
}

export interface Sales7DaysItem {
    date: string
    revenue: number
}

export interface CategorySalesItem {
    category: string
    revenue: number
}

export interface TopProductItem {
    productId: number
    name: string
    sold: number
}

export interface LowStock {
    product_id: number;
    product_title: string;
    quantity: number;
    status: 'in stock' | 'low stock' | 'out of stock';
}
export interface UsersOverview {
    total: number
    manager: number
    staff: number
    customer: number
}

export interface ChartData {
    labels: string[]
    series: number[]
}


export interface OrderStatus {
    pending: number
    waiting_verify: number
    confirmed: number
    picking: number
    shipped: number
}

export interface OrderStatusSummary {
    status: OrderStatus
    totalPending: number
}
export interface ManagerDashboardResponse {
    kpi: ManagerDashboardKPI
    sales7days: Sales7DaysItem[]
    categorySales: CategorySalesItem[]
    orderStatusSummary: OrderStatusSummary
    topProducts: TopProductItem[]
    lowStock: LowStock[]
}

export interface ManagerDashboardKPI {
    todayRevenue: number
    monthlyRevenue: number
    orders: {
        total: number
        success: number
        cancelled: number
    }
    countStaff: number
}

export interface StaffDashboardResponse {
    orders: {
        total: number
        success: number
        cancelled: number
    }
    orderStatusSummary: OrderStatusSummary
    lowStock: LowStock[]
}