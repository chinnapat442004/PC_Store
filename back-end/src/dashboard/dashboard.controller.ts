import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboard: DashboardService) { }

    @Get('admin/kpi')
    adminKPI() {
        return this.dashboard.getAdminKPI();
    }
    @Get('admin/overview')
    adminOverview() {
        return this.dashboard.getAdminOverview();
    }


}