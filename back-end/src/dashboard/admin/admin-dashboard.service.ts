import { Injectable } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AdminDashboardService {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly usersService: UserService,
    ) { }

    async getKPI() {
        const [todayRevenue, monthlyRevenue, orders, newUsers] =
            await Promise.all([
                this.ordersService.getTodayRevenue(),
                this.ordersService.getMonthlyRevenue(),
                this.ordersService.getTotalOrders(),
                this.usersService.getNewCustomersMonth(),
            ]);

        return {
            todayRevenue,
            monthlyRevenue,
            orders,
            newUsers,
        };
    } async getDashboardOverview() {
        const [
            kpi,
            sales7days,
            categorySales,
            topProducts,
            users,
        ] = await Promise.all([
            this.getKPI(),
            this.ordersService.getSalesLast7Days(),
            this.ordersService.getSalesByCategory(),
            this.ordersService.getTopProducts(),
            this.usersService.getUserStats(),
        ]);

        return {
            kpi,
            sales7days,
            categorySales,
            topProducts,
            users,
        };
    }
}