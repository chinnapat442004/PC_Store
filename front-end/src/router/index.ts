import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import CartView from '../views/CartView.vue'
import HeaderComponents from '../components/HeaderComponents.vue' // นำเข้า HeaderComponents

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: HomeView, // ระบุให้ HomeView เป็น default component
        sidebar: HeaderComponents, // ระบุให้ HeaderComponents เป็น menu component
      },
    },
    {
      path: '/shop',
      name: 'shop',
      components: {
        default: ShopView, // ระบุให้ ShopView เป็น default component
        sidebar: HeaderComponents, // ระบุให้ HeaderComponents เป็น menu component
      },
    },
    {
      path: '/cart',
      name: 'cart',
      components: {
        default: CartView, // ระบุให้ CartView เป็น default component
        sidebar: HeaderComponents, // ระบุให้ HeaderComponents เป็น menu component
      },
    },
  ],
})

export default router
