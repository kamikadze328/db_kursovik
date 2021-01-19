import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue'
import BreakdownsList from "@/views/BreakdownsList";
import Breakdown from "@/views/Breakdown";
import AddNewBreakdown from "@/views/AddNewBreakdown";

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {title: 'Главная страница'},
    component: Home
  },
  {
    path: '/add_new_breakdown',
    name: 'AddNewBreakdown',
    props: true,
    meta: {title: 'Добавить поломку'},
    component: AddNewBreakdown
  },
  {
    path: '/breakdown/:idStr',
    name: 'Breakdown',
    props: true,
    meta: {title: 'Поломка'},
    component: Breakdown
  },
  {
    path: '/breakdowns',
    name: 'BreakdownsList',
    meta: {title: 'Список поломок'},
    component: BreakdownsList
  },
  {
    path: '/admin_panel',
    name: 'AdminPanel',
    meta: {title: 'Панель администратора'},
    component: () => import(/* webpackChunkName: "admin-panel" */ '@/views/AdminPanel'),
    children: [
      {
        path: 'spaceships',
        component: () => import(/* webpackChunkName: "admin-panel" */ '@/views/adminPanel/Spaceships'),
        name: 'AdminPanelSpaceships',
        meta: {title: 'Корабли'},
        props: true
      },
      {
        path: 'planets',
        component: () => import(/* webpackChunkName: "admin-panel" */ '@/views/adminPanel/Planet'),
        name: 'AdminPanelPlanets',
        meta: {title: 'Планеты'},
        props: true

      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Поломки Ру';
  next();
});

export default router
