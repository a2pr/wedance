import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/day',
      name: 'day',
      component: () => import('../views/DayView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/day',
    },
  ],
})

export default router
