import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import CartView from '../views/CartView.vue'
import HeaderComponents from '../components/HeaderComponents.vue'
import LoginView from '../views/LoginView.vue'
import ProductView from '../views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: HomeView,
        sidebar: HeaderComponents,
      },
    },
    {
      path: '/shop',
      name: 'shop',
      components: {
        default: ShopView,
        sidebar: HeaderComponents,
      },
    },
    {
      path: '/cart',
      name: 'cart',
      components: {
        default: CartView,
        sidebar: HeaderComponents,
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
        sidebar: HeaderComponents,
      },
    },
  ],
})

export default router
