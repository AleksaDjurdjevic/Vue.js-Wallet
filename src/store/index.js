import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
<<<<<<< HEAD
    isLoggedIn:false,
    isRegistrated: false,
    defAccV:null,
    paramsForChart:[]
=======
    isLoggedIn:  false,
    isRegistrated: false
>>>>>>> 284976aae2a33289a0f606970e59174b99ac6d17
    },
  mutations: {
    CHANGE_IS_LOGGED_IN(state,payload){
      state.isLoggedIn=payload
    },
    CHANGE_DEF_ACC(state,payload){
      state.defAccV=payload
    },
    PARAMS_FOR_CHART_MUT(state,payload){
      state.paramsForChart=payload
    }
  },
  actions: {
    changeIsLoggedIn(store,payload){
      store.commit('CHANGE_IS_LOGGED_IN',payload)
    },
    changeDefAcc(store,payload){
      store.commit('CHANGE_DEF_ACC',payload)
    },
    paramsForChartAct(store,payload){
      store.commit('PARAMS_FOR_CHART_MUT',payload)
    }
  },
  modules: {
  },
  getters:{
    getDeffAcc:state=>{
      return state.defAccV
    }
  }
})
