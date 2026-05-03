import { Injectable } from '@nestjs/common';
import { AdminDashboardService } from './admin/admin-dashboard.service';
import { ManagerDashboardService } from './manager/manager-dashboard.service';
import { StaffDashboardService } from './staff/staff-dashboard.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly admin: AdminDashboardService,
    private readonly manager: ManagerDashboardService,
    private readonly staff: StaffDashboardService,
  ) {}

  getAdminOverview() {
    return this.admin.getDashboardOverview();
  }

  getManagerOverview(branchId?: number) {
    return this.manager.getDashboardOverview(branchId);
  }

  getStaffOverview(branchId?: number) {
    return this.staff.getDashboardOverview(branchId);
  }
}
