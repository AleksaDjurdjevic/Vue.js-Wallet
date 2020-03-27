import Vue from 'vue'
import VueRouter from 'vue-router'
import Savings from '../views/Savings.vue'
import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import Profile from '@/views/Profile.vue'
import LogOut from '@/views/LogOut.vue'
import Transactions from '@/views/Transactions.vue'
import Statistics from '@/views/Statistics.vue'
import store from '../store/index.js';
import axios from 'axios';

Vue.use(VueRouter)

function blockRoute(to, from, next){
  axios
    .get(
      "http://053n122.mars-e1.mars-hosting.com/api/wallet/checkSession",
      {
        params:{sid: localStorage.getItem("sid")}
      }
    )
    .then(() => {
      store.dispatch('changeIsLoggedIn', true);
      next();
    }).catch(() => {
      next('/');
    });
}

const routes = [
  {
    path: '/savings',
    component: Savings,
    beforeEnter: blockRoute
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
    beforeEnter: blockRoute
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: blockRoute
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
    beforeEnter: blockRoute
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    beforeEnter: blockRoute
  },
  {
    path: '*',
    component: Home
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router