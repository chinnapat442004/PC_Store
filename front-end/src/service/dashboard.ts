
import http from "./http";

function getAdminDashboard() {
    return http.get('/dashboard/admin/overview')
}

function getManagerDashboard() {
    return http.get('/dashboard/manager/overview')
}

export default { getAdminDashboard, getManagerDashboard }