import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import ProductView from '../views/ProductView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import EditProductView from '../views/admin/ProductView.vue'
import RegisterView from '../views/RegisterView.vue'
import BrandView from '@/views/admin/BrandView.vue'
import SystemSettingsView from '@/views/admin/SystemSettingsView.vue'
import { useAuthStore } from '@/stores/auth'
import UserView from '@/views/admin/UserView.vue'
import BranchView from '@/views/admin/BranchView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import CategoryView from '@/views/admin/CategoryView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

   
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: '', name: 'login', component: LoginView },
      ],
    },
    {
      path: '/register',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: '', name: 'register', component: RegisterView },
      ],
    },{
      path: '/forgot-password',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: '', name: 'forgot-password', component: ForgotPasswordView },
      ],
    },

   
    {
      path: '/',
      component: () => import('@/layouts/CustomerLayout.vue'),
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'shop', name: 'shop', component: ShopView },
        { path: 'cart', name: 'cart', component: CartView },
        { path: 'checkout', name: 'checkout', component: CheckoutView },
         { path: 'dashbord', name: 'dashbord', component: DashboardView },
        { path: 'product/:id', name: 'product', component: ProductView },
        
      ],
    },

   
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true ,role: 'admin'},
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'product', name: 'editproduct', component: EditProductView },
        { path: 'user', name: 'user', component: UserView },
        { path: 'branch', name: 'branch', component: BranchView },
        { path: 'category', name: 'category', component: CategoryView },
        { path: 'brand', name: 'brand', component:   BrandView },  
        { path: 'setting', name: 'setting', component:   SystemSettingsView},

      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.role 

  if (isAuth && !authStore.token) {
    return next({ name: 'login' })
  }

if(authStore.user?.role)
  if (requiredRoles !== authStore.user?.role) {
    return next({ name: '403' }) 
  }

    next()
  
})

export default router