import Vue from 'vue'
import VueRouter from 'vue-router'
import Savings from '../components/Savings.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Savings
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
