import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/blo',
      name: 'lottery',
      component: () => import('../views/LotteryView.vue'),
    },
    {
      path: '/programacao',
      name: 'events-schedule',
      component: () => import('../views/EventsScheduleView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
