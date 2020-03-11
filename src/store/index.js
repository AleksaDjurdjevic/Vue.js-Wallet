import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    isRegistrated: false,
    defAccV: null,
    paramsForChart: [],
    allTransactionVuex:[]
  },
  mutations: {
    CHANGE_IS_LOGGED_IN(state, payload) {
      state.isLoggedIn = payload
    },
    CHANGE_DEF_ACC(state, payload) {
      state.defAccV = payload
    },
    PARAMS_FOR_CHART_MUT(state, payload) {
      state.paramsForChart = payload
    },
    
    ALL_TRANSACTION_VUEX(state, payload){
      state.allTransactionVuex=payload
    }
  },
  actions: {
    changeIsLoggedIn(store, payload) {
      store.commit('CHANGE_IS_LOGGED_IN', payload)
    },
    changeDefAcc(store, payload) {
      store.commit('CHANGE_DEF_ACC', payload)
    },
    paramsForChartAct(store, payload) {
      store.commit('PARAMS_FOR_CHART_MUT', payload)
    },
   
    allTransactionVuexAct(store, payload){
      store.commit('ALL_TRANSACTION_VUEX', payload)
    }
  },
  modules: {
  },
  getters: {
    getDeffAcc: state => {
      return state.defAccV
    }
  }
})
