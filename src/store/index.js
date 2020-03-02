import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn:false
  },
  mutations: {
    CHANGE_IS_LOGGED_IN(state,payload){
      state.isLoggedIn=payload
    }
  },
  actions: {
    changeIsLoggedIn(store,payload){
      store.commit('CHANGE_IS_LOGGED_IN',payload)
    }
  },
  modules: {
  }
})
