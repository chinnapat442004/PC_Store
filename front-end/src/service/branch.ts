import type { Branch } from '@/types/Branch'
import http from './http'

function getBranches(page: number, limit: number, search: string) {
  return http.get(`/branch?page=${page}&limit=${limit}&search=${search}`)
}

function createBranch(branch: Branch) {
  return http.post('/branch', branch)
}

function updateBranch(branch: Branch) {
  return http.patch(`/branch/${branch.branch_id}`, branch)
}

function deleteBranch(branch: Branch) {
  return http.delete(`/branch/${branch.branch_id}`)
}
export default { getBranches, createBranch, updateBranch, deleteBranch }
