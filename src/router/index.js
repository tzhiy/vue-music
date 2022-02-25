import { createRouter, createWebHashHistory } from 'vue-router'
import Recommend from '@/views/recommend'
import Singer from '@/views/singer'
import Toplist from '@/views/top-list'
import Search from '@/views/search'
const routes = [
  {
    path: '/',
    // 默认指向 /recommend
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/singer',
    component: Singer
  },
  {
    path: '/top-list',
    component: Toplist
  },
  {
    path: '/search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
