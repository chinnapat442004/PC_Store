import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboard: DashboardService) { }


    @Get('admin/overview')
    adminOverview() {
        return this.dashboard.getAdminOverview();
    }

    @Get('manager/overview')

    managerOverview(@Req() req,) {
        return this.dashboard.getManagerOverview(req.user.branch_id)
    }

    @Get('staff/overview')

    staffOverview(@Req() req,) {
        return this.dashboard.getStaffOverview(req.user.branch_id)
    }


}