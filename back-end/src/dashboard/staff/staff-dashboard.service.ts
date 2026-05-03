import { Injectable } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { StockService } from 'src/stock/stock.service';

@Injectable()
export class StaffDashboardService {
  constructor(
    private readonly ordersService: OrdersService,

    private readonly stocksService: StockService,
  ) {}

  async getDashboardOverview(branchId: number) {
    const [orders, orderStatusSummary, lowStock] = await Promise.all([
      this.ordersService.getTotalOrders(branchId),
      this.ordersService.getPendingOrdersDashboard(branchId),
      this.stocksService.getLowStock(branchId),
    ]);

    return {
      orders,
      orderStatusSummary,
      lowStock,
    };
  }
}
