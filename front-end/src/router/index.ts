import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import CartView from '../views/CartView.vue'
import HeaderComponents from '../components/HeaderComponent.vue'
import LoginView from '../views/LoginView.vue'
import ProductView from '../views/ProductView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
import EditProductView from '../views/admin/ProductView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import { useAuthStore } from '@/stores/auth'
import UserView from '@/views/admin/UserView.vue'
import BranchView from '@/views/admin/BranchView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import CategoryView from '@/views/admin/CategoryView.vue'

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
   
    },  {
      path: '/checkout',
      name: 'checkout',
      components: {
        default: CheckoutView,
        navbar: HeaderComponents,
      },
   
    },
    {
      path: '/login',
      name: 'login',
       component: () => import('../views/LoginView.vue'),
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
      path: '/user',
      name: 'user',
      components: {
        default: UserView,
        sidebar: SidebarComponent,
      },
    },
    {
      path: '/branch',
      name: 'branch',
      components: {
        default: BranchView,
        sidebar: SidebarComponent,
      },
    },{
      path: '/category',
      name: 'category',
      components: {
        default: CategoryView,
        sidebar: SidebarComponent,
      },
    },
    {
      path: '/register',
      name: 'register',
         component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: ' forgotPassword',
          component: () => import('../views/ForgotPasswordView.vue'),
    },
    
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next({ name: 'login' })
  } else {
    next()
  }
})
export default router
