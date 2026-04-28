import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import ProductView from '../views/ProductView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import EditProductView from '../views/admin/ProductView.vue'
import RegisterView from '../views/RegisterView.vue'

import { useAuthStore } from '@/stores/auth'
import UserView from '@/views/admin/UserView.vue'
import BranchView from '@/views/admin/BranchView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import CategoryView from '@/views/admin/CategoryView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import OrderSuccessView from '@/views/OrderSuccessView.vue'
import OrderView from '@/views/OrderView.vue'
import PaymentConfirmation from '@/views/PaymentConfirmation.vue'
import ShipmentView from '@/views/admin/ShipmentView.vue'
import OrderDetailView from '@/views/OrderDetailView.vue'
import CouponView from '@/views/admin/CouponView.vue'

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
    }, {
      path: '/forgot-password',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: '', name: 'forgot-password', component: ForgotPasswordView },
      ],
    },


    {
      path: '/',
      component: () => import('@/layouts/CustomerLayout.vue'), meta: { requiresAuth: true, role: 'customer' },
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'shop', name: 'shop', component: ShopView },
        { path: 'cart', name: 'cart', component: CartView },
        { path: 'checkout', name: 'checkout', component: CheckoutView },
        { path: 'dashbord', name: 'dashbord', component: DashboardView },
        { path: 'product/:id', name: 'product', component: ProductView },
        { path: 'order-success', name: 'order-success', component: OrderSuccessView },
        { path: 'orders', name: 'orders', component: OrderView },
        { path: 'payment-confirmation/:orderId', name: 'payment-confirmation', component: PaymentConfirmation },
        { path: 'order-succes/:orderId', name: 'order-succes', component: OrderSuccessView },
        { path: 'order-detail/:orderId', name: 'order-detail', component: OrderDetailView },





      ],
    },


    {
      path: '/admin',
      component: () => import('@/layouts/AppLayoutLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'product', name: 'editproduct', component: EditProductView },
        { path: 'user', name: 'user', component: UserView },
        { path: 'branch', name: 'branch', component: BranchView },
        { path: 'category', name: 'category', component: CategoryView },
        { path: 'shipment', name: 'manager-shipment', component: ShipmentView },
        { path: 'coupon', name: 'coupon', component: CouponView },

      ],
    }, {
      path: '/manager',
      component: () => import('@/layouts/AppLayoutLayout.vue'),
      meta: { requiresAuth: true, role: 'manager' },
      children: [
        { path: '', name: 'manager-dashboard', component: () => import('@/views/manager/DashboardView.vue') },
        { path: 'orders', name: 'manager-orders', component: () => import('@/views/manager/OrderView.vue') },
        { path: 'stock', name: 'manager-stock', component: () => import('@/views/manager/StockView.vue') },
        { path: 'staff', name: 'manager-staff', component: () => import('@/views/manager/StaffView.vue') },

      ],
    }, {
      path: '/staff',
      component: () => import('@/layouts/AppLayoutLayout.vue'),
      meta: { requiresAuth: true, role: 'staff' },
      children: [
        { path: '', name: 'staff-dashboard', component: () => import('@/views/staff/DashboardView.vue') },
        { path: 'orders', name: 'staff-orders', component: () => import('@/views/staff/OrderView.vue') },
        { path: 'stock', name: 'staff-stock', component: () => import('@/views/staff/StockView.vue') },

      ],
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.role

  // if (isAuth && !authStore.token) {
  //   return next({ name: 'login' })
  // }

  // if (authStore.user?.role)
  //   if (requiredRoles !== authStore.user?.role) {
  //     return next({ name: '403' })
  //   }

  next()

})

export default router