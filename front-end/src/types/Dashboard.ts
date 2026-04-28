
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