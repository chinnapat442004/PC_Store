import { defineStore } from 'pinia'
import { ref } from 'vue'
import branchService from '../service/branch'
import type { Branch } from '@/types/Branch'
import { useLoadingStore } from './loading'
export const useBranchStore = defineStore('branch', () => {
  const branches = ref<Branch[]>([])
  const loadingStore = useLoadingStore()
  const initialBranch: Branch = {
    address: '',
    branch_name: '',
    status: 'active',
    lat: undefined,
    lng: undefined,
    is_active: true,
  }

  const page = ref(1)
  const limit = ref(10)
  const lastPage = ref(1)
  const total = ref(0)
  const search = ref('')

  const editedBranch = ref(<Branch>structuredClone(initialBranch))

  async function getBranches(
    p = page.value,
    l = limit.value,
    s = search.value,
    onlyActive = false,
  ) {
    loadingStore.doLoad()
    const res = await branchService.getBranches(p, l, s, onlyActive)

    branches.value = res.data.data
    page.value = res.data.page
    lastPage.value = res.data.lastPage
    total.value = res.data.total
    loadingStore.finishLoad()
  }

  async function addBranch(branch: Branch) {
    await branchService.createBranch(branch)
    await getBranches()
  }

  async function updateBranch(branch: Branch) {
    await branchService.updateBranch(branch)
    await getBranches()
  }

  async function toggleBranchActive(branch_id: number) {
    try {
      const res = await branchService.toggleBranchActive(branch_id)

      branches.value = branches.value.map((branch) => {
        if (branch.branch_id === branch_id) {
          return {
            ...branch,
            is_active: res.data.is_active,
          }
        }

        return branch
      })

      return res
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  function clearBranch() {
    editedBranch.value = JSON.parse(JSON.stringify(initialBranch))
  }

  return {
    branches,
    page,
    limit,
    lastPage,
    total,
    editedBranch,
    search,
    getBranches,
    addBranch,
    updateBranch,
    toggleBranchActive,
    clearBranch,
  }
})
