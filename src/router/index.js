import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
<<<<<<< HEAD
import Transaction from '../views/Transaction.vue'
=======
import Savings from '../components/Savings.vue'
>>>>>>> c65c5537ce42a0e0d096e5936cc768e4090ccddc
=======
import Savings from '../components/Savings.vue'
=======
import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'

>>>>>>> 92daf2297d1584e61baa2865a75519840386b096
>>>>>>> b93f0a37d9082e13192985657775e54376b7e2cf

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
<<<<<<< HEAD
    name: 'Transaction',
    component: Transaction
=======
    component: Savings
>>>>>>> c65c5537ce42a0e0d096e5936cc768e4090ccddc
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
