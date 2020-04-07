import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vue.use(VueReCaptcha, { siteKey: '6Lcak-cUAAAAAKswQ4YMo7BHsla5Qgi-orzyb74P' })
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
