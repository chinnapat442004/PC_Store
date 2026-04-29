import { Injectable } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { StockService } from 'src/stock/stock.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class ManagerDashboardService {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly usersService: UserService,
        private readonly stocksService: StockService
    ) { }

    async getKPI(branchId: number) {
        const [todayRevenue, monthlyRevenue, orders, countStaff] =
            await Promise.all([
                this.ordersService.getTodayRevenue(branchId),
                this.ordersService.getMonthlyRevenue(branchId),
                this.ordersService.getTotalOrders(branchId),
                this.usersService.countStaffInMyBranch(branchId),
            ]);

        return {
            todayRevenue,
            monthlyRevenue,
            orders,
            countStaff,
        };
    }


    async getDashboardOverview(branchId) {
        const [kpi, sales7days, categorySales, topProducts, orderStatusSummary, lowStock] =
            await Promise.all([
                this.getKPI(branchId),
                this.ordersService.getSalesLast7Days(branchId),
                this.ordersService.getSalesByCategory(branchId),
                this.ordersService.getTopProducts(branchId),
                this.ordersService.getPendingOrdersDashboard(branchId),
                this.stocksService.getLowStock(branchId)


            ]);

        return {
            kpi,
            sales7days,
            categorySales,
            topProducts,
            orderStatusSummary,
            lowStock

        };
    }
}