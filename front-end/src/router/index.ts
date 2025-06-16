import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import CartView from '../views/CartView.vue'
import HeaderComponents from '../components/HeaderComponents.vue'
import LoginView from '../views/LoginView.vue'
import ProductView from '../views/ProductView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
import EditProductView from '../views/admin/ProductView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: HomeView,
        navbar: HeaderComponents,
      },
    },
    {
      path: '/shop',
      name: 'shop',
      components: {
        default: ShopView,
        navbar: HeaderComponents,
      },
    },
    {
      path: '/cart',
      name: 'cart',
      components: {
        default: CartView,
        navbar: HeaderComponents,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => LoginView,
    },
    {
      path: '/product/:id',
      name: 'product',
      components: {
        default: ProductView,
        navbar: HeaderComponents,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      components: {
        default: DashboardView,
        sidebar: SidebarComponent,
      },
    },
    {
      path: '/editproduct',
      name: 'editproduct',
      components: {
        default: EditProductView,
        sidebar: SidebarComponent,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => RegisterView,
    },
    {
      path: '/forgot-password',
      name: ' forgotPassword',
      component: () => ForgotPasswordView,
    },
  ],
})

export default router
