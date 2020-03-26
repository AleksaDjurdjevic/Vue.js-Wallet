<template>
  <div>
      <home />
  </div>
</template>

<script>
import axios from "axios";
import {mapActions} from 'vuex';
import Home from "../views/Home";
export default {
  mounted() {
      this.logout()
  }, 
  components:{
    'home': Home
  },
  methods: {
    ...mapActions(['paramsForChartAct']),
    logout() {
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/logout", {
          sid: localStorage.getItem("sid")
        })
        .then(() => {
          this.$store.state.isLoggedIn = false;
          this.paramsForChartAct([]);
          localStorage.clear();
          this.$router.push('/');
        })
        .catch(() => {
          localStorage.clear();
        });
        this.$store.state.isRegistrated = false;  
    }
  }
};
</script>

<style>
</style>