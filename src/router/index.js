import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
import Transaction from '../views/Transaction.vue'
=======
import Savings from '../components/Savings.vue'
>>>>>>> c65c5537ce42a0e0d096e5936cc768e4090ccddc

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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
