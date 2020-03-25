<template>
  <div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
      this.logout()
  }, 
  methods: {
    logout() {
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/logout", {
          sid: localStorage.getItem("sid")
        })
        .then(() => {
          this.$store.state.isLoggedIn = false;
          localStorage.clear();
          this.$store.state.isLoggedIn;
        })
        .catch(() => {
          localStorage.clear();
        });
        this.email = null,
        this.password = null,
        this.name = null,
        this.$store.state.isLoggedIn = false;
        this.$store.state.isRegistrated = false;

        this.$router.push('/');
        this.$store.dispatch('paramsForChartAct', []);
    }
  }
};
</script>

<style>
</style>