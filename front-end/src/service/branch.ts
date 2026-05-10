import type { Branch } from '@/types/Branch'
import http from './http'

function getBranches(page: number, limit: number, search: string, onlyActive?: boolean) {
  return http.get(
    `/branch?page=${page}&limit=${limit}&search=${search}&onlyActive=${onlyActive || false}`,
  )
}

function createBranch(branch: Branch) {
  return http.post('/branch', branch)
}

function updateBranch(branch: Branch) {
  return http.patch(`/branch/${branch.branch_id}`, branch)
}

function toggleBranchActive(id: number) {
  return http.patch(`/branch/${id}/toggle-active`)
}

export default { getBranches, createBranch, updateBranch, toggleBranchActive }
