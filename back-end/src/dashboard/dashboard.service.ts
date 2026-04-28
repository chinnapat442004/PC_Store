import { Injectable } from '@nestjs/common';
import { AdminDashboardService } from './admin/admin-dashboard.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly admin: AdminDashboardService,
    ) { }


    getAdminKPI() {
        return this.admin.getKPI();
    }

    getAdminOverview() {
        return this.admin.getDashboardOverview()

    }
}