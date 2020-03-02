import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
<<<<<<< HEAD
    isLoggedIn:true
=======
    isLoggedIn: false,
>>>>>>> b93f0a37d9082e13192985657775e54376b7e2cf
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
