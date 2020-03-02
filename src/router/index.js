import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
import Savings from '../components/Savings.vue'
=======
import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'

>>>>>>> 92daf2297d1584e61baa2865a75519840386b096

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Savings
  },
<<<<<<< HEAD
=======
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
>>>>>>> 92daf2297d1584e61baa2865a75519840386b096
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
