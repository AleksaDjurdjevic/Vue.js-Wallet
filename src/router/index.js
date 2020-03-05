import Vue from 'vue'
import VueRouter from 'vue-router'
import Savings from '../views/Savings.vue'
import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import Profile from '@/views/Profile.vue'
import LogOut from '@/views/LogOut.vue'
import Transaction from '@/views/Transaction.vue'
import Statistics from '@/views/Statistics.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/savings',
    component: Savings
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/registartion',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/logOut',
    name: 'LogOut',
    component: LogOut,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/transaction',
    name: 'Transaction',
    component: Transaction
  }
  ,
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router