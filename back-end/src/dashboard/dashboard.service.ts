import { Injectable } from '@nestjs/common';
import { AdminDashboardService } from './admin/admin-dashboard.service';
import { ManagerDashboardService } from './manager/manager-dashboard.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly admin: AdminDashboardService,
        private readonly manager: ManagerDashboardService
    ) { }

    getAdminKPI() {
        return this.admin.getKPI();
    }

    getAdminOverview() {
        return this.admin.getDashboardOverview()
    }

    getManagerOverview(branchId?: number) {
        return this.manager.getDashboardOverview(branchId)
    }


}