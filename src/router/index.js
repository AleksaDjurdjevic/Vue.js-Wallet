import Vue from 'vue'
import VueRouter from 'vue-router'
import Savings from '../views/Savings.vue'
import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import Profile from '@/views/Profile.vue'
import Transactions from '@/views/Transactions.vue'
import Statistics from '@/views/Statistics.vue'
import store from '../store/index.js';
import axios from 'axios';

Vue.use(VueRouter)

function blockForLoggedOut(to, from, next){
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

function blockForLoggedIn(to, from, next){
  axios
    .get(
      "http://053n122.mars-e1.mars-hosting.com/api/wallet/checkSession",
      {
        params:{sid: localStorage.getItem("sid")}
      }
    )
    .then(() => {
      next('/');
    }).catch(() => {
      store.dispatch('changeIsLoggedIn', false);
      next();
    });
}

const routes = [
  {
    path: '/savings',
    component: Savings,
    beforeEnter: blockForLoggedOut
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: blockForLoggedIn
  },
  {
    path: '/registartion',
    name: 'Registration',
    component: Registration,
    beforeEnter: blockForLoggedIn
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: blockForLoggedOut
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
    beforeEnter: blockForLoggedOut
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    beforeEnter: blockForLoggedOut
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