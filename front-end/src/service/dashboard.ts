
import http from "./http";

function getAdminDashboard() {
    return http.get('/dashboard/admin/overview')
}

export default { getAdminDashboard }