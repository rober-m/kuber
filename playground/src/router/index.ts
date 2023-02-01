import { createRouter, createWebHistory } from 'vue-router'
import Ide from '@/components/Ide.vue'

console.log(import.meta.env.BASE_URL)

const pathregex  = new RegExp('.*')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // @ts-ignore
      path: '/',
      name: 'home',
      component: Ide
    },
    {
      path: '/kuber',
      name: 'kuber',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Ide
    }
  ]
})

export default router
