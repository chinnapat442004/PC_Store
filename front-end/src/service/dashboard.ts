import http from './http'

function getAdminDashboard() {
  return http.get('/dashboard/admin/overview')
}

function getManagerDashboard() {
  return http.get('/dashboard/manager/overview')
}

function getStaffDashboard() {
  return http.get('/dashboard/staff/overview')
}

export default { getAdminDashboard, getManagerDashboard, getStaffDashboard }
